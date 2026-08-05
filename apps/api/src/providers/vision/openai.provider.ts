import type { DiseaseDetectionResultDTO } from "@haritha/shared-types";
import type { AnalyzeCropImageInput, VisionProvider } from "./vision-provider.interface.js";
import { MockVisionProvider } from "./mock.provider.js";
import { logger } from "../../lib/logger.js";

const MODEL = "gpt-4o";

const SYSTEM_PROMPT = `You are a senior plant pathologist and agronomist specializing in Indian smallholder farming. Your task is to analyze a crop photograph and provide an accurate, actionable disease diagnosis.

Rules:
1. Examine the image carefully — look at leaf color, spots, lesions, texture, wilting, discoloration patterns, and any visible pathogen structures.
2. Identify the primary disease or condition with high accuracy.
3. If the crop appears healthy, set diseaseName to "Healthy" and severity to "healthy".
4. Provide treatment advice specific to Indian agriculture — use chemicals and inputs available at Krishi Kendras (KVKs) and local agro-input shops.
5. Dosage instructions must be practical and in field-applicable units (per litre of water, per acre).
6. actWithinHours: realistic urgency window — healthy=720, low=168, moderate=72, high=48, critical=24.
7. alternativeDiagnoses: 2-3 other plausible conditions with their likelihood confidence (sum should be < 1 - primary confidence).

Respond ONLY with a valid JSON object — no markdown, no prose outside the JSON.`;

const JSON_SCHEMA = `{
  "diseaseName": "string — precise scientific/common name",
  "confidence": "number 0-1",
  "severity": "one of: healthy | low | moderate | high | critical",
  "affectedArea": "string — e.g. '20-30% of leaf area showing necrotic lesions'",
  "cause": "string — pathogen name, type (fungal/bacterial/viral/pest), and key trigger conditions",
  "organicSolution": "string — specific organic/bio-input treatment with application method",
  "chemicalSolution": "string — specific chemical name (generic + brand), formulation, and concentration",
  "dosageInstructions": "string — e.g. 'Mix 2g Mancozeb 75WP per litre water, spray 200L per acre, repeat after 7 days'",
  "actWithinHours": "number — hours within which farmer should act",
  "preventionTips": ["3-5 actionable prevention strings"],
  "alternativeDiagnoses": [{"diseaseName": "string", "confidence": "number 0-1"}]
}`;

export class OpenAIVisionProvider implements VisionProvider {
  private mockProvider = new MockVisionProvider();

  constructor(private readonly apiKey: string) {}

  async analyzeCropImage(input: AnalyzeCropImageInput): Promise<DiseaseDetectionResultDTO> {
    try {
      const { imageBuffer, mimeType, cropName } = input;
      const base64 = imageBuffer.toString("base64");
      const dataUrl = `data:${mimeType ?? "image/jpeg"};base64,${base64}`;

      const userText = `Analyze this crop image and return a JSON object matching exactly this schema:\n${JSON_SCHEMA}${cropName ? `\n\nThe crop in the image is: ${cropName}.` : ""}`;

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: [
                { type: "text", text: userText },
                { type: "image_url", image_url: { url: dataUrl, detail: "high" } },
              ],
            },
          ],
          max_tokens: 1024,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        logger.warn(`OpenAI vision request failed (${res.status}): ${errorText}. Falling back to MockVisionProvider.`);
        return this.mockProvider.analyzeCropImage(input);
      }

      const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      const content = json.choices?.[0]?.message?.content;
      if (!content) throw new Error("OpenAI vision returned no content");

      return JSON.parse(content) as DiseaseDetectionResultDTO;
    } catch (err: any) {
      logger.warn(`OpenAI Vision error (${err?.message || err}). Falling back to MockVisionProvider.`);
      return this.mockProvider.analyzeCropImage(input);
    }
  }
}
