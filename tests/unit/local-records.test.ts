import { beforeEach, describe, expect, it } from "vitest";
import { createLocalRecordsStore } from "@/lib/storage/local-records";

const sampleRecord = {
  id: "rec_1",
  imageDataUrl: "data:image/jpeg;base64,ZmFrZQ==",
  createdAt: "2026-05-20T10:00:00.000Z",
  emotionLabel: "Relaxed",
  emotionSummary: "Calm and settled",
  confidenceNote: "Visible cues only",
  signals: [{ name: "Tail", observation: "Neutral", meaning: "Comfort" }],
  scientificInterpretation: "Loose body posture.",
  innerMonologue: "I am happy here.",
  disclaimer: "AI-assisted only.",
  isFavorited: false
};

describe("createLocalRecordsStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("saves, lists, and toggles favorites", () => {
    const store = createLocalRecordsStore(window.localStorage);

    store.save(sampleRecord);
    store.toggleFavorite("rec_1");

    expect(store.list()[0]?.isFavorited).toBe(true);
  });

  it("returns a saved record by id", () => {
    const store = createLocalRecordsStore(window.localStorage);

    store.save(sampleRecord);

    expect(store.getById("rec_1")?.emotionLabel).toBe("Relaxed");
  });
});
