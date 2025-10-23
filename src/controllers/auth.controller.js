import { signUpSchema } from "#validations/auth.validation.js"; 
import { formatValidationErrors } from "#utils/format.js";  
import logger from "#config/logger.js";
import { createUser } from "#services/auth.service.js";
import { jwttoken } from "#utils/jwt.js";
import { cookies } from "#utils/cookies.js";

export const signup = async (req, res, next) => {
    try{
        // Validate request body using Zod
        const validationResult = signUpSchema.safeParse(req.body);

        if(!validationResult.success){
            return res.status(400).json({
                error:'Validation failed',
                details : formatValidationErrors(validationResult.error)
            });
        }

    const { name, email,password, role } = validationResult.data;

        //Auth Service
        const user=await createUser({name,email,password,role});

    const token = jwttoken.sign({ id: user.id, email: user.email, role: user.role });

    // Set auth token cookie
    cookies.setCookie(res, 'token', token);

        logger.info('User registered successfully', {name,email,role});
        res.status(201).json({
            message: 'User registered successfully',
            user: {id:user.id,name:user.name,email:user.email,role:user.role}
        });

    } catch (e) {
        logger.error('Signup error', e);

        if (e?.message === 'User already exists') {
            return res.status(409).json({ error: 'Email already exists' });
        }

        next(e);
    }
};