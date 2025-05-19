import { z } from "zod";

export const signInSchema = z.object({
  // email
  identifier: z
    .string()
    .min(1, { message: "Email or username is required." })
    .email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});
