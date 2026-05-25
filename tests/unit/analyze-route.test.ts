import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/openai/client", () => ({
  analyzeDogPhoto: vi.fn().mockResolvedValue({
    emotionLabel: "Curious",
    emotionSummary: "Your dog seems gently alert and interested.",
    confidenceNote: "Based on visible posture and gaze cues.",
    signals: [
      {
        name: "Eyes",
        observation: "Focused forward",
        meaning: "Attention"
      }
    ],
    scientificInterpretation: "The dog appears attentive without obvious tension.",
    innerMonologue: "What is that over there?",
    disclaimer:
      "This is an AI-assisted interpretation based on visible behavior cues in the photo."
  })
}));

import { POST } from "@/app/api/analyze/route";

describe("POST /api/analyze", () => {
  it("returns a structured analysis record", async () => {
    const request = new Request("http://localhost:3000/api/analyze", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        imageDataUrl: "data:image/jpeg;base64,ZmFrZQ==",
        apiUrl: "https://example.com/v1",
        apiKey: "test-key",
        model: "gpt-4.1-mini"
      })
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.emotionLabel).toBe("Curious");
    expect(body.id).toBeDefined();
  });
});
