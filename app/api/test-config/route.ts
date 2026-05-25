import OpenAI from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { normalizeOpenAICompatibleError } from "@/lib/openai/error-messages";

const schema = z.object({
  apiUrl: z.string().url(),
  apiKey: z.string().min(1),
  model: z.string().min(1)
});

function normalizeApiUrl(apiUrl: string) {
  const trimmed = apiUrl.trim().replace(/\/+$/, "");

  if (trimmed.endsWith("/chat/completions")) {
    return trimmed.replace(/\/chat\/completions$/, "");
  }

  return trimmed;
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = schema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid API config." },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey: parsed.data.apiKey,
      baseURL: normalizeApiUrl(parsed.data.apiUrl)
    });

    const completion = await client.chat.completions.create({
      model: parsed.data.model,
      messages: [{ role: "user", content: "Reply with exactly: ok" }]
    });

    const content = completion.choices[0]?.message?.content;

    try {
      await client.chat.completions.create({
        model: parsed.data.model,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Describe this image in one word."
              },
              {
                type: "image_url",
                image_url: {
                  url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7Z0X8AAAAASUVORK5CYII="
                }
              }
            ]
          }
        ]
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? normalizeOpenAICompatibleError(error.message)
          : "The API cannot process image inputs right now.";

      return NextResponse.json(
        {
          ok: false,
          message: `Text connection works, but image analysis is unavailable: ${message}`
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: content || "Text and image analysis both look available."
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? normalizeOpenAICompatibleError(error.message)
        : "Unable to reach the API.";

    return NextResponse.json(
      {
        ok: false,
        message
      },
      { status: 502 }
    );
  }
}
