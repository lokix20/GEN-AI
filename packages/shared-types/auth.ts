import { z } from "zod";
import { RoleSchema } from "./common.js";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: RoleSchema.default("FARMER"),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const VerifyOtpSchema = z.object({
  userId: z.string(),
  code: z.string().length(6, "Enter the 6-digit code"),
  purpose: z.enum(["EMAIL_VERIFY", "PHONE_VERIFY", "PASSWORD_RESET"]),
});
export type VerifyOtpInput = z.infer<typeof VerifyOtpSchema>;

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
});
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z.object({
  email: z.string().email("Enter a valid email"),
  code: z.string().length(6, "Enter the 6-digit code"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

export const GoogleLoginSchema = z.object({
  idToken: z.string(),
});
export type GoogleLoginInput = z.infer<typeof GoogleLoginSchema>;

export const UserDTOSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  role: RoleSchema,
  onboarded: z.boolean(),
  emailVerified: z.boolean(),
  createdAt: z.string(),
});
export type UserDTO = z.infer<typeof UserDTOSchema>;

export const AuthResponseSchema = z.object({
  user: UserDTOSchema,
  accessToken: z.string(),
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
