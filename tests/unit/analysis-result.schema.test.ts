import { describe, expect, it } from "vitest";
import { analysisResultSchema } from "@/lib/validation/analysis-result";

describe("analysisResultSchema", () => {
  it("accepts a fully structured analysis result", () => {
    const result = analysisResultSchema.safeParse({
      id: "rec_1",
      imageDataUrl: "data:image/jpeg;base64,ZmFrZQ==",
      createdAt: "2026-05-20T10:00:00.000Z",
      emotionLabel: "Relaxed",
      emotionSummary: "Your dog looks calm and comfortably attentive.",
      confidenceNote: "Based on visible posture and facial cues in this single photo.",
      signals: [
        {
          name: "Ears",
          observation: "Soft and slightly angled outward",
          meaning: "Often seen when a dog feels safe and engaged."
        }
      ],
      scientificInterpretation:
        "The body appears loose with no obvious signs of defensive tension.",
      innerMonologue: "I am feeling pretty comfortable right now.",
      disclaimer:
        "This is an AI-assisted interpretation based on visible behavior cues in the photo.",
      isFavorited: false
    });

    expect(result.success).toBe(true);
  });
});
