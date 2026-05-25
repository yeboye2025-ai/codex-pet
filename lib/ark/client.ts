import { ANALYSIS_PROMPT } from "@/lib/utils/analysis-prompt";
import { analysisResultSchema } from "@/lib/validation/analysis-result";

type AnalyzeDogPhotoWithArkParams = {
  imageDataUrl: string;
  apiUrl: string;
  apiKey: string;
  model: string;
};

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

function normalizeArkUrl(apiUrl: string) {
  const trimmed = apiUrl.trim().replace(/\/+$/, "");
  return trimmed.endsWith("/responses") ? trimmed : `${trimmed}/responses`;
}

function parseArkOutputText(payload: {
  output?: Array<{
    type?: string;
    role?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
}) {
  const message = payload.output?.find((item) => item.type === "message");
  const text = message?.content?.find((item) => item.type === "output_text")?.text;
  return text || null;
}

function toSentenceCaseLabel(value: string, fallback: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return fallback;
  }

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function coerceSignals(value: unknown) {
  if (!Array.isArray(value) || value.length === 0) {
    return [
      {
        name: "Visible cues",
        observation: "Facial expression and posture were used as the main clues.",
        meaning: "The reading is based on what is visible in this single photo."
      }
    ];
  }

  return value.map((item, index) => {
    if (typeof item === "string") {
      return {
        name: `Signal ${index + 1}`,
        observation: item,
        meaning: item
      };
    }

    if (item && typeof item === "object") {
      const signal = item as Record<string, unknown>;
      return {
        name: toSentenceCaseLabel(
          String(signal.name ?? signal.label ?? signal.title ?? `Signal ${index + 1}`),
          `Signal ${index + 1}`
        ),
        observation: String(
          signal.observation ??
            signal.description ??
            signal.detail ??
            signal.value ??
            "Visible signal detected."
        ),
        meaning: String(
          signal.meaning ??
            signal.interpretation ??
            signal.reason ??
            signal.description ??
            "This contributes to the emotional read."
        )
      };
    }

    return {
      name: `Signal ${index + 1}`,
      observation: "Visible signal detected.",
      meaning: "This contributes to the emotional read."
    };
  });
}

function coerceArkAnalysisResult(value: unknown) {
  const parsed = value as Record<string, unknown>;

  return {
    emotionLabel: String(parsed.emotionLabel ?? parsed.emotion ?? "Gentle read"),
    emotionSummary: String(
      parsed.emotionSummary ??
        parsed.summary ??
        parsed.interpretation ??
        "A soft emotional read was generated from this image."
    ),
    confidenceNote: String(
      parsed.confidenceNote ??
        parsed.confidence ??
        "Based on visible posture, gaze, and facial cues."
    ),
    signals: coerceSignals(parsed.signals),
    scientificInterpretation: String(
      parsed.scientificInterpretation ??
        parsed.interpretation ??
        "This reading is based on visible behavioral cues in the current frame."
    ),
    innerMonologue: String(
      parsed.innerMonologue ??
        parsed.innerThought ??
        parsed.thought ??
        "I’m staying close and taking this moment in."
    ),
    disclaimer: String(
      parsed.disclaimer ??
        "This is a gentle AI-assisted interpretation based on visible behavior cues in one photo."
    )
  };
}

export async function analyzeDogPhotoWithArk({
  imageDataUrl,
  apiUrl,
  apiKey,
  model
}: AnalyzeDogPhotoWithArkParams) {
  const response = await fetch(normalizeArkUrl(apiUrl), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey.trim()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: model.trim(),
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_image",
              image_url: imageDataUrl
            },
            {
              type: "input_text",
              text: `${ANALYSIS_PROMPT}\nReturn valid JSON only.`
            }
          ]
        }
      ]
    })
  });

  const payload = (await response.json().catch(() => null)) as
    | {
        error?: { message?: string };
        output?: Array<{
          type?: string;
          role?: string;
          content?: Array<{ type?: string; text?: string }>;
        }>;
      }
    | null;

  if (!response.ok) {
    throw new Error(payload?.error?.message || "Ark image analysis failed.");
  }

  const raw = parseArkOutputText(payload || {});

  if (!raw) {
    throw new Error("Ark returned an empty analysis.");
  }

  const parsed = coerceArkAnalysisResult(JSON.parse(extractJson(raw)));

  return analysisResultSchema
    .omit({
      id: true,
      imageDataUrl: true,
      createdAt: true,
      isFavorited: true
    })
    .parse(parsed);
}

export async function testArkConnection({
  apiUrl,
  apiKey,
  model
}: Omit<AnalyzeDogPhotoWithArkParams, "imageDataUrl">) {
  const response = await fetch(normalizeArkUrl(apiUrl), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey.trim()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: model.trim(),
      input: [
        {
          role: "user",
          content: [{ type: "input_text", text: "请回复：ok" }]
        }
      ]
    })
  });

  const payload = (await response.json().catch(() => null)) as
    | {
        error?: { message?: string };
        output?: Array<{
          type?: string;
          role?: string;
          content?: Array<{ type?: string; text?: string }>;
        }>;
      }
    | null;

  if (!response.ok) {
    throw new Error(payload?.error?.message || "Ark connection failed.");
  }

  return parseArkOutputText(payload || {}) || "Connected.";
}

export const __test = {
  coerceArkAnalysisResult
};
