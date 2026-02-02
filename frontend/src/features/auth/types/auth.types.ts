import { z } from 'zod';

// Esquema de validación para Login
export const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

// Esquema de validación para Registro
export const registerSchema = z.object({
  username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

// Tipos de Respuesta del Backend
export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    _id: string;
    username: string;
    role: string;
  };
}