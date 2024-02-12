import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Enter a valid email" })
    .min(3),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password is too short" })
    .max(100, { message: "Password is too long" }),
  redirectTo: z.string().optional(),
  remember: z.boolean().optional(),
});
