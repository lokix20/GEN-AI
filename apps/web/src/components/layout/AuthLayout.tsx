import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { useTranslation } from "react-i18next";

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-forest/10 via-background to-leaf/10 p-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="glass-card w-full max-w-md p-8"
      >
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest text-forest-foreground">
            <Leaf className="h-6 w-6" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">{t("common.appName")}</span>
          <h1 className="text-2xl font-semibold">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {children}
      </motion.div>
    </div>
  );
}
