import { render, screen } from "@testing-library/react";
import { FavoritesGrid } from "@/components/favorites/favorites-grid";

describe("FavoritesGrid", () => {
  it("renders a saved favorite card", () => {
    render(
      <FavoritesGrid
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

    expect(screen.getByText(/i feel cozy/i)).toBeInTheDocument();
  });
});
