import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { X } from "lucide-react";
import { LANGUAGES, OnboardingSchema, SOIL_TYPES, WATER_SOURCES, type OnboardingInput } from "@haritha/shared-types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { completeOnboardingRequest } from "../../features/profile/api";
import { useAuthStore } from "../../store/auth.store";
import { getApiErrorMessage } from "../../lib/apiClient";

const STEPS = ["location", "farm", "crops"] as const;
type Step = (typeof STEPS)[number];

const FIELDS_BY_STEP: Record<Step, (keyof OnboardingInput)[]> = {
  location: ["state", "district", "village"],
  farm: ["farmSizeAcres", "soilType", "waterSource"],
  crops: ["mainCrops", "preferredLanguage", "experienceYears"],
};

export function OnboardingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const updateUser = useAuthStore((s) => s.updateUser);
  const user = useAuthStore((s) => s.user);

  const [stepIndex, setStepIndex] = useState(0);
  const [cropInput, setCropInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const step = STEPS[stepIndex];

  const {
    register,
    handleSubmit,
    control,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OnboardingInput>({
    resolver: zodResolver(OnboardingSchema),
    defaultValues: { mainCrops: [], preferredLanguage: "en" },
  });

  const mainCrops = watch("mainCrops") ?? [];

  const addCrop = () => {
    const value = cropInput.trim();
    if (!value || mainCrops.includes(value)) return;
    setValue("mainCrops", [...mainCrops, value], { shouldValidate: true });
    setCropInput("");
  };

  const removeCrop = (crop: string) => {
    setValue(
      "mainCrops",
      mainCrops.filter((c) => c !== crop),
      { shouldValidate: true },
    );
  };

  const goNext = async () => {
    const valid = await trigger(FIELDS_BY_STEP[step]);
    if (valid) setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };

  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const onSubmit = async (values: OnboardingInput) => {
    setIsSubmitting(true);
    try {
      await completeOnboardingRequest(values);
      if (user) updateUser({ ...user, onboarded: true });
      navigate("/dashboard");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not save your farm details"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-forest/10 via-background to-leaf/10 p-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card w-full max-w-lg p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">{t("onboarding.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("onboarding.subtitle")}</p>
        </div>

        <div className="mb-6 flex gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${i <= stepIndex ? "bg-forest" : "bg-muted"}`} />
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {step === "location" && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="state">{t("onboarding.state")}</Label>
                    <Input id="state" {...register("state")} />
                    {errors.state && <p className="text-xs text-destructive">{errors.state.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="district">{t("onboarding.district")}</Label>
                    <Input id="district" {...register("district")} />
                    {errors.district && <p className="text-xs text-destructive">{errors.district.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="village">{t("onboarding.village")}</Label>
                    <Input id="village" {...register("village")} />
                    {errors.village && <p className="text-xs text-destructive">{errors.village.message}</p>}
                  </div>
                </>
              )}

              {step === "farm" && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="farmSizeAcres">{t("onboarding.farmSize")}</Label>
                    <Input id="farmSizeAcres" type="number" step="0.1" {...register("farmSizeAcres")} />
                    {errors.farmSizeAcres && <p className="text-xs text-destructive">{errors.farmSizeAcres.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t("onboarding.soilType")}</Label>
                    <Controller
                      control={control}
                      name="soilType"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder={t("onboarding.soilType")} />
                          </SelectTrigger>
                          <SelectContent>
                            {SOIL_TYPES.map((soil) => (
                              <SelectItem key={soil} value={soil}>
                                {soil}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.soilType && <p className="text-xs text-destructive">{errors.soilType.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label>{t("onboarding.waterSource")}</Label>
                    <Controller
                      control={control}
                      name="waterSource"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder={t("onboarding.waterSource")} />
                          </SelectTrigger>
                          <SelectContent>
                            {WATER_SOURCES.map((source) => (
                              <SelectItem key={source} value={source}>
                                {source}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.waterSource && <p className="text-xs text-destructive">{errors.waterSource.message}</p>}
                  </div>
                </>
              )}

              {step === "crops" && (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="crop-input">{t("onboarding.mainCrops")}</Label>
                    <div className="flex gap-2">
                      <Input
                        id="crop-input"
                        value={cropInput}
                        onChange={(e) => setCropInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addCrop();
                          }
                        }}
                        placeholder="e.g. Rice"
                      />
                      <Button type="button" variant="secondary" onClick={addCrop}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {mainCrops.map((crop) => (
                        <Badge key={crop} variant="secondary" className="gap-1">
                          {crop}
                          <button type="button" onClick={() => removeCrop(crop)} aria-label={`Remove ${crop}`}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    {errors.mainCrops && <p className="text-xs text-destructive">{errors.mainCrops.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label>{t("onboarding.preferredLanguage")}</Label>
                    <Controller
                      control={control}
                      name="preferredLanguage"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGES.map((lang) => (
                              <SelectItem key={lang.code} value={lang.code}>
                                {lang.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="experienceYears">{t("onboarding.experience")}</Label>
                    <Input id="experienceYears" type="number" {...register("experienceYears")} />
                    {errors.experienceYears && <p className="text-xs text-destructive">{errors.experienceYears.message}</p>}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex justify-between">
            <Button type="button" variant="ghost" onClick={goBack} disabled={stepIndex === 0}>
              {t("common.back")}
            </Button>
            {stepIndex < STEPS.length - 1 ? (
              <Button type="button" onClick={goNext}>
                {t("common.next")}
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("common.loading") : t("onboarding.finish")}
              </Button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
