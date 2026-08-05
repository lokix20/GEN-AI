export interface Scheme {
  id: string;
  title: string;
  category: "income" | "insurance" | "credit" | "irrigation" | "solar" | "state" | "machinery" | "market";
  shortDescription: string;
  fullDescription: string;
  annualBenefitAmount: number; // in INR
  benefitDisplay: string;
  urgencyDaysLeft?: number;
  deadlineDisplay?: string;
  applicableStates?: string[]; // e.g. ["Andhra Pradesh", "Telangana"] or undefined for all India
  minLandAcres?: number;
  maxLandAcres?: number;
  targetCrops?: string[]; // e.g. ["Paddy", "Tomato", "Cotton"]
  documentsRequired: string[];
  documentsReadyCount?: number;
  totalDocumentsCount?: number;
  applicationUrl?: string;
  applicationSteps: string[];
  officialPortal: string;
}

export const REAL_SCHEMES: Scheme[] = [
  {
    id: "pm-kisan",
    title: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    category: "income",
    shortDescription: "Direct income support of ₹6,000 per year paid directly to farmer bank accounts in 3 equal instalments.",
    fullDescription: "Under PM-KISAN, eligible landholding farmer families receive financial assistance of ₹6,000 per year in three equal instalments of ₹2,000 every four months directly into their Aadhaar-seeded bank accounts.",
    annualBenefitAmount: 6000,
    benefitDisplay: "₹2,000 / instalment",
    urgencyDaysLeft: 17,
    deadlineDisplay: "16th Instalment closing soon",
    targetCrops: ["Paddy", "Tomato", "Cotton", "Maize", "Chilly", "Wheat", "Sugarcane"],
    documentsRequired: [
      "Aadhaar Card linked with Mobile Number",
      "Land Record Document (1-B / Pahani / Khatauni)",
      "Bank Account Passbook (Aadhaar Seeded / NPCI active)",
      "e-KYC Completion Certificate"
    ],
    documentsReadyCount: 4,
    totalDocumentsCount: 4,
    applicationSteps: [
      "Verify e-KYC on PM-KISAN official portal using Aadhaar OTP or Biometric at CSC centre.",
      "Check land seeding status in your local Revenue Department / Village Secretariat.",
      "Ensure bank account is NPCI-mapped for Direct Benefit Transfer (DBT)."
    ],
    officialPortal: "https://pmkisan.gov.in"
  },
  {
    id: "pmfby",
    title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    category: "insurance",
    shortDescription: "Comprehensive crop insurance against drought, flood, leaf blight, pest attacks, and post-harvest cyclone losses.",
    fullDescription: "PMFBY provides financial cover for yield losses due to non-preventable natural risks (drought, dry spells, flood, inundation, pests & disease blight). Farmers pay only 2% premium for Kharif crops and 1.5% for Rabi crops.",
    annualBenefitAmount: 62000,
    benefitDisplay: "₹62,000 / acre cover",
    urgencyDaysLeft: 26,
    deadlineDisplay: "Kharif enrolment closes 31 Aug",
    targetCrops: ["Paddy", "Tomato", "Cotton", "Maize", "Groundnut"],
    documentsRequired: [
      "Land Ownership Certificate / Webland 1-B Copy / Lease Agreement",
      "Sowing Certificate issued by Village Agricultural Assistant (VAA)",
      "Aadhaar Card",
      "Cancelled Bank Cheque / Bank Passbook Copy"
    ],
    documentsReadyCount: 3,
    totalDocumentsCount: 4,
    applicationSteps: [
      "Obtain Sowing Certificate for current Kharif crop from your Village Secretariat / KVK office.",
      "Pay nominal premium (₹1,180 per acre for Paddy) via bank or online portal.",
      "Download crop insurance policy receipt for claim settlements."
    ],
    officialPortal: "https://pmfby.gov.in"
  },
  {
    id: "ysr-rythu-bharosa",
    title: "YSR Rythu Bharosa - PM KISAN (Andhra Pradesh)",
    category: "state",
    shortDescription: "State financial assistance of ₹13,500 per year to AP farmer families, including tenant farmers (SC/ST/BC/Minority).",
    fullDescription: "The Government of Andhra Pradesh provides ₹13,500 per year to landowning and tenant farmer families in AP to meet investment needs during sowing season. Includes ₹6,000 from PM-KISAN.",
    annualBenefitAmount: 13500,
    benefitDisplay: "₹13,500 / year",
    applicableStates: ["Andhra Pradesh"],
    targetCrops: ["Paddy", "Tomato", "Cotton", "Groundnut", "Chilly"],
    documentsRequired: [
      "Webland 1-B Adangal Copy",
      "Crop Cultivator Rights Card (CCRC) for Tenant Farmers",
      "Aadhaar Card",
      "Savings Bank Passbook Copy"
    ],
    documentsReadyCount: 3,
    totalDocumentsCount: 4,
    applicationSteps: [
      "Submit land details or CCRC card at your local Rythu Bharosa Kendra (RBK).",
      "Verify social audit list displayed at Village Secretariat.",
      "Receive automated direct bank transfer prior to Kharif sowing."
    ],
    officialPortal: "https://rythubharosa.ap.gov.in"
  },
  {
    id: "rythu-bandhu",
    title: "Rythu Bandhu Investment Support (Telangana)",
    category: "state",
    shortDescription: "Financial assistance of ₹10,000 per acre per year (₹5,000 per season) to all landowning farmers in Telangana.",
    fullDescription: "Telangana state scheme providing ₹5,000 per acre per season directly into farmers' bank accounts ahead of Kharif and Rabi seasons to purchase seeds, fertilizers, pesticides, and field labor.",
    annualBenefitAmount: 10000,
    benefitDisplay: "₹10,000 / acre",
    applicableStates: ["Telangana"],
    targetCrops: ["Paddy", "Cotton", "Maize", "Redgram"],
    documentsRequired: [
      "Pattadar Passbook (Dharani Portal Verified)",
      "Aadhaar Card",
      "Aadhaar-seeded Bank Passbook"
    ],
    documentsReadyCount: 3,
    totalDocumentsCount: 3,
    applicationSteps: [
      "Ensure land is registered on the Dharani portal with updated Pattadar Passbook.",
      "Link Bank account with Aadhaar at local bank branch.",
      "Check treasury status on Dharani portal during seasonal releases."
    ],
    officialPortal: "https://dharani.telangana.gov.in"
  },
  {
    id: "namo-shetkari",
    title: "Namo Shetkari MahaSanman Nidhi Yojana (Maharashtra)",
    category: "state",
    shortDescription: "State financial assistance of ₹6,000/year to Maharashtra farmers (combines with PM-KISAN for total ₹12,000/year).",
    fullDescription: "Government of Maharashtra provides ₹6,000 annually in 3 equal installments of ₹2,000 to landholding farmers in Maharashtra. Combines with PM-KISAN to deliver total ₹12,000 per year directly to farmer bank accounts.",
    annualBenefitAmount: 6000,
    benefitDisplay: "₹6,000 / year (State Top-up)",
    applicableStates: ["Maharashtra"],
    targetCrops: ["Cotton", "Sugarcane", "Soybean", "Onion", "Paddy"],
    documentsRequired: [
      "7/12 & 8A Land Extract Document",
      "Aadhaar Card linked with Mobile",
      "Aadhaar-Seeded Bank Passbook"
    ],
    documentsReadyCount: 3,
    totalDocumentsCount: 3,
    applicationSteps: [
      "Register on MahaDBT portal or verify existing PM-KISAN registration.",
      "Submit updated 7/12 extract at Gram Panchayat office.",
      "Receive direct bank transfer alongside PM-KISAN installments."
    ],
    officialPortal: "https://nsmny.maharashtra.gov.in"
  },
  {
    id: "kcc",
    title: "Kisan Credit Card (KCC) Concessional Crop Loan",
    category: "credit",
    shortDescription: "Low-interest crop loan up to ₹3 Lakh at an effective interest rate of 4% per annum with prompt repayment subvention.",
    fullDescription: "KCC provides short-term credit to farmers to buy high-quality seeds, fertilizers, pesticides, and pay for field machinery rentals. No collateral required for loans up to ₹1.6 Lakh.",
    annualBenefitAmount: 300000,
    benefitDisplay: "Up to ₹3,000,000 credit @ 4%",
    targetCrops: ["Paddy", "Tomato", "Cotton", "Maize", "Chilly", "Sugarcane"],
    documentsRequired: [
      "Duly filled KCC Application Form",
      "Land Holding Proof (Pahani / 1-B / Land Revenue Receipt)",
      "Aadhaar Card & PAN Card",
      "2 Recent Passport Size Photographs"
    ],
    documentsReadyCount: 4,
    totalDocumentsCount: 4,
    applicationSteps: [
      "Fill the 1-page simplified KCC form available at any Commercial or Rural Bank.",
      "Submit land record copy verified by Village Revenue Officer (VRO).",
      "Get instant credit card limit issued within 14 days."
    ],
    officialPortal: "https://www.nabard.org"
  },
  {
    id: "pmksy-drip",
    title: "Micro Irrigation Subsidy (PMKSY - Per Drop More Crop)",
    category: "irrigation",
    shortDescription: "55% to 90% capital subsidy on Drip and Sprinkler irrigation systems for small & marginal farmers.",
    fullDescription: "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY) offers capital subsidy for installing modern drip lines, inline emitters, and micro-sprinklers to save 50% water and boost crop yield by 30%.",
    annualBenefitAmount: 32000,
    benefitDisplay: "55% - 90% Subsidy",
    targetCrops: ["Tomato", "Cotton", "Chilly", "Groundnut", "Fruit Crops"],
    documentsRequired: [
      "Land Record 1-B / Adangal",
      "Borewell / Water Source Certificate",
      "Soil & Water Test Report (KVK Verified)",
      "Aadhaar Card & Bank Passbook Copy"
    ],
    documentsReadyCount: 2,
    totalDocumentsCount: 4,
    applicationSteps: [
      "Apply online on State Micro Irrigation Project portal (MIP AP / TSMIP).",
      "Select approved drip manufacturer (e.g. Jain, Netafim, Captain).",
      "Field officer conducts site inspection & verifies water source."
    ],
    officialPortal: "https://pmksy.gov.in"
  },
  {
    id: "pm-pranam",
    title: "PM-PRANAM Bio-Fertilizer & Organic Soil Health Subsidy",
    category: "income",
    shortDescription: "Incentives of ₹5,000 / acre for adopting bio-fertilizers, neem cake, and reducing synthetic chemical urea usage.",
    fullDescription: "PM-PRANAM promotes balanced soil nutrition by incentivizing farmers to switch to bio-fertilizers, liquid nano-urea, and organic vermicompost, restoring natural soil microbes.",
    annualBenefitAmount: 5000,
    benefitDisplay: "₹5,000 / acre Soil Incentive",
    targetCrops: ["Paddy", "Tomato", "Cotton", "Maize", "Vegetables"],
    documentsRequired: [
      "Soil Health Card Report",
      "Land Ownership Document 1-B",
      "Aadhaar Card & Bank Passbook"
    ],
    documentsReadyCount: 3,
    totalDocumentsCount: 3,
    applicationSteps: [
      "Submit Soil Health Card test report at Village Secretariat / KVK.",
      "Purchase nano-urea or organic bio-fertilizers from authorized IFFCO / KVK stores.",
      "Receive direct incentive credit in bank account."
    ],
    officialPortal: "https://agricoop.nic.in"
  },
  {
    id: "pm-kusum",
    title: "PM-KUSUM Solar Irrigation Pump Scheme",
    category: "solar",
    shortDescription: "60% subsidy for setting up 3 HP to 10 HP standalone solar water pumps for off-grid farm irrigation.",
    fullDescription: "PM-KUSUM enables farmers to replace costly diesel pumps with clean solar pumps. Central government provides 30% subsidy, State provides 30% subsidy, and bank loan covers 30%. Farmer pays only 10%.",
    annualBenefitAmount: 145000,
    benefitDisplay: "60% Solar Pump Subsidy",
    targetCrops: ["Paddy", "Tomato", "Cotton", "Groundnut"],
    documentsRequired: [
      "Land Ownership Document (minimum 0.5 acre)",
      "Borewell Test Certificate / Water availability proof",
      "No-Electricity Connection Certificate from DISCOM",
      "Aadhaar & Bank Details"
    ],
    documentsReadyCount: 3,
    totalDocumentsCount: 4,
    applicationSteps: [
      "Register on state renewable energy development agency portal (NREDAP / REDCO).",
      "Deposit 10% farmer share amount after tender allocation.",
      "Authorized vendor installs solar pump setup within 45 days."
    ],
    officialPortal: "https://pmkusum.mnre.gov.in"
  },
  {
    id: "smam-machinery",
    title: "Sub-Mission on Agricultural Mechanization (SMAM)",
    category: "machinery",
    shortDescription: "40% to 50% subsidy on farm machinery like tractors, rotavators, power tillers, sprayers, and combine harvesters.",
    fullDescription: "SMAM helps small farmers purchase modern farm machinery at discounted rates or access equipment from Custom Hiring Centres (CHC) at affordable hourly rental charges.",
    annualBenefitAmount: 45000,
    benefitDisplay: "50% Equipment Subsidy",
    targetCrops: ["Paddy", "Cotton", "Maize"],
    documentsRequired: [
      "Aadhaar Card",
      "Land Record 1-B",
      "Official Quotation from Authorized Dealer",
      "Bank Account Details"
    ],
    documentsReadyCount: 3,
    totalDocumentsCount: 4,
    applicationSteps: [
      "Register on Agmachinery portal (agrimachinery.nic.in).",
      "Select desired machinery model and upload dealer quotation.",
      "Receive direct subsidy transfer after physical verification."
    ],
    officialPortal: "https://agrimachinery.nic.in"
  },
  {
    id: "aif-infra",
    title: "Agriculture Infrastructure Fund (AIF)",
    category: "credit",
    shortDescription: "3% interest subvention per annum on bank loans up to ₹2 Crore for building farmgate cold storages & warehouses.",
    fullDescription: "AIF provides medium to long-term debt financing facility for investment in viable projects for post-harvest management infrastructure and community farming assets like solar dryers, cold stores, and packhouses.",
    annualBenefitAmount: 200000,
    benefitDisplay: "3% Interest Subvention (up to ₹2 Cr)",
    targetCrops: ["Tomato", "Paddy", "Chilly", "Fruit Crops", "Vegetables"],
    documentsRequired: [
      "Detailed Project Report (DPR)",
      "Land Ownership / Lease Deed Document",
      "Bank Sanction Letter",
      "Aadhaar & PAN Card"
    ],
    documentsReadyCount: 3,
    totalDocumentsCount: 4,
    applicationSteps: [
      "Submit Detailed Project Report (DPR) on AIF online portal.",
      "Track bank appraisal and approval status online.",
      "Enjoy 3% interest subvention credited directly into loan account."
    ],
    officialPortal: "https://agriinfra.dac.gov.in"
  },
  {
    id: "pkvy-organic",
    title: "Paramparagat Krishi Vikas Yojana (PKVY Organic Cluster)",
    category: "market",
    shortDescription: "₹50,000 per hectare assistance over 3 years for organic farming clusters, PGS certification & direct market linkage.",
    fullDescription: "PKVY supports organic farming practices by forming farmer clusters. Out of ₹50,000/ha, ₹31,000 is directly provided to farmers for purchasing bio-seeds, vermicompost, bio-pesticides, and organic packaging.",
    annualBenefitAmount: 16600,
    benefitDisplay: "₹50,000 / hectare (3 Years)",
    targetCrops: ["Paddy", "Tomato", "Cotton", "Millets", "Pulses"],
    documentsRequired: [
      "Land 1-B Record",
      "Farmer Cluster Formation Consent Form",
      "Aadhaar & Bank Account Copy"
    ],
    documentsReadyCount: 3,
    totalDocumentsCount: 3,
    applicationSteps: [
      "Join a 50-acre farmer cluster formed by local Agricultural Extension Officer.",
      "Adopt PGS (Participatory Guarantee System) organic cultivation guidelines.",
      "Receive organic inputs and financial grant credited to bank account."
    ],
    officialPortal: "https://pgsindia-ncof.gov.in"
  }
];

