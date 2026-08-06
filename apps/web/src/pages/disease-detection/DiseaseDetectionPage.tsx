import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { DiseaseReportDTO } from "@haritha/shared-types";
import { analyzeCropImage } from "../../features/disease-detection/api.js";
import { getApiErrorMessage } from "../../lib/apiClient.js";
import { cn } from "../../lib/utils.js";
import { Skeleton } from "../../components/ui/skeleton.js";

function AnalysisSkeletonPanel() {
  return (
    <div className="flex-1 bg-white border border-[#E4E3DA] rounded-[24px] p-6 md:p-8 flex flex-col gap-6 overflow-y-auto no-scrollbar shadow-sm">
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-4 w-48 rounded-full" />
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <Skeleton className="w-[180px] h-[180px] rounded-2xl shrink-0" />
        <div className="flex-1 flex flex-col gap-3">
          <Skeleton className="h-8 w-3/4 rounded-xl" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-5/6 rounded-lg" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 pt-6 border-t border-[#E4E3DA]">
        <Skeleton className="h-5 w-40 rounded-lg" />
        <Skeleton className="h-20 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    </div>
  );
}

function LeftCapturePanel({ 
  onDetect, 
  isAnalyzing 
}: { 
  onDetect: (file: File, plot: string) => void;
  isAnalyzing: boolean;
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
      <div className="space-y-1">
        <h2 className="text-[20px] font-extrabold text-[#12261D]">
          Photograph the problem
        </h2>
        <p className="text-[14px] font-medium text-[#5C6B62]">
          One clear leaf, daylight, no shadow.
        </p>
      </div>

      <div 
        className={cn(
          "w-full aspect-[4/3] rounded-[16px] border-2 border-dashed flex flex-col items-center justify-center p-6 text-center transition overflow-hidden relative",
          previewUrl ? "border-transparent bg-black/5" : "border-[#DCDBD1] bg-[#FAFAF7] hover:bg-[#F4F3EC]"
        )}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-[12px] absolute inset-0" />
        ) : (
          <>
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#5C6B62] shadow-sm mb-3">
              📷
            </div>
            <div className="text-[14.5px] font-bold text-[#12261D]">Drop or capture the leaf photo</div>
            <div className="text-[13px] text-[#A2ADA5] font-semibold mt-1">or <span className="text-[#1B7A4B] underline cursor-pointer" onClick={() => fileInputRef.current?.click()}>browse files</span></div>
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
          📷 Camera
        </button>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-white hover:bg-[#FAFAF7] border border-[#DCDBD1] text-[#12261D] rounded-xl py-3 px-4 font-bold text-[14.5px] transition"
        >
          Browse files
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-14 h-14 rounded-xl border border-dashed border-[#DCDBD1] flex flex-col items-center justify-center bg-[#FAFAF7] text-[#5C6B62] hover:bg-black/5 transition shrink-0">
          <span className="text-lg leading-none">+</span>
          <span className="text-[8px] font-bold uppercase mt-1">or<br/>browse</span>
        </button>
        <button className="w-14 h-14 rounded-xl border border-dashed border-[#DCDBD1] flex flex-col items-center justify-center bg-[#FAFAF7] text-[#5C6B62] hover:bg-black/5 transition shrink-0">
          <span className="text-lg leading-none">+</span>
          <span className="text-[8px] font-bold uppercase mt-1">or<br/>browse</span>
        </button>
        <div className="text-[12px] font-semibold text-[#8B978F] leading-tight ml-2">
          Add 2-3 angles for a<br/>sharper result
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-[#E4E3DA]">
        <div className="text-[10.5px] font-bold text-[#A2ADA5] uppercase tracking-widest">
          Which Plot?
        </div>
        <div className="flex flex-wrap gap-2">
          {["Plot A - Paddy", "Plot B - Tomato", "Strip C - Cotton"].map((p) => (
            <button
              key={p}
              onClick={() => setPlot(p)}
              className={cn(
                "px-4 py-2 rounded-xl text-[13px] font-bold transition",
                plot === p 
                  ? "bg-[#E6F3E4] border border-[#CDE5C8] text-[#1B7A4B]"
                  : "bg-white border border-[#DCDBD1] text-[#5C6B62] hover:border-[#1B7A4B]"
              )}
            >
              {p}
            </button>
          ))}
        </div>
        <p className="text-[11.5px] font-medium text-[#8B978F] leading-relaxed mt-1">
          Stage, sowing date and recent sprays are pulled from your diary automatically.
        </p>
      </div>

      <div className="mt-auto pt-6">
        <button
          disabled={!file || isAnalyzing}
          onClick={() => { if(file) onDetect(file, plot); }}
          className="w-full bg-[#9BD96B] hover:bg-[#8ac75c] text-[#0F2419] rounded-xl py-3.5 px-4 font-extrabold text-[15px] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {isAnalyzing ? "Analyzing..." : "Detect disease"}
        </button>
        <div className="text-center text-[11px] font-semibold text-[#A2ADA5] mt-2">
          Usually takes 4-6 seconds · works offline on saved models
        </div>
      </div>
    </div>
  );
}

function RightResultPanel({ report }: { report: DiseaseReportDTO | null }) {
  if (!report) {
    return (
      <div className="flex-1 bg-white border border-[#E4E3DA] rounded-[24px] flex flex-col items-center justify-center text-center p-8 shadow-sm">
        <div className="w-20 h-20 rounded-full bg-[#FAFAF7] border border-[#E4E3DA] flex items-center justify-center text-3xl mb-4">
          🍃
        </div>
        <h3 className="text-xl font-extrabold text-[#12261D]">
          Ready for diagnosis
        </h3>
        <p className="text-[14px] text-[#5C6B62] font-medium mt-2 max-w-sm">
          Upload a clear photo of the affected crop leaf on the left pane to get an instant disease identification and treatment plan.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white border border-[#E4E3DA] rounded-[24px] flex flex-col overflow-y-auto no-scrollbar shadow-sm">
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E4E3DA] gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-[#9BD96B] text-[#0F2419] text-[10px] font-extrabold px-2 py-1 rounded-md uppercase tracking-wider">
            Result
          </div>
          <div className="text-[12.5px] font-semibold text-[#5C6B62]">
            Scanned just now · Plot A · {report.cropName}, day 48
          </div>
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
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-[180px] shrink-0 flex flex-col gap-2">
            <div className="aspect-square rounded-2xl border-2 border-dashed border-[#DCDBD1] bg-[#FAFAF7] flex flex-col items-center justify-center p-2 relative overflow-hidden">
              {report.imageUrl ? (
                <img src={report.imageUrl} className="absolute inset-0 w-full h-full object-cover" alt="Disease" />
              ) : (
                <>
                  <div className="text-2xl mb-2 text-[#A2ADA5]">🖼️</div>
                  <div className="text-[12px] font-bold text-[#5C6B62]">Detected region</div>
                  <div className="text-[10px] text-[#A2ADA5] font-semibold">or browse files</div>
                </>
              )}
            </div>
          </div>
          
          <div className="flex-1 flex flex-col pt-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-extrabold text-[#12261D]">
                {report.diseaseName}
              </h2>
              <div className="bg-[#FFF4E5] text-[#C27D00] text-[11px] font-extrabold px-2 py-1 rounded-md">
                {Math.round(report.confidence * 100)}% confidence
              </div>
            </div>
            
            <p className="text-[14px] text-[#5C6B62] font-medium leading-relaxed mb-6">
              <span className="font-bold text-[#12261D]">Pathogen details:</span> {report.cause} <br/>
              Spreads fastest through standing water; 42 mm of rain is forecast Wednesday.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#E4E3DA]">
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-[#A2ADA5] tracking-widest uppercase">Severity</span>
                <span className="text-[14px] font-extrabold text-[#12261D] mt-1">Low-moderate</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-[#A2ADA5] tracking-widest uppercase">Spread</span>
                <span className="text-[14px] font-extrabold text-[#12261D] mt-1">{report.affectedArea || "~15% of plot"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-[#A2ADA5] tracking-widest uppercase">Act Within</span>
                <span className="text-[14px] font-extrabold text-[#D94F4F] mt-1">48 hours</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-[#A2ADA5] tracking-widest uppercase">Yield At Risk</span>
                <span className="text-[14px] font-extrabold text-[#12261D] mt-1">₹9,400</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Split Layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mt-2">
          
          {/* Treatment Plan */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h3 className="text-[17px] font-extrabold text-[#12261D]">
              Treatment plan
            </h3>
            
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-[#FFF4E5] text-[#C27D00] flex items-center justify-center font-extrabold text-[12px] shrink-0">1</div>
                <div className="flex-1 border-b border-[#E4E3DA] pb-4 flex justify-between items-start gap-4">
                  <div className="flex flex-col gap-0.5">
                    <div className="text-[14.5px] font-extrabold text-[#12261D]">{report.organicSolution || "Drain standing water from Plot A"}</div>
                    <div className="text-[12.5px] text-[#5C6B62] font-semibold">Today · free · biggest single lever</div>
                  </div>
                  <button className="text-[#1B7A4B] font-bold text-[12.5px] hover:underline whitespace-nowrap">Remind me</button>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-[#FFF4E5] text-[#C27D00] flex items-center justify-center font-extrabold text-[12px] shrink-0">2</div>
                <div className="flex-1 border-b border-[#E4E3DA] pb-4 flex justify-between items-start gap-4">
                  <div className="flex flex-col gap-0.5">
                    <div className="text-[14.5px] font-extrabold text-[#12261D]">{report.chemicalSolution || "Copper oxychloride 0.3% spray"}</div>
                    <div className="text-[12.5px] text-[#5C6B62] font-semibold">Wed 6-8 AM · ₹340 for 2.4 ac</div>
                  </div>
                  <button className="text-[#1B7A4B] font-bold text-[12.5px] hover:underline whitespace-nowrap">Find shops</button>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-7 h-7 rounded-full bg-[#E6F3E4] text-[#1B7A4B] flex items-center justify-center font-extrabold text-[12px] shrink-0">3</div>
                <div className="flex-1 flex justify-between items-start gap-4">
                  <div className="flex flex-col gap-0.5">
                    <div className="text-[14.5px] font-extrabold text-[#12261D]">Hold the urea top-dress</div>
                    <div className="text-[12.5px] text-[#5C6B62] font-semibold">Nitrogen now feeds the infection</div>
                  </div>
                  <button className="text-[#1B7A4B] font-bold text-[12.5px] hover:underline whitespace-nowrap">Reschedule</button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button className="bg-[#0F2419] hover:bg-[#1C3D2A] text-white rounded-xl py-3 px-5 font-bold text-[14px] transition flex-1 sm:flex-none">
                Add all to calendar
              </button>
              <button className="bg-white border border-[#DCDBD1] hover:bg-[#FAFAF7] text-[#12261D] rounded-xl py-3 px-5 font-bold text-[14px] transition flex-1 sm:flex-none">
                Ask the assistant
              </button>
            </div>
          </div>

          {/* Right Column (Other possibilities & Nearby) */}
          <div className="md:col-span-2 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="text-[15.5px] font-extrabold text-[#12261D]">
                Other possibilities
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[13px] font-bold text-[#12261D]">
                    <span>Brown spot</span>
                    <span className="text-[#A2ADA5]">9%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#FAFAF7] rounded-full overflow-hidden border border-[#E4E3DA]">
                    <div className="h-full bg-[#C27D00] w-[9%] rounded-full" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[13px] font-bold text-[#12261D]">
                    <span>Nitrogen deficiency</span>
                    <span className="text-[#A2ADA5]">3%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#FAFAF7] rounded-full overflow-hidden border border-[#E4E3DA]">
                    <div className="h-full bg-[#1B7A4B] w-[3%] rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-[15.5px] font-extrabold text-[#12261D]">
                Nearby inputs
              </h3>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-[13px]">
                  <span className="font-extrabold text-[#12261D]">Sri Lakshmi Agro</span>
                  <div className="text-[#5C6B62] font-semibold text-right">
                    <span>2.4 km</span> · <span>₹310</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                  <span className="font-extrabold text-[#12261D]">Kisan Seva Kendra</span>
                  <div className="text-[#5C6B62] font-semibold text-right">
                    <span>5.8 km</span> · <span>₹340</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0F2419] rounded-[20px] p-5 mt-auto flex flex-col gap-3 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#9BD96B] rounded-full opacity-[0.03] -translate-y-10 translate-x-10" />
              <h4 className="text-[14.5px] font-extrabold tracking-tight relative z-10">
                Want a human check?
              </h4>
              <p className="text-[12.5px] text-[#A2B8AA] font-medium leading-relaxed relative z-10">
                Send the photo and this result to an agronomist — free, replies within an hour.
              </p>
              <button className="bg-[#9BD96B] hover:bg-[#8ac75c] text-[#0F2419] font-bold text-[13px] py-2.5 px-4 rounded-xl mt-1 w-max transition relative z-10">
                Get second opinion
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export function DiseaseDetectionPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Diagnose");
  const [result, setResult] = useState<DiseaseReportDTO | null>(null);

  const queryClient = useQueryClient();
  const analyzeMutation = useMutation({
    mutationFn: ({ file, plot }: { file: File, plot: string }) => analyzeCropImage(file, plot),
    onSuccess: (report) => {
      setResult(report);
      queryClient.invalidateQueries({ queryKey: ["disease-reports"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not analyze this image")),
  });

  return (
    <div className="flex flex-col w-full bg-[#F4F3EC] select-none font-sans text-left pb-10">
      
      {/* Full-width Top Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#E4E3DA] shrink-0 bg-[#F4F3EC]">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-extrabold text-[#12261D]">
            Crop Diagnosis
          </h1>
          
          {/* Tabs */}
          <div className="hidden sm:flex items-center gap-1 bg-[#EBEAE2] p-1 rounded-xl border border-[#E4E3DA]">
            {['Diagnose', 'History', 'Compare'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[13px] font-bold transition duration-150",
                  activeTab === tab 
                    ? "bg-white text-[#12261D] shadow-sm border border-[#DCDBD1]"
                    : "text-[#5C6B62] hover:text-[#12261D]"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex text-[13px] font-bold text-[#5C6B62] items-center gap-1 cursor-pointer hover:text-[#12261D] transition">
            English <span className="text-[10px]">▼</span>
          </div>
          <div 
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl bg-[#0F2419] text-[#9BD96B] flex items-center justify-center font-bold text-[13px] cursor-pointer hover:opacity-90 shadow-sm"
          >
            RF
          </div>
        </div>
      </header>

      {/* Main Split Content Area */}
      <div className="flex-1 p-4 md:p-6 flex flex-col lg:flex-row items-stretch gap-6 overflow-hidden">
        
        {activeTab === "Diagnose" && (
          <>
            <LeftCapturePanel 
              onDetect={(file, plot) => analyzeMutation.mutate({ file, plot })} 
              isAnalyzing={analyzeMutation.isPending} 
            />
            {analyzeMutation.isPending ? (
              <AnalysisSkeletonPanel />
            ) : (
              <RightResultPanel report={result} />
            )}
          </>
        )}

        {activeTab !== "Diagnose" && (
          <div className="flex-1 bg-white border border-[#E4E3DA] rounded-[24px] flex items-center justify-center p-8 shadow-sm">
             <div className="text-center text-[#5C6B62] font-semibold">
               This feature ({activeTab}) is being updated. Check back soon!
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
