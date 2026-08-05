import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { VerifyOtpSchema, type VerifyOtpInput } from "@haritha/shared-types";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../lib/apiClient";

const RESEND_COOLDOWN_SECONDS = 30;

export function VerifyOtpPage() {
  const { t } = useTranslation();
  const { verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { userId?: string; purpose?: VerifyOtpInput["purpose"] } | null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerifyOtpInput>({
    resolver: zodResolver(VerifyOtpSchema),
    defaultValues: { userId: state?.userId ?? "", purpose: state?.purpose ?? "EMAIL_VERIFY" },
  });

  useEffect(() => {
    if (!state?.userId) return;
    setValue("userId", state.userId);
  }, [state?.userId, setValue]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  if (!state?.userId) {
    return <Navigate to="/login" replace />;
  }

  const onSubmit = async (values: VerifyOtpInput) => {
    setIsSubmitting(true);
    try {
      await verifyOtp(values);
      navigate("/dashboard");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Incorrect or expired code"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp(state.userId!);
      toast.success("A new code has been sent");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not resend code"));
    }
  };

  return (
    <AuthLayout title={t("auth.verifyTitle")} subtitle={t("auth.verifySubtitle")}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register("userId")} />
        <input type="hidden" {...register("purpose")} />

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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t("common.loading") : t("auth.verifyButton")}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Button variant="link" size="sm" disabled={cooldown > 0} onClick={handleResend}>
          {cooldown > 0 ? `${t("auth.resendCode")} (${cooldown}s)` : t("auth.resendCode")}
        </Button>
      </div>
    </AuthLayout>
  );
}
