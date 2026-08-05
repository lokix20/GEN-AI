import type { DiseaseDetectionResultDTO } from "@haritha/shared-types";
import type { AnalyzeCropImageInput, VisionProvider } from "./vision-provider.interface.js";

const MODEL = "gemini-1.5-flash";

const PROMPT = `You are an expert plant pathologist for Indian agriculture. Examine the crop photo and respond with ONLY a JSON object
matching this shape, no prose outside the JSON: { "diseaseName": string, "confidence": number (0-1), "affectedArea": string,
"cause": string, "organicSolution": string, "chemicalSolution": string, "preventionTips": string[] (3-5 items) }.
If the crop looks healthy, set diseaseName to "Healthy" and explain why in "cause".`;

export class GeminiVisionProvider implements VisionProvider {
  constructor(private readonly apiKey: string) {}

  async analyzeCropImage({ imageBuffer, cropName }: AnalyzeCropImageInput): Promise<DiseaseDetectionResultDTO> {
    const base64 = imageBuffer.toString("base64");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${this.apiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: `${PROMPT}${cropName ? ` The crop is: ${cropName}.` : ""}` },
              { inlineData: { mimeType: "image/jpeg", data: base64 } },
            ],
          },
        ],
        generationConfig: { responseMimeType: "application/json" },
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
