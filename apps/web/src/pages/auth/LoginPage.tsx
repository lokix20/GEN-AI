import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { LoginSchema, type LoginInput } from "@haritha/shared-types";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import { useAuth } from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../lib/apiClient";
import { GoogleLoginButton } from "../../features/auth/GoogleLoginButton";
import axios from "axios";

export function LoginPage() {
  const { t } = useTranslation();
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(LoginSchema) });

  const onSubmit = async (values: LoginInput) => {
    setIsSubmitting(true);
    try {
      await login(values);
      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.code === "EMAIL_NOT_VERIFIED") {
        navigate("/verify-otp", { state: { userId: error.response.data.userId, purpose: "EMAIL_VERIFY" } });
        return;
      }
      toast.error(getApiErrorMessage(error, "Invalid email or password"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleToken = async (idToken: string) => {
    try {
      await loginWithGoogle({ idToken });
      navigate("/dashboard");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Google sign-in failed"));
    }
  };

  return (
    <AuthLayout title={t("auth.loginTitle")} subtitle={t("auth.loginSubtitle")}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">{t("auth.email")}</Label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t("auth.password")}</Label>
            <Link to="/forgot-password" className="text-xs text-forest hover:underline">
              {t("auth.forgotPassword")}
            </Link>
          </div>
          <Input id="password" type="password" autoComplete="current-password" {...register("password")} />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t("common.loading") : t("auth.loginButton")}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or</span>
        <Separator className="flex-1" />
      </div>

      <GoogleLoginButton onIdToken={handleGoogleToken} />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("auth.dontHaveAccount")}{" "}
        <Link to="/register" className="font-medium text-forest hover:underline">
          {t("auth.signUp")}
        </Link>
      </p>
    </AuthLayout>
  );
}
