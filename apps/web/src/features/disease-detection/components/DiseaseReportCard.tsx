import type { DiseaseReportDTO } from "@haritha/shared-types";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Progress } from "../../../components/ui/progress";

export function DiseaseReportCard({ report }: { report: DiseaseReportDTO }) {
  const isHealthy = report.diseaseName.toLowerCase() === "healthy";

  return (
    <Card>
      <CardHeader className="space-y-3">
        <img src={report.imageUrl} alt={report.cropName} className="max-h-64 w-full rounded-2xl object-contain bg-muted" />
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{report.diseaseName}</CardTitle>
          <Badge variant={isHealthy ? "secondary" : "destructive"}>{report.cropName}</Badge>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Confidence</span>
            <span>{Math.round(report.confidence * 100)}%</span>
          </div>
          <Progress value={report.confidence * 100} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <p className="font-medium text-muted-foreground">Affected area</p>
          <p>{report.affectedArea}</p>
        </div>
        <div>
          <p className="font-medium text-muted-foreground">Cause</p>
          <p>{report.cause}</p>
        </div>
        <div>
          <p className="font-medium text-muted-foreground">Organic solution</p>
          <p>{report.organicSolution}</p>
        </div>
        <div>
          <p className="font-medium text-muted-foreground">Chemical solution</p>
          <p>{report.chemicalSolution}</p>
        </div>
        <div>
          <p className="font-medium text-muted-foreground">Prevention tips</p>
          <ul className="list-disc space-y-1 pl-5">
            {report.preventionTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
