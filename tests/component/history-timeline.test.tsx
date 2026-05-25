import { render, screen } from "@testing-library/react";
import { HistoryTimeline } from "@/components/history/history-timeline";

describe("HistoryTimeline", () => {
  it("renders a timeline row with the emotion summary", () => {
    render(
      <HistoryTimeline
        records={[
          {
            id: "rec_1",
            imageDataUrl: "data:image/jpeg;base64,ZmFrZQ==",
            createdAt: "2026-05-20T10:00:00.000Z",
            emotionLabel: "Calm",
            emotionSummary: "Settled and safe",
            confidenceNote: "Visible cues only",
            signals: [],
            scientificInterpretation: "Loose posture.",
            innerMonologue: "I feel cozy.",
            disclaimer: "AI-assisted only.",
            isFavorited: true
          }
        ]}
      />
    );

    expect(screen.getByText(/settled and safe/i)).toBeInTheDocument();
  });
});
