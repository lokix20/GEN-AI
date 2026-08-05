import type { DiseaseReportDTO } from "@haritha/shared-types";

const MODEL = "gemini-1.5-flash";

const PROMPT = `You are a senior plant pathologist and agronomist specializing in Indian smallholder farming. Analyze the crop photograph carefully.

Look at: leaf color, spots, lesions, texture, wilting patterns, discoloration, and any visible pathogen structures.

Rules:
- Identify the primary disease/condition accurately.
- If the crop is healthy, set diseaseName to "Healthy" and severity to "healthy".
- Provide treatment specific to Indian agriculture using inputs available at Krishi Kendras (KVKs).
- Dosage in practical field units (per litre water, per acre).
- actWithinHours: healthy=720, low=168, moderate=72, high=48, critical=24.
- alternativeDiagnoses: 2-3 other plausible conditions.

Return ONLY a valid JSON object with NO markdown, NO prose. Match this schema exactly:
{
  "diseaseName": "precise scientific/common name",
  "confidence": 0.0-1.0,
  "severity": "healthy|low|moderate|high|critical",
  "affectedArea": "e.g. 20-30% of leaf area showing necrotic lesions",
  "cause": "pathogen name, type (fungal/bacterial/viral/pest), key trigger conditions",
  "organicSolution": "specific organic/bio-input treatment with application method",
  "chemicalSolution": "specific chemical generic name + brand + formulation + concentration",
  "dosageInstructions": "e.g. Mix 2g Mancozeb 75WP per litre water, spray 200L per acre, repeat after 7 days",
  "actWithinHours": 72,
  "preventionTips": ["3-5 actionable prevention strings"],
  "alternativeDiagnoses": [{"diseaseName": "string", "confidence": 0.0}]
}`;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      resolve(dataUrl.split(",")[1]); // strip the data:...;base64, prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function analyzeWithGemini(file: File, cropName: string): Promise<DiseaseReportDTO> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("VITE_GEMINI_API_KEY is not set");

  const base64 = await fileToBase64(file);
  const mimeType = file.type || "image/jpeg";
  const promptText = cropName ? `${PROMPT}\n\nThe crop in the image is: ${cropName}.` : PROMPT;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            { text: promptText },
            { inlineData: { mimeType, data: base64 } },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini vision failed: ${res.status} ${err}`);
  }

  const json = await res.json() as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned no content");

  const result = JSON.parse(text) as Omit<DiseaseReportDTO, "id" | "cropName" | "imageUrl" | "createdAt">;

  return {
    ...result,
    id: crypto.randomUUID(),
    cropName,
    imageUrl: URL.createObjectURL(file),
    createdAt: new Date().toISOString(),
  };
}
