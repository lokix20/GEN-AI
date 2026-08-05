import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { DiseaseReportDTO } from "@haritha/shared-types";
import { analyzeCropImage, listDiseaseReports } from "../../features/disease-detection/api.js";
import { getApiErrorMessage } from "../../lib/apiClient.js";
import { cn } from "../../lib/utils.js";
import { LanguageSelector } from "../../components/shared/LanguageSelector.js";
import { DISEASE_TRANSLATIONS, DiseaseTranslation } from "../../lib/disease-translations.js";

function LeftCapturePanel({ 
  onDetect, 
  isAnalyzing,
  t,
}: { 
  onDetect: (file: File, plot: string) => void;
  isAnalyzing: boolean;
  t: DiseaseTranslation;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [plot, setPlot] = useState("Plot A - Paddy");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
    e.target.value = "";
  };

  return (
    <div className="w-full md:w-[420px] shrink-0 bg-white border border-[#E4E3DA] rounded-[24px] p-6 flex flex-col gap-6 overflow-y-auto no-scrollbar relative shadow-sm">
      <div className="space-y-1 text-left">
        <h2 className="text-[20px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
          {t.photoHeader}
        </h2>
        <p className="text-[14px] font-medium text-[#5C6B62]">
          {t.photoSub}
        </p>
      </div>

      <div 
        className={cn(
          "w-full h-64 min-h-[250px] rounded-[16px] border-2 border-dashed flex flex-col items-center justify-center p-4 text-center transition overflow-hidden relative shadow-inner",
          previewUrl ? "border-[#1B7A4B] bg-black/5" : "border-[#DCDBD1] bg-[#FAFAF7] hover:bg-[#F4F3EC]"
        )}
      >
        {previewUrl ? (
          <div className="relative w-full h-full group">
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-[14px]" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[14px]">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-white text-[#12261D] font-extrabold text-xs px-3.5 py-2 rounded-lg shadow"
              >
                Change Photo
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#5C6B62] shadow-sm mb-3">
              📷
            </div>
            <div className="text-[14.5px] font-bold text-[#12261D]">{t.dropText}</div>
            <div className="text-[13px] text-[#A2ADA5] font-semibold mt-1">
              <span className="text-[#1B7A4B] underline cursor-pointer" onClick={() => fileInputRef.current?.click()}>{t.orBrowse}</span>
            </div>
          </>
        )}
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-[#0F2419] hover:bg-[#1C3D2A] text-white rounded-xl py-3 px-4 font-bold text-[14.5px] flex items-center justify-center gap-2 transition"
        >
          {t.cameraBtn}
        </button>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-white hover:bg-[#FAFAF7] border border-[#DCDBD1] text-[#12261D] rounded-xl py-3 px-4 font-bold text-[14.5px] transition"
        >
          {t.browseBtn}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-dashed border-[#A2ADA5] flex items-center justify-center text-[10px] font-extrabold text-[#5C6B62] shrink-0">
          +
        </div>
        <div className="w-8 h-8 rounded-full border-2 border-dashed border-[#A2ADA5] flex items-center justify-center text-[10px] font-extrabold text-[#5C6B62] shrink-0">
          +
        </div>
        <p className="text-[12px] font-semibold text-[#5C6B62] leading-tight text-left">
          {t.anglesTip}
        </p>
      </div>

      <div className="pt-2 border-t border-[#E4E3DA] text-left">
        <p className="text-[11px] font-extrabold tracking-wider text-[#A2ADA5] uppercase mb-3">
          {t.whichPlot}
        </p>
        <div className="flex flex-wrap gap-2">
          {["Plot A - Paddy", "Plot B - Tomato", "Strip C - Cotton"].map((p) => (
            <button
              key={p}
              onClick={() => setPlot(p)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-[13px] font-bold transition",
                plot === p
                  ? "bg-[#E6F4EA] border border-[#A8DAB5] text-[#1B7A4B]"
                  : "bg-white border border-[#DCDBD1] text-[#5C6B62] hover:bg-[#FAFAF7]"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <button
        disabled={isAnalyzing}
        onClick={() => {
          if (file) {
            onDetect(file, plot);
          } else {
            toast.warning("Please select or capture a crop leaf photo first!");
          }
        }}
        className={cn(
          "w-full font-extrabold text-[15px] py-4 rounded-xl shadow-lg transition duration-200 mt-2 flex items-center justify-center gap-2 border-2",
          file
            ? "bg-[#006837] hover:bg-[#1B4332] text-white border-[#006837]"
            : "bg-[#E6F4EA] text-[#006837] border-[#A8DAB5] hover:bg-[#D4EDDA]"
        )}
      >
        {isAnalyzing ? (
          <>
            <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            <span>{t.analyzingText}</span>
          </>
        ) : (
          <span>{t.analyzeBtn}</span>
        )}
      </button>
    </div>
  );
}

function RightResultPanel({ report, t }: { report: DiseaseReportDTO | null; t: DiseaseTranslation }) {
  if (!report) {
    return (
      <div className="flex-1 bg-white border border-[#E4E3DA] rounded-[24px] flex flex-col items-center justify-center p-8 text-center relative overflow-hidden shadow-sm min-h-[500px]">
        <div className="w-20 h-20 rounded-3xl bg-[#F8F9F5] border-2 border-[#1B4332] flex items-center justify-center text-4xl mb-4 shadow-sm">
          🌱
        </div>
        <h3 className="text-xl font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
          {t.pageTitle}
        </h3>
        <p className="text-sm text-[#5C6B62] max-w-sm mt-1 font-medium">
          {t.photoSub}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white border border-[#E4E3DA] rounded-[24px] flex flex-col overflow-y-auto no-scrollbar shadow-sm text-left">
      <div className="px-6 py-4 border-b border-[#E4E3DA] flex items-center justify-between bg-[#FAFAF7]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1B7A4B]" />
          <span className="text-[13px] font-bold text-[#12261D]">
            {report.cropName} · Scan #{report.id.slice(-4)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-white border border-[#DCDBD1] hover:bg-[#FAFAF7] text-[#12261D] text-[12.5px] font-bold px-3 py-1.5 rounded-lg transition">
            Save to diary
          </button>
          <button className="bg-white border border-[#DCDBD1] hover:bg-[#FAFAF7] text-[#12261D] text-[12.5px] font-bold px-3 py-1.5 rounded-lg transition">
            Share
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8 flex flex-col gap-8 max-w-4xl mx-auto w-full">
        {/* Main Result Card */}
        <div className="flex flex-col gap-6">
          <div className="flex-1 flex flex-col pt-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
                {report.diseaseName}
              </h2>
              <div className="bg-[#FFF4E5] text-[#C27D00] text-[11px] font-extrabold px-2.5 py-1 rounded-md">
                {Math.round(report.confidence * 100)}% {t.confidence}
              </div>
            </div>
            
            <p className="text-[14px] text-[#5C6B62] font-medium leading-relaxed mb-6">
              <span className="font-bold text-[#12261D]">{t.pathogenDetails}</span> {report.cause}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#E4E3DA]">
              <div>
                <div className="text-[11px] font-bold tracking-wider text-[#A2ADA5] uppercase">{t.plotSize}</div>
                <div className="text-[14px] font-extrabold text-[#12261D] mt-0.5">2.5 Acres</div>
              </div>
              <div>
                <div className="text-[11px] font-bold tracking-wider text-[#A2ADA5] uppercase">{t.affectedSurface}</div>
                <div className="text-[14px] font-extrabold text-[#12261D] mt-0.5">{report.affectedArea}</div>
              </div>
              <div>
                <div className="text-[11px] font-bold tracking-wider text-[#A2ADA5] uppercase">Urgency Window</div>
                <div className="text-[14px] font-extrabold text-[#C27D00] mt-0.5">Within {report.actWithinHours} hrs</div>
              </div>
              <div>
                <div className="text-[11px] font-bold tracking-wider text-[#A2ADA5] uppercase">{t.estCost}</div>
                <div className="text-[14px] font-extrabold text-[#1B7A4B] mt-0.5">₹480</div>
              </div>
            </div>
          </div>
        </div>

        {/* Treatment Plan Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[16px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
            Treatment &amp; Dosage Plan
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#FAFAF7] border border-[#E4E3DA] rounded-2xl p-5 flex flex-col gap-2">
              <div className="text-[12.5px] font-bold text-[#1B7A4B]">
                {t.organicRemedy}
              </div>
              <p className="text-[13px] text-[#5C6B62] font-medium leading-relaxed">
                {report.organicSolution}
              </p>
            </div>

            <div className="bg-[#FAFAF7] border border-[#E4E3DA] rounded-2xl p-5 flex flex-col gap-2">
              <div className="text-[12.5px] font-bold text-[#1565C0]">
                {t.recommendedTreatment}
              </div>
              <p className="text-[13px] text-[#5C6B62] font-medium leading-relaxed">
                {report.chemicalSolution}
              </p>
              <div className="text-[11px] font-bold text-[#0D47A1] bg-[#E3F2FD] p-2 rounded-lg mt-1">
                {report.dosageInstructions}
              </div>
            </div>
          </div>
        </div>

        {/* Prevention Tips */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[15px] font-extrabold text-[#12261D]">
            {t.preventionTipsHeader}
          </h3>
          <div className="bg-[#FAFAF7] border border-[#E4E3DA] rounded-2xl p-4">
            <ul className="space-y-2">
              {report.preventionTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[13px] text-[#5C6B62] font-medium">
                  <span className="text-[#006837] font-bold">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Human Expert Banner */}
        <div className="bg-[#0F2419] rounded-[20px] p-5 mt-auto flex flex-col gap-3 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#9BD96B] rounded-full opacity-[0.03] -translate-y-10 translate-x-10" />
          <h4 className="text-[14.5px] font-extrabold tracking-tight relative z-10" style={{ fontFamily: "'Sora', sans-serif" }}>
            {t.humanCheckTitle}
          </h4>
          <p className="text-[12.5px] text-[#A2B8AA] font-medium leading-relaxed relative z-10">
            {t.humanCheckDesc}
          </p>
          <button className="bg-[#9BD96B] hover:bg-[#8ac75c] text-[#0F2419] font-bold text-[13px] py-2.5 px-4 rounded-xl mt-1 w-max transition relative z-10">
            {t.humanCheckBtn}
          </button>
        </div>
      </div>
    </div>
  );
}

export function DiseaseDetectionPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Diagnose");
  const [result, setResult] = useState<DiseaseReportDTO | null>(null);
  const [historyList, setHistoryList] = useState<DiseaseReportDTO[]>([]);
  const [langCode, setLangCode] = useState(() => localStorage.getItem("haritha-language") || "te");

  useEffect(() => {
    const handleLangChange = () => {
      setLangCode(localStorage.getItem("haritha-language") || "te");
    };
    window.addEventListener("haritha-language-change", handleLangChange);
    return () => window.removeEventListener("haritha-language-change", handleLangChange);
  }, []);

  // Fetch History from API & Supabase Database
  const { data: serverReports } = useQuery({
    queryKey: ["disease-reports-history"],
    queryFn: listDiseaseReports,
  });

  useEffect(() => {
    if (serverReports && serverReports.length > 0) {
      setHistoryList(serverReports);
    }
  }, [serverReports]);

  const t: DiseaseTranslation = DISEASE_TRANSLATIONS[langCode] || DISEASE_TRANSLATIONS["te"] || DISEASE_TRANSLATIONS["en"];

  const queryClient = useQueryClient();
  const analyzeMutation = useMutation({
    mutationFn: ({ file, plot }: { file: File, plot: string }) => analyzeCropImage(file, plot),
    onSuccess: (report) => {
      setResult(report);
      setHistoryList((prev) => [report, ...prev]);
      queryClient.invalidateQueries({ queryKey: ["disease-reports-history"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not analyze this image")),
  });

  return (
    <div className="flex flex-col h-[calc(100vh-1rem)] w-full bg-[#F4F3EC] select-none font-sans overflow-hidden">
      
      {/* Full-width Top Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#E4E3DA] shrink-0 bg-[#F4F3EC]">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
            {t.pageTitle}
          </h1>
          
          {/* Tabs */}
          <div className="hidden sm:flex items-center gap-1 bg-[#EBEAE2] p-1 rounded-xl border border-[#E4E3DA]">
            {[
              { id: "Diagnose", label: t.tabDiagnose },
              { id: "History", label: t.tabHistory },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[13px] font-bold transition duration-150",
                  activeTab === tab.id 
                    ? "bg-white text-[#12261D] shadow-sm border border-[#DCDBD1]"
                    : "text-[#5C6B62] hover:text-[#12261D]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSelector buttonClassName="bg-[#EBEAE2] border border-[#DCDBD1] text-[#12261D] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#E4E3DA] transition shadow-sm" />
          <div 
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl bg-[#0F2419] text-[#9BD96B] flex items-center justify-center font-bold text-[13px] cursor-pointer hover:opacity-90 shadow-sm"
          >
            RF
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-6 flex flex-col lg:flex-row items-stretch gap-6 overflow-hidden">
        
        {activeTab === "Diagnose" ? (
          <>
            <LeftCapturePanel 
              onDetect={(file, plot) => analyzeMutation.mutate({ file, plot })} 
              isAnalyzing={analyzeMutation.isPending} 
              t={t}
            />
            <RightResultPanel report={result} t={t} />
          </>
        ) : (
          /* History Tab View */
          <div className="flex-1 bg-white border border-[#E4E3DA] rounded-[24px] p-6 md:p-8 flex flex-col gap-6 overflow-y-auto no-scrollbar shadow-sm text-left">
            <div className="flex items-center justify-between border-b border-[#E4E3DA] pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
                  {t.tabHistory} — Supabase Database
                </h2>
                <p className="text-xs text-[#5C6B62] font-semibold mt-0.5">
                  All recorded crop diagnosis scans, treatments, and AI analysis reports.
                </p>
              </div>
              <button
                onClick={() => setActiveTab("Diagnose")}
                className="bg-[#006837] text-white font-extrabold text-xs px-4 py-2 rounded-xl hover:bg-[#1B4332] transition"
              >
                + New Scan
              </button>
            </div>

            {historyList.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center text-[#5C6B62]">
                <div className="text-4xl mb-2">🌿</div>
                <p className="font-bold text-sm">No previous reports found for this plot.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {historyList.map((item) => (
                  <div 
                    key={item.id}
                    className="border border-[#E4E3DA] rounded-2xl p-5 bg-[#FAFAF7] hover:bg-white transition flex flex-col gap-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#006837] bg-[#E6F4EA] px-2.5 py-1 rounded-md">
                        {item.cropName}
                      </span>
                      <span className="text-[11px] font-bold text-[#A2ADA5]">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-extrabold text-[#12261D]">{item.diseaseName}</h4>
                      <p className="text-xs text-[#5C6B62] font-medium mt-1 line-clamp-2">
                        {item.cause}
                      </p>
                    </div>

                    <div className="text-xs font-bold text-[#1565C0] bg-[#E3F2FD] p-2.5 rounded-xl border border-[#90CAF9]/40 mt-auto">
                      {item.chemicalSolution}
                    </div>

                    <button
                      onClick={() => {
                        setResult(item);
                        setActiveTab("Diagnose");
                      }}
                      className="w-full bg-white border border-[#DCDBD1] hover:bg-[#F4F3EC] text-[#12261D] text-xs font-extrabold py-2 rounded-xl transition text-center"
                    >
                      View Diagnosis Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
