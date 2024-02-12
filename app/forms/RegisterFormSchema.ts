import { z } from "zod";

export const RegisterFormSchema = z.object({
  firstName: z.string({ required_error: "First name is required" }),
  lastName: z.string({ required_error: "Last name is required" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Enter a valid email" })
    .min(3),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password is too short" })
    .max(100, { message: "Password is too long" }),
  redirectTo: z.string().optional(),
});
