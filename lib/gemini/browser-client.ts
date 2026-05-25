"use client";

import { ANALYSIS_PROMPT } from "@/lib/utils/analysis-prompt";
import { analysisResultSchema } from "@/lib/validation/analysis-result";

type GeminiAnalyzeParams = {
  imageDataUrl: string;
  apiKey: string;
  model: string;
};

function normalizeGeminiModel(model: string) {
  return model.trim().replace(/^models\//, "") || "gemini-2.5-flash";
}

function extractJson(text: string) {
  const trimmed = text.trim();

  if (trimmed.startsWith("```")) {
    return trimmed
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/, "")
      .trim();
  }

  return trimmed;
}

function splitDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);

  if (!match) {
    throw new Error("Invalid image data.");
  }

  return {
    mimeType: match[1],
    data: match[2]
  };
}

function normalizeGeminiError(message: string) {
  if (message.includes("Quota exceeded")) {
    return "Gemini is reachable, but this API key currently has no usable quota or billing for image analysis.";
  }

  if (message.includes("Failed to fetch") || message.includes("NetworkError")) {
    return "Your browser could not reach Gemini from the current network.";
  }

  if (message.includes("API key not valid")) {
    return "This Gemini API key looks invalid.";
  }

  return message;
}

export async function analyzeDogPhotoWithGeminiBrowser({
  imageDataUrl,
  apiKey,
  model
}: GeminiAnalyzeParams) {
  const { mimeType, data } = splitDataUrl(imageDataUrl);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${normalizeGeminiModel(
      model
    )}:generateContent?key=${encodeURIComponent(apiKey.trim())}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${ANALYSIS_PROMPT}\nReturn valid JSON only.`
              },
              {
                inline_data: {
                  mime_type: mimeType,
                  data
                }
              }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    }
  ).catch((error: Error) => {
    throw new Error(normalizeGeminiError(error.message));
  });

  const payload = (await response.json().catch(() => null)) as
    | {
        error?: { message?: string };
        candidates?: Array<{
          content?: {
            parts?: Array<{ text?: string }>;
          };
        }>;
      }
    | null;

  if (!response.ok) {
    throw new Error(
      normalizeGeminiError(payload?.error?.message || "Gemini request failed.")
    );
  }

  const raw = payload?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!raw) {
    throw new Error("Gemini returned an empty analysis.");
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

export async function testGeminiBrowserConnection({
  apiKey,
  model
}: Pick<GeminiAnalyzeParams, "apiKey" | "model">) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${normalizeGeminiModel(
      model
    )}:generateContent?key=${encodeURIComponent(apiKey.trim())}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: "Reply with exactly ok" }]
          }
        ]
      })
    }
  ).catch((error: Error) => {
    throw new Error(normalizeGeminiError(error.message));
  });

  const payload = (await response.json().catch(() => null)) as
    | {
        error?: { message?: string };
        candidates?: Array<{
          content?: {
            parts?: Array<{ text?: string }>;
          };
        }>;
      }
    | null;

  if (!response.ok) {
    throw new Error(
      normalizeGeminiError(payload?.error?.message || "Gemini request failed.")
    );
  }

  return payload?.candidates?.[0]?.content?.parts?.[0]?.text || "ok";
}
