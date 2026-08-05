import type { DiseaseDetectionResultDTO } from "@haritha/shared-types";
import type { AnalyzeCropImageInput, VisionProvider } from "./vision-provider.interface.js";

const MODEL = "gpt-4o-mini";

const PROMPT = `You are an expert plant pathologist for Indian agriculture. Examine the crop photo and respond with ONLY a JSON object
matching this shape, no prose outside the JSON: { "diseaseName": string, "confidence": number (0-1), "affectedArea": string,
"cause": string, "organicSolution": string, "chemicalSolution": string, "preventionTips": string[] (3-5 items) }.
If the crop looks healthy, set diseaseName to "Healthy" and explain why in "cause".`;

export class OpenAIVisionProvider implements VisionProvider {
  constructor(private readonly apiKey: string) {}

  async analyzeCropImage({ imageBuffer, cropName }: AnalyzeCropImageInput): Promise<DiseaseDetectionResultDTO> {
    const base64 = imageBuffer.toString("base64");
    const dataUrl = `data:image/jpeg;base64,${base64}`;

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
          {
            role: "user",
            content: [
              { type: "text", text: `${PROMPT}${cropName ? ` The crop is: ${cropName}.` : ""}` },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI vision request failed: ${res.status} ${await res.text()}`);
    }

    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = json.choices?.[0]?.message?.content;
    if (!content) throw new Error("OpenAI vision returned no content");

    return JSON.parse(content) as DiseaseDetectionResultDTO;
  }
}
