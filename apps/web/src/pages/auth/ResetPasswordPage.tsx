import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ResetPasswordSchema, type ResetPasswordInput } from "@haritha/shared-types";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../lib/apiClient";

export function ResetPasswordPage() {
  const { t } = useTranslation();
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { email?: string } | null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { email: state?.email ?? "" },
  });

  if (!state?.email) {
    return <Navigate to="/forgot-password" replace />;
  }

  const onSubmit = async (values: ResetPasswordInput) => {
    setIsSubmitting(true);
    try {
      await resetPassword(values);
      toast.success("Password reset — please log in");
      navigate("/login");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Incorrect or expired code"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title={t("auth.resetTitle")}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register("email")} />

        <div className="space-y-1.5">
          <Label htmlFor="code">{t("auth.otpCode")}</Label>
          <Input
            id="code"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            className="text-center text-lg tracking-[0.5em]"
            {...register("code")}
          />
          {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="newPassword">{t("auth.newPassword")}</Label>
          <Input id="newPassword" type="password" autoComplete="new-password" {...register("newPassword")} />
          {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t("common.loading") : t("auth.resetButton")}
        </Button>
      </form>
    </AuthLayout>
  );
}
