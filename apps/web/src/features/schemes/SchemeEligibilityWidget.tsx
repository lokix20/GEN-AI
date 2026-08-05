import { useState } from "react";
import { ShieldCheck, CheckCircle, FileText, Download, Sparkles, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

interface Scheme {
  id: string;
  name: string;
  category: string;
  amount: string;
  deadline: string;
  isEligible: boolean;
  documentsNeeded: string[];
  description: string;
}

export function SchemeEligibilityWidget() {
  const [acres, setAcres] = useState<number>(4.2);
  const [crop, setCrop] = useState<string>("paddy");
  const [category, setCategory] = useState<string>("small");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  const schemes: Scheme[] = [
    {
      id: "pm-kisan",
      name: "PM-KISAN Samman Nidhi",
      category: "Direct Income Support",
      amount: "₹6,000 / year (₹2,000 per installment)",
      deadline: "22 August 2026",
      isEligible: acres <= 5,
      documentsNeeded: ["Aadhaar Card", "Land Khata / Pattadar Passbook", "Bank Passbook"],
      description: "Direct cash transfer into bank account for small and marginal landholder farmer families across India."
    },
    {
      id: "rythu-bharosa",
      name: "YSR Rythu Bharosa",
      category: "State Farmer Assistance",
      amount: "₹13,500 / year",
      deadline: "15 September 2026",
      isEligible: acres <= 10,
      documentsNeeded: ["Adangak / 1B Land Record", "Aadhaar Card", "Bank IFSC details"],
      description: "Financial assistance provided to farmer families in Andhra Pradesh before sowing season."
    },
    {
      id: "pmfby",
      name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
      category: "Crop Insurance Subsidy",
      amount: "Up to ₹35,000 / acre claim sum",
      deadline: "31 August 2026",
      isEligible: crop === "paddy" || crop === "tomato" || crop === "cotton",
      documentsNeeded: ["Sowing Certificate from VAA", "Land Lease / Ownership Copy", "Bank Details"],
      description: "Comprehensive risk insurance covering yield losses due to non-preventable natural risks."
    },
    {
      id: "drip-subsidy",
      name: "Micro-Irrigation Drip Subsidy Scheme",
      category: "Equipment Subsidy",
      amount: "90% Subsidy on Drip Kits",
      deadline: "Open round the year",
      isEligible: category === "small" || acres <= 5,
      documentsNeeded: ["Soil & Water Testing Report", "Pattadar Passbook", "Aadhaar"],
      description: "90% subsidy for small/marginal farmers for installing drip and sprinkler irrigation systems."
    }
  ];

  const eligibleCount = schemes.filter((s) => s.isEligible).length;

  const handleOpenFormGenerator = (scheme: Scheme) => {
    setSelectedScheme(scheme);
    setShowModal(true);
  };

  return (
    <Card className="border-[#D6E4DB] shadow-sm bg-white overflow-hidden text-left">
      <CardHeader className="bg-[#0F2B1D] text-white py-4 px-6 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-[#236A43]" />
          <div>
            <CardTitle className="text-base font-bold text-[#FAF8F5]">Government Scheme Eligibility Engine</CardTitle>
            <p className="text-xs text-[#B5D1C1]">Automated verification against Central & State land policies</p>
          </div>
        </div>
        <Badge className="bg-[#236A43] text-white text-xs font-bold px-3 py-1">
          {eligibleCount} Eligible Schemes
        </Badge>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Input Parameters Form */}
        <div className="bg-[#F7FAF6] border border-[#D6E4DB] p-4 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1 text-xs">
            <label className="font-bold text-[#0A1C13]">Land Holding (Acres)</label>
            <input
              type="number"
              step="0.1"
              value={acres}
              onChange={(e) => setAcres(Number(e.target.value))}
              className="w-full bg-white border border-[#D6E4DB] rounded-lg px-3 py-1.5 font-bold text-[#0A1C13]"
            />
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-bold text-[#0A1C13]">Primary Crop</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full bg-white border border-[#D6E4DB] rounded-lg px-3 py-1.5 font-bold text-[#0A1C13]"
            >
              <option value="paddy">Paddy (Rice)</option>
              <option value="tomato">Tomato</option>
              <option value="cotton">Cotton</option>
              <option value="chilli">Red Chilli</option>
            </select>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-bold text-[#0A1C13]">Farmer Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white border border-[#D6E4DB] rounded-lg px-3 py-1.5 font-bold text-[#0A1C13]"
            >
              <option value="small">Small / Marginal (&lt; 5 Acres)</option>
              <option value="medium">Medium (5 - 10 Acres)</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>

        {/* Schemes List */}
        <div className="space-y-4">
          {schemes.map((scheme) => (
            <div
              key={scheme.id}
              className={`border rounded-xl p-4 transition ${
                scheme.isEligible
                  ? "bg-white border-[#D6E4DB] shadow-sm hover:border-[#236A43]"
                  : "bg-[#F7FAF6] border-gray-200 opacity-60"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-[#0A1C13]">{scheme.name}</span>
                    {scheme.isEligible ? (
                      <span className="text-[11px] font-bold text-[#1B5434] bg-[#E4F2E9] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" /> Eligible
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> Not Eligible
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5C7866] leading-relaxed">{scheme.description}</p>
                </div>

                <div className="text-left sm:text-right shrink-0 space-y-1">
                  <div className="text-sm font-extrabold text-[#236A43]">{scheme.amount}</div>
                  <div className="text-[11px] text-[#5C7866]">Deadline: {scheme.deadline}</div>
                </div>
              </div>

              {/* Documents & Application Button */}
              {scheme.isEligible && (
                <div className="mt-3 pt-3 border-t border-[#D6E4DB]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-[#5C7866]">
                    <FileText className="h-3.5 w-3.5 text-[#236A43]" />
                    <span>Required: {scheme.documentsNeeded.join(" · ")}</span>
                  </div>

                  <Button
                    onClick={() => handleOpenFormGenerator(scheme)}
                    size="sm"
                    className="bg-[#236A43] hover:bg-[#1B5434] text-white font-bold text-xs py-1.5 px-4 rounded-lg flex items-center gap-1.5 shadow"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Generate Pre-filled Form</span>
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>

      {/* Pre-filled Form Modal Generator */}
      {showModal && selectedScheme && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 text-left shadow-2xl border border-[#D6E4DB]">
            <div className="flex justify-between items-start border-b border-[#D6E4DB] pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-[#0A1C13]">📄 Auto-Generated Application Slip</h3>
                <p className="text-xs text-[#5C7866]">{selectedScheme.name}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#EDF5EF] p-4 rounded-xl space-y-2 text-xs text-[#0A1C13]">
              <div className="font-bold text-sm text-[#236A43] border-b border-[#D6E4DB] pb-1">
                Applicant Information (Pre-filled from Farm Profile)
              </div>
              <p>• <strong>Farmer Name:</strong> Ramesh Naidu</p>
              <p>• <strong>Land Extent:</strong> {acres} Acres ({crop.toUpperCase()} Cultivation)</p>
              <p>• <strong>Village / District:</strong> Vizianagaram, Andhra Pradesh</p>
              <p>• <strong>Aadhaar Last 4 Digits:</strong> XXXX-XXXX-4821</p>
              <p>• <strong>Beneficiary Category:</strong> Small & Marginal Farmer (SF/MF)</p>
            </div>

            <div className="text-xs text-[#5C7866] space-y-1">
              <span className="font-bold text-[#0A1C13]">Next Steps:</span>
              <p>1. Print or download this pre-filled slip.</p>
              <p>2. Submit to your local Village Agriculture Assistant (VAA) at the Rythu Bharosa Kendra (RBK).</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowModal(false)} className="text-xs">
                Close
              </Button>
              <Button
                onClick={() => {
                  alert(`Pre-filled application form for ${selectedScheme.name} generated successfully!`);
                  setShowModal(false);
                }}
                className="bg-[#236A43] text-white hover:bg-[#1B5434] text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="h-4 w-4" /> Download Application PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
