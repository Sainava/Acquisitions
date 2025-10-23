import jwt from 'jsonwebtoken';
import logger from '#config/logger.js';

const JWT_SECRET=process.env.JWT_SECRET || 'your-jwt-secret-key-please-change-in-production';

const JWT_EXPIRES_IN='1d'; // 1 day

export const jwttoken={
    sign:(payload)=>{
        try{
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
            return token;
        }catch(error){
            logger.error('Failed to authenticate token',error);
            throw new Error('Failed to authenticate token');
        }
    },
    verify:(token)=>{
        try{
            const decoded = jwt.verify(token, JWT_SECRET);
            return decoded;
        }catch(error){
            logger.error('Failed to authenticate token',error);
            throw new Error('Failed to authenticate token');
        }
    }
};