import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import ResultPage from "@/app/result/[id]/page";

vi.mock("next/navigation", () => ({
  notFound: vi.fn()
}));

describe("ResultPage", () => {
  it("renders the scientific interpretation and inner monologue", () => {
    window.localStorage.setItem(
      "pet-whisper.records",
      JSON.stringify([
        {
          id: "rec_demo",
          imageDataUrl: "data:image/jpeg;base64,ZmFrZQ==",
          createdAt: "2026-05-20T10:00:00.000Z",
          emotionLabel: "Curious",
          emotionSummary: "Your dog looks gently intrigued.",
          confidenceNote: "Based on visible posture and gaze cues.",
          signals: [
            {
              name: "Eyes",
              observation: "Forward focus",
              meaning: "Attention"
            }
          ],
          scientificInterpretation:
            "The posture suggests alert interest without obvious strain.",
          innerMonologue: "Something interesting is happening.",
          disclaimer:
            "This is an AI-assisted interpretation based on visible behavior cues in the photo.",
          isFavorited: false
        }
      ])
    );

    render(<ResultPage params={{ id: "rec_demo" }} />);

    expect(screen.getByText(/scientific interpretation/i)).toBeInTheDocument();
    expect(screen.getByText(/inner monologue/i)).toBeInTheDocument();
  });
});
