import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils.js";

function Pill({ tone, children }: { tone: "green" | "orange"; children: ReactNode }) {
  return (
    <span
      className={cn(
        "text-[11px] font-extrabold px-2 py-1 rounded-md",
        tone === "green" ? "bg-[#E6F3E4] text-[#1B7A4B]" : "bg-[#FFF4E5] text-[#C27D00]"
      )}
    >
      {children}
    </span>
  );
}

export function SchemesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("For you");

  return (
    <div className="flex flex-col h-[calc(100vh-1rem)] w-full bg-[#F4F3EC] select-none font-sans overflow-hidden">

      {/* Full-width Top Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#E4E3DA] shrink-0 bg-[#F4F3EC]">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
            Government Schemes
          </h1>

          <div className="hidden sm:flex items-center gap-1 bg-[#EBEAE2] p-1 rounded-xl border border-[#E4E3DA]">
            {["For you", "My applications", "All schemes", "Documents"].map((tab) => (
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

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-6 flex flex-col lg:flex-row gap-6 overflow-y-auto no-scrollbar">

        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-6">

          {/* Summary Banner */}
          <div className="shrink-0 bg-[#0F2419] rounded-[24px] p-6 text-white flex flex-col sm:flex-row items-start justify-between gap-6 shadow-sm relative overflow-hidden">
            <div className="flex flex-col z-10">
              <div className="text-[11px] font-bold text-[#A2B8AA] uppercase tracking-widest mb-1">
                Available to you now
              </div>
              <div className="text-[32px] font-extrabold leading-none tracking-tight text-[#9BD96B]" style={{ fontFamily: "'Sora', sans-serif" }}>
                ₹34,000
              </div>
              <div className="text-[13px] font-medium text-[#A2B8AA] mt-2">
                across 3 schemes you qualify for
              </div>
            </div>

            <div className="flex flex-col z-10">
              <div className="text-[11px] font-bold text-[#A2B8AA] uppercase tracking-widest mb-1">
                In progress
              </div>
              <div className="text-[32px] font-extrabold leading-none tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                ₹12,000
              </div>
              <div className="text-[13px] font-medium text-[#A2B8AA] mt-2">
                2 applications under review
              </div>
            </div>

            <div className="flex flex-col z-10">
              <div className="text-[11px] font-bold text-[#A2B8AA] uppercase tracking-widest mb-1">
                Received this year
              </div>
              <div className="text-[32px] font-extrabold leading-none tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
                ₹18,000
              </div>
              <div className="text-[13px] font-medium text-[#A2B8AA] mt-2">
                last credit 12 Apr
              </div>
            </div>

            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#9BD96B] rounded-full opacity-[0.03] blur-xl" />
          </div>

          {/* Claim These Now */}
          <div className="flex items-center justify-between shrink-0">
            <h3 className="text-[18px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
              Claim these now
            </h3>
            <p className="text-[13px] font-medium text-[#A2ADA5]">
              Matched to your land record, crops and income band
            </p>
          </div>

          <div className="flex flex-col gap-4">

            {/* PM-KISAN */}
            <div className="shrink-0 bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-[16px] font-extrabold text-[#12261D]">PM-KISAN · 16th instalment</h4>
                    <Pill tone="green">Eligible</Pill>
                    <Pill tone="orange">17 days left</Pill>
                  </div>
                  <p className="text-[13.5px] font-medium text-[#5C6B62] leading-relaxed">
                    Direct income support for landholding farmers. Paid straight to your bank account.
                  </p>
                </div>
                <div className="text-[22px] font-extrabold text-[#12261D] shrink-0" style={{ fontFamily: "'Sora', sans-serif" }}>
                  ₹2,000
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-3 border-t border-[#E4E3DA]">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-24 h-1.5 bg-[#FAFAF7] border border-[#E4E3DA] rounded-full overflow-hidden shrink-0">
                    <div className="h-full bg-[#1B7A4B] w-4/5 rounded-full" />
                  </div>
                  <span className="text-[12.5px] font-semibold text-[#5C6B62]">
                    4 of 5 documents ready — <span className="font-extrabold text-[#12261D]">bank passbook missing</span>
                  </span>
                </div>
                <button className="bg-[#0F2419] hover:bg-[#1C3D2A] text-white font-bold text-[13.5px] py-2.5 px-4 rounded-xl transition shrink-0">
                  Continue application
                </button>
              </div>
            </div>

            {/* Fasal Bima */}
            <div className="shrink-0 bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-[16px] font-extrabold text-[#12261D]">Pradhan Mantri Fasal Bima Yojana</h4>
                    <Pill tone="green">Eligible</Pill>
                    <Pill tone="orange">Kharif window</Pill>
                  </div>
                  <p className="text-[13.5px] font-medium text-[#5C6B62] leading-relaxed">
                    Crop insurance for paddy at 2% premium. Covers blight, flood and cyclone loss on Plot A.
                  </p>
                </div>
                <div className="text-[22px] font-extrabold text-[#12261D] shrink-0 text-right" style={{ fontFamily: "'Sora', sans-serif" }}>
                  ₹62,000<span className="block text-[12px] font-bold text-[#5C6B62]">cover</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-3 border-t border-[#E4E3DA]">
                <span className="text-[12.5px] font-semibold text-[#5C6B62]">
                  Premium ₹1,180 · sum insured ₹62,000 · enrol before 31 Aug
                </span>
                <button className="bg-[#0F2419] hover:bg-[#1C3D2A] text-white font-bold text-[13.5px] py-2.5 px-4 rounded-xl transition shrink-0">
                  Check premium
                </button>
              </div>
            </div>

            {/* PMKSY */}
            <div className="shrink-0 bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-[16px] font-extrabold text-[#12261D]">Micro-irrigation subsidy (PMKSY)</h4>
                    <Pill tone="green">Likely eligible</Pill>
                  </div>
                  <p className="text-[13.5px] font-medium text-[#5C6B62] leading-relaxed">
                    55% subsidy on drip for small farmers. Your Plot B drip lines qualify for replacement.
                  </p>
                </div>
                <div className="text-[22px] font-extrabold text-[#12261D] shrink-0" style={{ fontFamily: "'Sora', sans-serif" }}>
                  ₹32,000
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-3 border-t border-[#E4E3DA]">
                <span className="text-[12.5px] font-semibold text-[#5C6B62]">
                  Needs a soil health card — yours expired in March
                </span>
                <button className="bg-white border border-[#DCDBD1] hover:bg-[#FAFAF7] text-[#12261D] font-bold text-[13.5px] py-2.5 px-4 rounded-xl transition shrink-0">
                  See requirements
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-[320px] shrink-0 flex flex-col gap-6">

          {/* Application Status */}
          <div className="shrink-0 bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-5">
            <h3 className="text-[15px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
              Application status
            </h3>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[13.5px] font-extrabold text-[#12261D]">Soil Health Card</span>
                <span className="text-[11.5px] font-semibold text-[#A2ADA5]">Applied 22 Jul</span>
              </div>
              <div className="flex gap-1">
                <div className="h-1.5 flex-1 rounded-full bg-[#1B7A4B]" />
                <div className="h-1.5 flex-1 rounded-full bg-[#1B7A4B]" />
                <div className="h-1.5 flex-1 rounded-full bg-[#FAFAF7] border border-[#E4E3DA]" />
                <div className="h-1.5 flex-1 rounded-full bg-[#FAFAF7] border border-[#E4E3DA]" />
              </div>
              <span className="text-[12px] font-semibold text-[#8B978F] mt-0.5">
                Soil sample collected · lab result in ~10 days
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[13.5px] font-extrabold text-[#12261D]">Farm pond subsidy</span>
                <span className="text-[11.5px] font-semibold text-[#A2ADA5]">Applied 3 Jun</span>
              </div>
              <div className="flex gap-1">
                <div className="h-1.5 flex-1 rounded-full bg-[#1B7A4B]" />
                <div className="h-1.5 flex-1 rounded-full bg-[#1B7A4B]" />
                <div className="h-1.5 flex-1 rounded-full bg-[#1B7A4B]" />
                <div className="h-1.5 flex-1 rounded-full bg-[#C27D00]" />
              </div>
              <span className="text-[12px] font-semibold text-[#8B978F] mt-0.5">
                Field verification scheduled 11 Aug
              </span>
            </div>
          </div>

          {/* Document Wallet */}
          <div className="shrink-0 bg-white border border-[#E4E3DA] rounded-[24px] p-6 shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-extrabold text-[#12261D]" style={{ fontFamily: "'Sora', sans-serif" }}>
                Document wallet
              </h3>
              <span className="text-[12px] font-bold text-[#A2ADA5]">5 of 7</span>
            </div>

            <div className="flex flex-col gap-3.5">
              {[
                { name: "Aadhaar", status: "Verified", color: "#1B7A4B" },
                { name: "Land record (1-B)", status: "Verified", color: "#1B7A4B" },
                { name: "Bank passbook", status: "Upload", color: "#D94F4F" },
                { name: "Soil health card", status: "Expired", color: "#C27D00" },
              ].map((doc) => (
                <div key={doc.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: doc.color }} />
                    <span className="text-[13.5px] font-bold text-[#12261D]">{doc.name}</span>
                  </div>
                  <span className="text-[12.5px] font-extrabold" style={{ color: doc.color }}>{doc.status}</span>
                </div>
              ))}
            </div>

            <p className="text-[11.5px] font-medium text-[#8B978F] leading-relaxed pt-1 border-t border-[#E4E3DA]">
              Uploaded once, reused for every application — no repeat trips to the office.
            </p>
          </div>

          {/* Confused by a form */}
          <div className="shrink-0 bg-[#0F2419] rounded-[24px] p-6 mt-auto flex flex-col gap-3 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#9BD96B] rounded-full opacity-[0.03] -translate-y-10 translate-x-10" />
            <h4 className="text-[15px] font-extrabold tracking-tight relative z-10" style={{ fontFamily: "'Sora', sans-serif" }}>
              Confused by a form?
            </h4>
            <p className="text-[13px] text-[#A2B8AA] font-medium leading-relaxed relative z-10">
              Read any scheme&apos;s rules in Telugu, or have a helper fill it with you over a call.
            </p>
            <button className="bg-[#9BD96B] hover:bg-[#8ac75c] text-[#0F2419] font-extrabold text-[14px] py-3 px-4 rounded-xl mt-2 w-full transition relative z-10">
              Get help applying
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
