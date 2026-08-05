import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { NAV_ITEMS } from "../../app/nav-items";
import { Badge } from "../../components/ui/badge";
import { SchemeEligibilityWidget } from "../../features/schemes/SchemeEligibilityWidget";

export function ComingSoonPage() {
  const { key } = useParams<{ key: string }>();
  const { t } = useTranslation();
  const item = NAV_ITEMS.find((nav) => nav.path.endsWith(`/${key}`));
  const Icon = item?.icon ?? Sparkles;
  const title = item ? t(item.labelKey) : t("common.comingSoon");

  if (key === "schemes") {
    return (
      <div className="max-w-4xl mx-auto py-4 space-y-4">
        <SchemeEligibilityWidget />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card mx-auto flex max-w-xl flex-col items-center gap-4 p-10 text-center"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-forest/10 text-forest">
        <Icon className="h-8 w-8" />
      </div>
      <Badge variant="secondary">{t("common.comingSoon")}</Badge>
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-sm text-muted-foreground">{t("common.comingSoonDesc")}</p>
    </motion.div>
  );
}
