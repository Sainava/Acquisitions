import { z } from 'zod';

const emailSchema = z
    .string()
    .email('Invalid email address')
    .max(255)
    .trim()
    .transform((v) => v.toLowerCase());

export const signUpSchema = z.object({
    name: z.string().min(2).max(255).trim(),
    email: emailSchema,
    password: z.string().min(6).max(128),
    role: z.enum(['user', 'admin']).default('user'),
});

export const signInSchema = z.object({
    email: emailSchema,
    password: z.string().min(6).max(128),
});

