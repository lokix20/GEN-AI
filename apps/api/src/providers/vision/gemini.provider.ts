import type { DiseaseDetectionResultDTO } from "@haritha/shared-types";
import type { AnalyzeCropImageInput, VisionProvider } from "./vision-provider.interface.js";

const MODEL = "gemini-1.5-flash";

const PROMPT_PREFIX = `You are a senior plant pathologist and agronomist specializing in Indian smallholder farming. Analyze the crop photograph carefully.

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
  "affectedArea": "e.g. '20-30% of leaf area showing necrotic lesions'",
  "cause": "pathogen name, type (fungal/bacterial/viral/pest), key trigger conditions",
  "organicSolution": "specific organic/bio-input treatment with application method",
  "chemicalSolution": "specific chemical generic name + brand + formulation + concentration",
  "dosageInstructions": "e.g. Mix 2g Mancozeb 75WP per litre water, spray 200L per acre, repeat after 7 days",
  "actWithinHours": number,
  "preventionTips": ["3-5 actionable prevention strings"],
  "alternativeDiagnoses": [{"diseaseName": "string", "confidence": 0.0-1.0}]
}`;

export class GeminiVisionProvider implements VisionProvider {
  constructor(private readonly apiKey: string) {}

  async analyzeCropImage({ imageBuffer, mimeType, cropName }: AnalyzeCropImageInput): Promise<DiseaseDetectionResultDTO> {
    const base64 = imageBuffer.toString("base64");
    const imageMime = (mimeType ?? "image/jpeg") as "image/jpeg" | "image/png" | "image/webp";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${this.apiKey}`;

    const promptText = cropName
      ? `${PROMPT_PREFIX}\n\nThe crop in the image is: ${cropName}.`
      : PROMPT_PREFIX;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: promptText },
              { inlineData: { mimeType: imageMime, data: base64 } },
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
      throw new Error(`Gemini vision request failed: ${res.status} ${await res.text()}`);
    }

    const json = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Gemini vision returned no content");

    return JSON.parse(text) as DiseaseDetectionResultDTO;
  }
}
