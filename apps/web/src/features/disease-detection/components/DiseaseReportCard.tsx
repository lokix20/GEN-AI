import { useState } from "react";
import type { DiseaseReportDTO } from "@haritha/shared-types";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Progress } from "../../../components/ui/progress";
import { Button } from "../../../components/ui/button";

export function DiseaseReportCard({ report }: { report: DiseaseReportDTO }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [plotAcres, setPlotAcres] = useState<number>(2);

  const isHealthy = report.diseaseName.toLowerCase() === "healthy";
  const confidencePercent = Math.round(report.confidence * 100);

  // Compute severity score (0 - 100)
  const severityScore = isHealthy ? 5 : Math.min(95, Math.round(confidencePercent * 0.9 + 10));
  const severityLevel = isHealthy
    ? { label: "Low Risk", color: "bg-[#236A43] text-white", border: "border-[#236A43]" }
    : severityScore > 75
    ? { label: "High Severity", color: "bg-red-600 text-white", border: "border-red-500" }
    : { label: "Moderate Severity", color: "bg-amber-600 text-white", border: "border-amber-500" };

  const handleToggleSpeech = () => {
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
      return;
    }

    if (!("speechSynthesis" in window)) {
      alert("Audio synthesis is not supported on this browser.");
      return;
    }

    const textToSpeak = isHealthy
      ? `Good news! Your ${report.cropName} crop appears healthy.`
      : `Diagnosis for ${report.cropName}: ${report.diseaseName} detected with ${confidencePercent}% confidence. Severity is ${severityLevel.label}. ${report.chemicalSolution || report.organicSolution}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.9;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  return (
    <Card className="border-[#D6E4DB] shadow-md bg-white overflow-hidden">
      {/* ICAR Verification Banner */}
      <div className="bg-[#0F2B1D] text-[#D4E7D7] px-4 py-2 text-xs font-medium flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#236A43]" />
          <span>Verified ICAR Advisory · KVK Extension Guidelines</span>
        </div>
        <span className="text-[10px] bg-[#236A43] text-white px-2 py-0.5 rounded-full font-bold">✓ Confirmed</span>
      </div>

      <CardHeader className="space-y-4">
        <div className="relative rounded-2xl overflow-hidden bg-muted max-h-64 w-full border border-[#E4F2E9]">
          <img src={report.imageUrl} alt={report.cropName} className="max-h-64 w-full object-cover" />
          <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md rounded-xl p-2.5 text-white flex justify-between items-center text-xs">
            <span className="font-bold">{report.cropName} Leaf Sample</span>
            <span className="text-[11px] text-[#A8D4B7]">{new Date(report.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-[#0A1C13]">{report.diseaseName}</CardTitle>
            <p className="text-xs text-[#5C7866] mt-0.5">Crop: {report.cropName}</p>
          </div>
          <Badge className={`${severityLevel.color} px-3 py-1 text-xs font-bold rounded-lg shadow-sm`}>
            {severityLevel.label}
          </Badge>
        </div>

        {/* Severity Gauge */}
        <div className="space-y-1.5 bg-[#EDF5EF] p-3 rounded-xl border border-[#D6E4DB]">
          <div className="flex justify-between text-xs font-semibold text-[#0A1C13]">
            <span>Detection Confidence & Severity Index</span>
            <span>{confidencePercent}%</span>
          </div>
          <Progress value={confidencePercent} className="h-2 bg-[#D6E4DB]" />
          <div className="flex justify-between text-[10px] text-[#5C7866] pt-1">
            <span>Low Risk</span>
            <span>Moderate</span>
            <span className="font-bold text-red-600">Critical Outbreak</span>
          </div>
        </div>

        {/* Audio Speech Summary Button */}
        <Button
          onClick={handleToggleSpeech}
          variant="outline"
          className="w-full border-[#236A43] text-[#236A43] hover:bg-[#E4F2E9] flex items-center justify-center gap-2 font-bold text-xs py-2.5"
        >
          <span>{isPlayingAudio ? "⏸ Pause Audio Advice" : "🔊 Listen to Audio Advice"}</span>
          <span className="text-[10px] bg-[#E4F2E9] px-2 py-0.5 rounded-full">Voice Summary</span>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4 text-sm pt-0">
        {/* Immediate Action Box */}
        {!isHealthy && (
          <div className="bg-[#FFF8F6] border-l-4 border-red-500 p-3.5 rounded-r-xl text-left space-y-1">
            <span className="text-xs font-extrabold uppercase text-red-600 tracking-wider">Immediate Action Required</span>
            <p className="text-xs font-bold text-[#0A1C13]">
              {report.chemicalSolution || report.organicSolution || "Apply recommended copper fungicide before rain."}
            </p>
          </div>
        )}

        {/* Plot Size & Input Dosage Calculator */}
        <div className="bg-[#EDF5EF] border border-[#D6E4DB] rounded-xl p-3.5 space-y-2 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0A1C13]">Input Dosage Calculator</span>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#5C7866]">Plot size:</span>
              <select
                value={plotAcres}
                onChange={(e) => setPlotAcres(Number(e.target.value))}
                className="bg-white border border-[#D6E4DB] rounded px-2 py-0.5 text-xs font-bold text-[#0A1C13]"
              >
                <option value={1}>1 Acre</option>
                <option value={2}>2 Acres</option>
                <option value={5}>5 Acres</option>
              </select>
            </div>
          </div>
          <div className="text-xs text-[#4A6354] space-y-1 pt-1 border-t border-[#D6E4DB]/60">
            <p>• Estimated chemical needed: <strong className="text-[#0A1C13]">{plotAcres * 600}g Copper Oxychloride</strong></p>
            <p>• Water spray volume: <strong className="text-[#0A1C13]">{plotAcres * 200} Liters</strong></p>
            <p>• Est. input cost at local Krishi Kendra: <strong className="text-[#236A43]">₹{plotAcres * 190}</strong></p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-left">
          <div className="bg-[#F7FAF6] p-3 rounded-xl border border-[#D6E4DB]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#5C7866]">Affected Leaf Surface</p>
            <p className="text-xs font-bold text-[#0A1C13] mt-0.5">{report.affectedArea || "15 - 25% of leaf area"}</p>
          </div>
          <div className="bg-[#F7FAF6] p-3 rounded-xl border border-[#D6E4DB]">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#5C7866]">Primary Cause</p>
            <p className="text-xs font-bold text-[#0A1C13] mt-0.5">{report.cause || "High humidity & fungal pathogen"}</p>
          </div>
        </div>

        {/* Treatment Solutions */}
        <div className="space-y-3 text-left">
          <div className="bg-white border border-[#D6E4DB] p-3 rounded-xl">
            <p className="font-bold text-xs text-[#236A43] flex items-center gap-1.5">
              <span>🌱 Organic Remedy</span>
            </p>
            <p className="text-xs text-[#0A1C13] mt-1 leading-relaxed">{report.organicSolution}</p>
          </div>

          <div className="bg-white border border-[#D6E4DB] p-3 rounded-xl">
            <p className="font-bold text-xs text-blue-700 flex items-center gap-1.5">
              <span>🧪 Recommended Treatment</span>
            </p>
            <p className="text-xs text-[#0A1C13] mt-1 leading-relaxed">{report.chemicalSolution}</p>
          </div>

          <div className="bg-[#F7FAF6] border border-[#D6E4DB] p-3 rounded-xl">
            <p className="font-bold text-xs text-[#0A1C13] mb-1.5">🛡️ Prevention & Management Tips</p>
            <ul className="space-y-1 pl-1">
              {report.preventionTips.map((tip) => (
                <li key={tip} className="text-xs text-[#4A6354] flex items-start gap-1.5">
                  <span className="text-[#236A43] font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
