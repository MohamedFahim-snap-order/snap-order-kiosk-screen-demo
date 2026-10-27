import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter the work email.")
    .refine((value) => /^[^\s@]+@[^\s@]+$/.test(value), "Enter the work email."),
  password: z.string().min(1, "Enter the password."),
});

export type SignInValues = z.infer<typeof signInSchema>;
