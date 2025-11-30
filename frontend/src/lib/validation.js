// src/lib/validation.js
import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be 3+ chars').regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, _'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be 6+ chars'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});