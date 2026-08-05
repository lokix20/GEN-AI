import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ForgotPasswordSchema, type ForgotPasswordInput } from "@haritha/shared-types";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../hooks/useAuth";
import { getApiErrorMessage } from "../../lib/apiClient";

export function ForgotPasswordPage() {
  const { t } = useTranslation();
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(ForgotPasswordSchema) });

  const onSubmit = async (values: ForgotPasswordInput) => {
    setIsSubmitting(true);
    try {
      await forgotPassword(values);
      toast.success("If that account exists, a reset code has been sent");
      navigate("/reset-password", { state: { email: getValues("email") } });
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout title={t("auth.forgotTitle")} subtitle={t("auth.forgotSubtitle")}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">{t("auth.email")}</Label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? t("common.loading") : t("auth.sendResetCode")}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link to="/login" className="font-medium text-forest hover:underline">
          {t("auth.backToLogin")}
        </Link>
      </p>
    </AuthLayout>
  );
}
