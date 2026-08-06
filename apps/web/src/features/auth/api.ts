import type {
  AuthResponse,
  ForgotPasswordInput,
  GoogleLoginInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  UserDTO,
  VerifyOtpInput,
} from "@haritha/shared-types";
import { apiClient } from "../../lib/apiClient";

export async function registerRequest(input: RegisterInput): Promise<AuthResponse> {
  const { data } = await apiClient.post("/auth/register", input);
  return data;
}

export async function verifyOtpRequest(input: VerifyOtpInput): Promise<AuthResponse> {
  const { data } = await apiClient.post("/auth/verify-otp", input);
  return data;
}

export async function resendOtpRequest(userId: string): Promise<void> {
  await apiClient.post("/auth/resend-otp", { userId });
}

export async function loginRequest(input: LoginInput): Promise<AuthResponse> {
  const { data } = await apiClient.post("/auth/login", input);
  return data;
}

export async function googleLoginRequest(input: GoogleLoginInput): Promise<AuthResponse> {
  const { data } = await apiClient.post("/auth/google", input);
  return data;
}

export async function forgotPasswordRequest(input: ForgotPasswordInput): Promise<void> {
  await apiClient.post("/auth/forgot-password", input);
}

export async function resetPasswordRequest(input: ResetPasswordInput): Promise<void> {
  await apiClient.post("/auth/reset-password", input);
}

export async function logoutRequest(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function fetchCurrentUser(): Promise<UserDTO> {
  const { data } = await apiClient.get("/auth/me");
  return data.user;
}
