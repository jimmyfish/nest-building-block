import { z } from 'zod';

export const RegisterSchema = z.object({
  username: z
    .string({
      required_error: 'Username is required',
    })
    .min(3),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter',
    })
    .regex(/[0-9]/, {
      message: 'Password must contain at least one numeric digit',
    })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: 'Password must contain at least one special character',
    })
    .regex(/^(?!.*(012|123|234|345|456|567|678|789)).*$/, {
      message: 'Password must not contain sequential numbers',
    })
    .regex(/^(?!.*(\d)\1{2,}).*$/, {
      message:
        'Password must not contain repeated numeric values (e.g., 111, 222)',
    })
    .regex(/^(?!.*([a-zA-Z])\1{2,}).*$/, {
      message:
        'Password must not contain repeated alphabetic characters (e.g., AAA, bbb, CCC)',
    }),
  name: z.string({
    required_error: 'Name is required',
  }),
});

export const LoginSchema = z.object({
  username: z.string({
    required_error: 'Username is required',
  }),
  password: z.string({
    required_error: 'Password is required',
  }),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
export type LoginDto = z.infer<typeof LoginSchema>;
