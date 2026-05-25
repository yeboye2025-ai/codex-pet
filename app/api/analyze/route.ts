import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { normalizeOpenAICompatibleError } from "@/lib/openai/error-messages";
import { analyzeDogPhoto } from "@/lib/openai/client";
import { analyzeRequestSchema } from "@/lib/validation/analyze-request";
import { analysisResultSchema } from "@/lib/validation/analysis-result";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = analyzeRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid analyze request." },
        { status: 400 }
      );
    }

    const result = await analyzeDogPhoto({
      imageDataUrl: parsed.data.imageDataUrl,
      apiUrl: parsed.data.apiUrl,
      apiKey: parsed.data.apiKey,
      model: parsed.data.model
    });

    const record = analysisResultSchema.parse({
      id: randomUUID(),
      imageDataUrl: parsed.data.imageDataUrl,
      createdAt: new Date().toISOString(),
      isFavorited: false,
      ...result
    });

    return NextResponse.json(record);
  } catch (error) {
    const message =
      error instanceof Error
        ? normalizeOpenAICompatibleError(error.message)
        : "Analysis is unavailable right now.";

    return NextResponse.json(
      {
        message
      },
      { status: 502 }
    );
  }
}
