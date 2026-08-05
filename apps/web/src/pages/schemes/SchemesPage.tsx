import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchFarmerProfile } from "../../features/profile/api.js";
import { useAuthStore } from "../../store/auth.store.js";
import { matchSchemesForProfile, Scheme } from "../../data/schemes-data.js";
import { LanguageSelector } from "../../components/shared/LanguageSelector.js";
import { cn } from "../../lib/utils.js";
import { Sparkles, FileText, CheckCircle2, ArrowRight, ExternalLink, ShieldCheck, Zap } from "lucide-react";

export function SchemesPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  const [activeTab, setActiveTab] = useState<"matched" | "all" | "wallet">("matched");
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  // 1. Load Farmer Profile for Matching
  const { data: profile } = useQuery({
    queryKey: ["farmer-profile"],
    queryFn: fetchFarmerProfile,
    enabled: role === "FARMER",
  });

  const farmerState = profile?.state || "Andhra Pradesh";
  const farmerCrops = profile?.mainCrops || ["Paddy", "Tomato", "Cotton"];
  const landAcres = profile?.farmSizeAcres || 4.2;
  const farmerName = profile?.name || user?.name || "Ramesh Naidu";

  // 2. Profile-Based Scheme Matching
  const matchedSchemes = matchSchemesForProfile({
    name: farmerName,
    state: farmerState,
    district: profile?.district || "Vizianagaram",
    farmSizeAcres: landAcres,
    mainCrops: farmerCrops,
  });

  const eligibleSchemes = matchedSchemes.filter((m) => m.isEligible);

  // 3. AI Assistant Scheme Helper Function
  const handleAskAiAboutScheme = (scheme: Scheme) => {
    const aiPrompt = `Please explain the "${scheme.title}" scheme for my ${landAcres} acre ${farmerCrops.join("/")} farm in ${farmerState}. What are the exact eligibility rules, required documents, and step-by-step application process?`;
    navigate("/chat", { state: { initialPrompt: aiPrompt } });
  };

  // Calculate realistic financial breakdown metrics
  const directIncomeTotal = eligibleSchemes
    .filter((m) => m.scheme.category === "income" || m.scheme.category === "state")
    .reduce((acc, curr) => acc + curr.scheme.annualBenefitAmount, 0);

  const incomeSchemesCount = eligibleSchemes.filter((m) => m.scheme.category === "income" || m.scheme.category === "state").length;

  return (
    <div className="flex flex-col h-[calc(100vh-1rem)] w-full bg-[#F4F3EC] select-none font-sans overflow-hidden text-left">
      
      {/* Top Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#E4E3DA] shrink-0 bg-[#F4F3EC]">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
            Government Schemes Intelligence
          </h1>

          <div className="hidden sm:flex items-center gap-1 bg-[#EBEAE2] p-1 rounded-xl border border-[#E4E3DA]">
            {[
              { id: "matched", label: `Matched For You (${eligibleSchemes.length})` },
              { id: "all", label: `All Central & State (${matchedSchemes.length})` },
              { id: "wallet", label: "Document Wallet" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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
      <div className="flex-1 p-4 md:p-6 flex flex-col lg:flex-row gap-6 overflow-y-auto no-scrollbar">

        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-6">

          {/* Improvised 3-Column Financial Summary Banner */}
          <div className="shrink-0 bg-[#0F2419] rounded-[24px] p-6 text-white flex flex-col md:flex-row items-stretch justify-between gap-6 shadow-md relative overflow-hidden border border-[#006837]/40">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 z-10">
              
              {/* Metric 1: Direct Cash Grants */}
              <div className="flex flex-col justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-[11px] font-extrabold text-[#9BD96B] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Sparkles size={13} /> Direct Income Grants
                </div>
                <div className="text-[26px] font-extrabold text-white leading-none my-1" style={{ fontFamily: "'Sora', sans-serif" }}>
                  ₹{directIncomeTotal.toLocaleString()} <span className="text-xs font-semibold text-[#A2B8AA]">/ yr</span>
                </div>
                <div className="text-[12px] font-semibold text-[#A2B8AA] mt-1">
                  {incomeSchemesCount} schemes (PM-KISAN + {farmerState})
                </div>
              </div>

              {/* Metric 2: Crop Insurance Cover */}
              <div className="flex flex-col justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-[11px] font-extrabold text-[#70C1B3] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <ShieldCheck size={13} /> Risk Protection
                </div>
                <div className="text-[26px] font-extrabold text-white leading-none my-1" style={{ fontFamily: "'Sora', sans-serif" }}>
                  ₹62,000 <span className="text-xs font-semibold text-[#A2B8AA]">/ acre</span>
                </div>
                <div className="text-[12px] font-semibold text-[#A2B8AA] mt-1">
                  PMFBY Kharif crop cover @ 2%
                </div>
              </div>

              {/* Metric 3: Credit Access */}
              <div className="flex flex-col justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-[11px] font-extrabold text-[#F3C969] uppercase tracking-wider flex items-center gap-1.5 mb-1">
                  <Zap size={13} /> Low-Interest Credit
                </div>
                <div className="text-[26px] font-extrabold text-white leading-none my-1" style={{ fontFamily: "'Sora', sans-serif" }}>
                  ₹3,00,000 <span className="text-xs font-semibold text-[#A2B8AA]">@ 4%</span>
                </div>
                <div className="text-[12px] font-semibold text-[#A2B8AA] mt-1">
                  Kisan Credit Card (KCC) limit
                </div>
              </div>

            </div>

            <div className="flex flex-col justify-between items-start md:items-end z-10 shrink-0 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
              <div className="text-[11px] font-extrabold text-[#9BD96B] bg-[#9BD96B]/10 px-3 py-1 rounded-full border border-[#9BD96B]/30 flex items-center gap-1">
                <ShieldCheck size={12} /> Matched for {farmerState} ({landAcres} ac)
              </div>
              <button 
                onClick={() => navigate("/onboarding")}
                className="bg-[#9BD96B] hover:bg-[#8ac75c] text-[#0F2419] text-xs font-extrabold px-4 py-2.5 rounded-xl transition shadow-sm mt-3 w-full md:w-auto"
              >
                Update Farm Profile
              </button>
            </div>

            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#9BD96B] rounded-full opacity-[0.04] blur-xl pointer-events-none" />
          </div>

          {/* Scheme Cards Grid */}
          <div className="flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-[18px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
                {activeTab === "matched" ? "Matched Schemes for Your Farm" : "Central & State Agriculture Schemes"}
              </h3>
              <p className="text-[12.5px] font-semibold text-[#5C6B62] mt-0.5">
                Filtered for {farmerName} · {farmerState} · {landAcres} Acres
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {(activeTab === "matched" ? eligibleSchemes : matchedSchemes).map(({ scheme, matchScore, matchReason }) => (
              <div 
                key={scheme.id}
                className="shrink-0 bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-4 hover:border-[#1B7A4B] transition duration-200"
              >
                {/* Scheme Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-[17px] font-extrabold text-[#12261D]">
                        {scheme.title}
                      </h4>

                      {/* Match Score Badge */}
                      <span className="bg-[#E6F3E4] text-[#1B7A4B] border border-[#A8DAB5] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Zap size={12} /> {matchScore}% Match
                      </span>

                      {scheme.urgencyDaysLeft && (
                        <span className="bg-[#FFF4E5] text-[#C27D00] border border-[#FCD34D] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                          ⏳ {scheme.deadlineDisplay}
                        </span>
                      )}
                    </div>

                    <p className="text-[13.5px] font-medium text-[#5C6B62] leading-relaxed">
                      {scheme.shortDescription}
                    </p>

                    <div className="text-[11.5px] font-bold text-[#1B7A4B] bg-[#FAFAF7] px-3 py-1 rounded-lg border border-[#E4E3DA] w-max">
                      🎯 {matchReason}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[22px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
                      {scheme.benefitDisplay}
                    </div>
                    <span className="text-[11px] font-bold text-[#8B978F] block">Annual Financial Cover</span>
                  </div>
                </div>

                {/* Scheme Action Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E4E3DA]">
                  <div className="flex items-center gap-2 text-[12.5px] font-semibold text-[#5C6B62]">
                    <FileText size={15} className="text-[#1B7A4B]" />
                    <span>
                      Documents ready: <span className="font-extrabold text-[#12261D]">{scheme.documentsReadyCount || 3} of {scheme.documentsRequired.length}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* AI Scheme Assistant Button */}
                    <button
                      onClick={() => handleAskAiAboutScheme(scheme)}
                      className="bg-[#E4EEF6] hover:bg-[#D0E2F2] text-[#3B6FA8] font-bold text-[13px] py-2 px-3.5 rounded-xl transition flex items-center gap-1.5"
                    >
                      <Sparkles size={14} /> Ask AI Assistant
                    </button>

                    <button
                      onClick={() => setSelectedScheme(scheme)}
                      className="bg-[#0F2419] hover:bg-[#1C3D2A] text-white font-bold text-[13px] py-2 px-4 rounded-xl transition flex items-center gap-1.5"
                    >
                      View Details &amp; Apply <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Application Status & Document Wallet */}
        <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">

          {/* AI Assistance Callout */}
          <div className="shrink-0 bg-[#12261D] text-white rounded-[24px] p-6 flex flex-col gap-3 shadow-md border border-[#006837]">
            <div className="flex items-center gap-2 text-[#9BD96B]">
              <Sparkles size={18} />
              <span className="text-xs font-extrabold uppercase tracking-wider">AI Scheme Advisor</span>
            </div>
            <h4 className="text-[15px] font-extrabold leading-tight">
              Have questions about PM-KISAN, Fasal Bima or KCC?
            </h4>
            <p className="text-[12.5px] text-[#A2B8AA] font-medium leading-relaxed">
              Our AI Assistant knows your profile, land size, and crops. Ask any scheme question in Telugu, Hindi, Tamil or 10 other languages.
            </p>
            <button
              onClick={() => navigate("/chat", { state: { initialPrompt: `Hi AI Assistant, please analyze my profile (${landAcres} acres in ${farmerState} growing ${farmerCrops.join(", ")}) and suggest top government schemes I should apply for this Kharif season.` } })}
              className="bg-[#9BD96B] hover:bg-[#8ac75c] text-[#0F2419] font-extrabold text-[13.5px] py-3 px-4 rounded-xl mt-1 w-full transition"
            >
              Ask AI Assistant Now ➔
            </button>
          </div>

          {/* Document Wallet */}
          <div className="shrink-0 bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
                Document Wallet
              </h3>
              <span className="text-[12px] font-bold text-[#A2ADA5]">4 of 5</span>
            </div>

            <div className="flex flex-col gap-3.5">
              {[
                { name: "Aadhaar Card", status: "Verified", color: "#1B7A4B" },
                { name: "Land record (1-B / Pahani)", status: "Verified", color: "#1B7A4B" },
                { name: "Bank passbook (Aadhaar Seeded)", status: "Verified", color: "#1B7A4B" },
                { name: "Crop Cultivator Rights Card", status: "Verified", color: "#1B7A4B" },
                { name: "Soil Health Card", status: "Renewal Needed", color: "#C27D00" },
              ].map((doc) => (
                <div key={doc.name} className="flex items-center justify-between text-left">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} style={{ color: doc.color }} />
                    <span className="text-[13px] font-bold text-[#12261D]">{doc.name}</span>
                  </div>
                  <span className="text-[11.5px] font-extrabold" style={{ color: doc.color }}>{doc.status}</span>
                </div>
              ))}
            </div>

            <p className="text-[11.5px] font-medium text-[#8B978F] leading-relaxed pt-2 border-t border-[#E4E3DA]">
              Stored securely for instant 1-click scheme submissions.
            </p>
          </div>

        </div>

      </div>

      {/* Scheme Details Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-[24px] border border-[#E4E3DA] p-6 md:p-8 max-w-2xl w-full flex flex-col gap-6 max-h-[90vh] overflow-y-auto text-left shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-extrabold text-[#006837] uppercase">{selectedScheme.category} Scheme</span>
                <h3 className="text-2xl font-extrabold text-[#12261D] mt-0.5">{selectedScheme.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedScheme(null)}
                className="w-8 h-8 rounded-full bg-[#F4F3EC] text-[#12261D] font-bold text-sm flex items-center justify-center hover:bg-[#E4E3DA]"
              >
                ✕
              </button>
            </div>

            <p className="text-sm text-[#5C6B62] font-medium leading-relaxed">
              {selectedScheme.fullDescription}
            </p>

            <div className="bg-[#E6F3E4] border border-[#A8DAB5] rounded-2xl p-4 flex items-center justify-between">
              <span className="text-xs font-bold text-[#1B7A4B]">Financial Benefit:</span>
              <span className="text-xl font-extrabold text-[#12261D]">{selectedScheme.benefitDisplay}</span>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-extrabold text-[#12261D]">Required Documents:</h4>
              <ul className="space-y-1.5">
                {selectedScheme.documentsRequired.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs font-semibold text-[#5C6B62]">
                    <CheckCircle2 size={14} className="text-[#006837]" /> {doc}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-extrabold text-[#12261D]">Step-by-step Application Steps:</h4>
              <ol className="space-y-2 list-decimal list-inside text-xs font-medium text-[#5C6B62]">
                {selectedScheme.applicationSteps.map((step, idx) => (
                  <li key={idx} className="leading-relaxed">{step}</li>
                ))}
              </ol>
            </div>

            <div className="flex items-center justify-between gap-4 pt-4 border-t border-[#E4E3DA] mt-2">
              <button
                onClick={() => {
                  handleAskAiAboutScheme(selectedScheme);
                  setSelectedScheme(null);
                }}
                className="bg-[#E4EEF6] hover:bg-[#D0E2F2] text-[#3B6FA8] font-bold text-xs py-3 px-4 rounded-xl transition flex items-center gap-1.5"
              >
                <Sparkles size={14} /> Ask AI Assistant in Telugu
              </button>

              <a
                href={selectedScheme.officialPortal}
                target="_blank"
                rel="noreferrer"
                className="bg-[#0F2419] hover:bg-[#1C3D2A] text-white font-bold text-xs py-3 px-5 rounded-xl transition flex items-center gap-1.5"
              >
                Official Government Portal <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