export interface FarmerProfileForMatching {
  name: string;
  state: string;
  district: string;
  farmSizeAcres: number;
  mainCrops: string[];
}

export interface MatchedScheme {
  scheme: Scheme;
  matchScore: number; // 0 to 100
  matchReason: string;
  isEligible: boolean;
}

export function matchSchemesForProfile(profile: FarmerProfileForMatching | null): MatchedScheme[] {
  const farmerState = profile?.state || "Andhra Pradesh";
  const farmerCrops = profile?.mainCrops || ["Paddy", "Tomato", "Cotton"];
  const landAcres = profile?.farmSizeAcres || 4.2;

  return REAL_SCHEMES.map((scheme) => {
    let score = 70; // baseline
    let reasons: string[] = [];
    let isEligible = true;

    // Check State Match
    if (scheme.applicableStates && scheme.applicableStates.length > 0) {
      if (scheme.applicableStates.includes(farmerState)) {
        score += 20;
        reasons.push(`Available in ${farmerState}`);
      } else {
        score -= 50;
        isEligible = false;
        reasons.push(`Only for ${scheme.applicableStates.join(", ")}`);
      }
    } else {
      reasons.push("All-India Central Scheme");
    }

    // Check Crop Match
    if (scheme.targetCrops && scheme.targetCrops.length > 0) {
      const matchingCrops = farmerCrops.filter((crop) => scheme.targetCrops?.includes(crop));
      if (matchingCrops.length > 0) {
        score += 15;
        reasons.push(`Matches your ${matchingCrops.join(" & ")} crops`);
      }
    }

    // Check Land Size Rules
    if (scheme.minLandAcres && landAcres < scheme.minLandAcres) {
      isEligible = false;
      score -= 30;
      reasons.push(`Requires min ${scheme.minLandAcres} acres`);
    }

    if (scheme.maxLandAcres && landAcres > scheme.maxLandAcres) {
      isEligible = false;
      score -= 30;
      reasons.push(`For landholders up to ${scheme.maxLandAcres} acres`);
    } else if (landAcres <= 5) {
      score += 10;
      reasons.push("Small & Marginal farmer priority");
    }

    const finalScore = Math.min(99, Math.max(20, score));

    return {
      scheme,
      matchScore: finalScore,
      matchReason: reasons.slice(0, 2).join(" · "),
      isEligible,
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}
