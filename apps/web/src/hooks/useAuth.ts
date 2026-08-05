import { useCallback, useEffect } from "react";
import type {
  ForgotPasswordInput,
  GoogleLoginInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  VerifyOtpInput,
} from "@haritha/shared-types";
import { refreshAccessToken } from "../lib/apiClient";
import { useAuthStore } from "../store/auth.store";
import * as authApi from "../features/auth/api";

export function useBootstrapSession() {
  const setBootstrapping = useAuthStore((s) => s.setBootstrapping);

  useEffect(() => {
    let cancelled = false;

    // Timeout fallback — if API is unreachable, stop bootstrapping after 3s
    const timeout = setTimeout(() => {
      if (!cancelled) setBootstrapping(false);
    }, 3000);

    refreshAccessToken()
      .finally(() => {
        clearTimeout(timeout);
        if (!cancelled) setBootstrapping(false);
      });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [setBootstrapping]);
}

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const isBootstrapping = useAuthStore((s) => s.isBootstrapping);
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);

  const register = useCallback((input: RegisterInput) => authApi.registerRequest(input), []);

  const verifyOtp = useCallback(
    async (input: VerifyOtpInput) => {
      const result = await authApi.verifyOtpRequest(input);
      setSession(result.user, result.accessToken);
      return result;
    },
    [setSession],
  );

  const resendOtp = useCallback((userId: string) => authApi.resendOtpRequest(userId), []);

  const login = useCallback(
    async (input: LoginInput) => {
      const result = await authApi.loginRequest(input);
      setSession(result.user, result.accessToken);
      return result;
    },
    [setSession],
  );

  const loginWithGoogle = useCallback(
    async (input: GoogleLoginInput) => {
      const result = await authApi.googleLoginRequest(input);
      setSession(result.user, result.accessToken);
      return result;
    },
    [setSession],
  );

  const forgotPassword = useCallback((input: ForgotPasswordInput) => authApi.forgotPasswordRequest(input), []);
  const resetPassword = useCallback((input: ResetPasswordInput) => authApi.resetPasswordRequest(input), []);

  const logout = useCallback(async () => {
    await authApi.logoutRequest().catch(() => undefined);
    clearSession();
  }, [clearSession]);

  return {
    user,
    accessToken,
    isAuthenticated: Boolean(user),
    isBootstrapping,
    register,
    verifyOtp,
    resendOtp,
    login,
    loginWithGoogle,
    forgotPassword,
    resetPassword,
    logout,
  };
}
