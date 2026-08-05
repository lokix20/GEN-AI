import type { DiseaseDetectionResultDTO } from "@haritha/shared-types";
import type { AnalyzeCropImageInput, VisionProvider } from "./vision-provider.interface.js";
import { MockVisionProvider } from "./mock.provider.js";
import { logger } from "../../lib/logger.js";

const MODEL = "gemini-1.5-flash-latest";

const PROMPT_PREFIX = `You are a senior plant pathologist and agronomist specializing in Indian agriculture. Analyze the photograph carefully.

CRITICAL INITIAL CHECK:
First check if the photograph actually shows a plant, crop, leaf, stem, fruit, or agricultural sample.
If the photograph shows an ID card, student card, document, human face, vehicle, building, or non-plant object:
- Set diseaseName to "Invalid Image: Not a Crop/Plant"
- Set confidence to 0.0
- Set severity to "low"
- Set cause to "No crop or plant leaf detected in the photo. Please upload a clear photograph of a crop sample or plant leaf."
- Set organicSolution to "Please capture or upload a clear photo of the affected plant leaf."
- Set chemicalSolution to "N/A"
- Set dosageInstructions to "N/A"

For valid crop photos:
- Identify the primary disease/condition accurately.
- If the crop is healthy, set diseaseName to "Healthy" and severity to "healthy".
- Provide treatment specific to Indian agriculture using inputs available at Krishi Kendras (KVKs).
- Dosage in practical field units (per litre water, per acre).
- actWithinHours: healthy=720, low=168, moderate=72, high=48, critical=24.
- alternativeDiagnoses: 2-3 other plausible conditions.

Return ONLY a valid JSON object with NO markdown, NO prose. Match this schema exactly:
{
  "diseaseName": "precise scientific/common name OR 'Invalid Image: Not a Crop/Plant'",
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
  private mockProvider = new MockVisionProvider();

  constructor(private readonly apiKey: string) {}

  async analyzeCropImage(input: AnalyzeCropImageInput): Promise<DiseaseDetectionResultDTO> {
    try {
      const { imageBuffer, mimeType, cropName } = input;
      const base64 = imageBuffer.toString("base64");
      const imageMime = (mimeType ?? "image/jpeg") as "image/jpeg" | "image/png" | "image/webp";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${this.apiKey}`;

      const promptText = cropName
        ? `${PROMPT_PREFIX}\n\nThe specified crop in field is: ${cropName}.`
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
        const errText = await res.text();
        logger.warn(`Gemini vision request failed (${res.status}): ${errText}. Falling back to MockVisionProvider.`);
        return this.mockProvider.analyzeCropImage(input);
      }

      const json = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Gemini vision returned no content");

      const parsed = JSON.parse(text) as DiseaseDetectionResultDTO;
      if (parsed.diseaseName?.includes("Invalid") || parsed.confidence === 0) {
        throw new Error("Invalid Image: No crop or plant leaf detected in the photo.");
      }

      return parsed;
    } catch (err: any) {
      if (err?.message?.includes("Invalid Image")) {
        throw err;
      }
      logger.warn(`Gemini vision error (${err?.message || err}). Falling back to MockVisionProvider.`);
      return this.mockProvider.analyzeCropImage(input);
    }
  }
}
