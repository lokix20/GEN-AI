import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { DiseaseReportDTO } from "@haritha/shared-types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { ImageUploader } from "../../components/shared/ImageUploader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { DiseaseReportCard } from "../../features/disease-detection/components/DiseaseReportCard";
import { analyzeCropImage, compareDiseaseReports, listDiseaseReports } from "../../features/disease-detection/api";
import { getApiErrorMessage } from "../../lib/apiClient";

function DiagnoseTab() {
  const queryClient = useQueryClient();
  const [cropName, setCropName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<DiseaseReportDTO | null>(null);

  const analyzeMutation = useMutation({
    mutationFn: () => analyzeCropImage(file!, cropName),
    onSuccess: (report) => {
      setResult(report);
      queryClient.invalidateQueries({ queryKey: ["disease-reports"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not analyze this image")),
  });

  const handleFileSelected = (selected: File) => {
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setResult(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="cropName">Crop name</Label>
          <Input id="cropName" value={cropName} onChange={(e) => setCropName(e.target.value)} placeholder="e.g. Tomato" />
        </div>

        <ImageUploader
          onFileSelected={handleFileSelected}
          previewUrl={previewUrl}
          onClear={() => {
            setFile(null);
            setPreviewUrl(null);
            setResult(null);
          }}
        />

        <Button
          className="w-full"
          disabled={!file || !cropName.trim() || analyzeMutation.isPending}
          onClick={() => analyzeMutation.mutate()}
        >
          {analyzeMutation.isPending ? "Analyzing..." : "Detect disease"}
        </Button>
      </div>

      <div>{result && <DiseaseReportCard report={result} />}</div>
    </div>
  );
}

function HistoryTab() {
  const { data: reports, isLoading } = useQuery({ queryKey: ["disease-reports"], queryFn: listDiseaseReports });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading history...</p>;
  if (!reports?.length) return <p className="text-sm text-muted-foreground">No reports yet — run a diagnosis first.</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {reports.map((report) => (
        <DiseaseReportCard key={report.id} report={report} />
      ))}
    </div>
  );
}

function CompareTab() {
  const { data: reports } = useQuery({ queryKey: ["disease-reports"], queryFn: listDiseaseReports });
  const [beforeId, setBeforeId] = useState<string>("");
  const [afterId, setAfterId] = useState<string>("");

  const { data: comparison, isFetching } = useQuery({
    queryKey: ["disease-compare", beforeId, afterId],
    queryFn: () => compareDiseaseReports(beforeId, afterId),
    enabled: Boolean(beforeId && afterId && beforeId !== afterId),
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Before</Label>
          <Select value={beforeId} onValueChange={setBeforeId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a report" />
            </SelectTrigger>
            <SelectContent>
              {reports?.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.cropName} — {new Date(r.createdAt).toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>After</Label>
          <Select value={afterId} onValueChange={setAfterId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a report" />
            </SelectTrigger>
            <SelectContent>
              {reports?.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.cropName} — {new Date(r.createdAt).toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isFetching && <p className="text-sm text-muted-foreground">Loading comparison...</p>}

      {comparison && (
        <div className="grid gap-4 sm:grid-cols-2">
          <DiseaseReportCard report={comparison.before} />
          <DiseaseReportCard report={comparison.after} />
        </div>
      )}
    </div>
  );
}

export function DiseaseDetectionPage() {
  return (
    <Tabs defaultValue="diagnose" className="space-y-4">
      <TabsList>
        <TabsTrigger value="diagnose">Diagnose</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
        <TabsTrigger value="compare">Compare</TabsTrigger>
      </TabsList>
      <TabsContent value="diagnose">
        <DiagnoseTab />
      </TabsContent>
      <TabsContent value="history">
        <HistoryTab />
      </TabsContent>
      <TabsContent value="compare">
        <CompareTab />
      </TabsContent>
    </Tabs>
  );
}
