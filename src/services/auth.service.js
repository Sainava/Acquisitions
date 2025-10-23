import { db } from "#config/database.js";
import logger from "#config/logger.js";
import bcrypt from 'bcrypt';
import { eq } from "drizzle-orm";
import { users } from "#models/user.model.js";


export const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (e) {
        logger.error("Error hashing the password", e);
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
            throw new Error("User already exists");
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

        logger.info("User created successfully", newUser.email);
        return newUser;
    } catch (e) {
        logger.error("Error creating user", e);
            // Preserve specific errors for the controller to handle (e.g., 409 conflict)
            if (e && e.message === 'User already exists') {
                throw e;
            }
            throw new Error('Error creating user');
    }
};