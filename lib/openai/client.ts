import OpenAI from "openai";
import { ANALYSIS_PROMPT } from "@/lib/utils/analysis-prompt";
import { analysisResultSchema } from "@/lib/validation/analysis-result";

type AnalyzeDogPhotoParams = {
  imageDataUrl: string;
  apiUrl: string;
  apiKey: string;
  model: string;
};

function normalizeApiUrl(apiUrl: string) {
  const trimmed = apiUrl.trim().replace(/\/+$/, "");

  if (trimmed.endsWith("/chat/completions")) {
    return trimmed.replace(/\/chat\/completions$/, "");
  }

  return trimmed;
}

function extractJson(text: string) {
  const trimmed = text.trim();

  if (trimmed.startsWith("```")) {
    const withoutFence = trimmed
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "");
    return withoutFence.trim();
  }

  return trimmed;
}

export async function analyzeDogPhoto({
  imageDataUrl,
  apiUrl,
  apiKey,
  model
}: AnalyzeDogPhotoParams) {
  const client = new OpenAI({
    apiKey,
    baseURL: normalizeApiUrl(apiUrl)
  });

  const completion = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `${ANALYSIS_PROMPT}\nReturn valid JSON only.`
          },
          {
            type: "image_url",
            image_url: {
              url: imageDataUrl
            }
          }
        ]
      }
    ]
  });

  const raw = completion.choices[0]?.message?.content;

  if (!raw) {
    throw new Error("Empty analysis response");
  }

  const parsed = JSON.parse(extractJson(raw));

  return analysisResultSchema
    .omit({
      id: true,
      imageDataUrl: true,
      createdAt: true,
      isFavorited: true
    })
    .parse(parsed);
}
