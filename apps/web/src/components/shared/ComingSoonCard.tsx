import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

export function ComingSoonCard({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  const { t } = useTranslation();

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-4 w-4 text-forest" />
          {title}
        </CardTitle>
        <Badge variant="secondary">{t("common.comingSoon")}</Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{t("common.comingSoonDesc")}</p>
      </CardContent>
    </Card>
  );
}
