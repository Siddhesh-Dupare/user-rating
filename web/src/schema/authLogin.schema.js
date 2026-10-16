import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(5, { message: "Email is required" })
    .pipe(z.email({ message: "Invalid email address. " })),

  password: z
    .string()
    .min(8, { message: "Password must be 8 characters long." })
    .max(16, { message: "Password is too long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
});
