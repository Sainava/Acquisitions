import { db } from '#config/database.js';
import logger from '#config/logger.js';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { users } from '#models/user.model.js';

export const hashPassword = async password => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (e) {
    logger.error('Error hashing the password', e);
    throw new Error('Error hashing password');
  }
};

export const createUser = async ({ name, email, password, role = 'user' }) => {
  try {
    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('User already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Insert user. Note: model column is 'roll' (typo) so map role -> roll for now
    const [newUser] = await db
      .insert(users)
      .values({ name, email, password: passwordHash, roll: role })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.roll,
        createdAt: users.createdAt,
      });

    logger.info('User created successfully', newUser.email);
    return newUser;
  } catch (e) {
    logger.error('Error creating user', e);
    // Preserve specific errors for the controller to handle (e.g., 409 conflict)
    if (e && e.message === 'User already exists') {
      throw e;
    }
    throw new Error('Error creating user');
  }
};

export const comparePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (e) {
    logger.error('Error comparing password', e);
    throw new Error('Error comparing password');
  }
};

export const authenticateUser = async ({ email }) => {
  try {
    const [record] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        password: users.password,
        role: users.roll,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!record) {
      throw new Error('User not found');
    }

    const isValid = await comparePassword(password, record.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // Return sanitized user without password
    const { password, ...user } = record;
    return user;
  } catch (e) {
    logger.error('Error authenticating user', e);
    if (
      e &&
      (e.message === 'User not found' || e.message === 'Invalid credentials')
    ) {
      throw e;
    }
    throw new Error('Error authenticating user');
  }
};
