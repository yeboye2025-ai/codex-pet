import { describe, expect, it } from "vitest";

describe("ark result coercion", () => {
  it("keeps the app stable when signals come back as plain strings", async () => {
    const module = await import("@/lib/ark/client");
    const source = `{
      "emotionLabel": "Curious & Calm",
      "emotionSummary": "The dog looks attentive.",
      "signals": ["forward gaze", "lowered posture"],
      "scientificInterpretation": "Attentive, not stressed.",
      "innerMonologue": "I'm waiting quietly.",
      "disclaimer": "Visible cues only."
    }`;

    const value = (module as unknown as {
      __test?: { coerceArkAnalysisResult?: (value: unknown) => unknown };
    }).__test?.coerceArkAnalysisResult?.(JSON.parse(source)) as
      | {
          signals: Array<{ name: string; observation: string; meaning: string }>;
        }
      | undefined;

    expect(value?.signals[0]).toEqual({
      name: "Signal 1",
      observation: "forward gaze",
      meaning: "forward gaze"
    });
  });
});
