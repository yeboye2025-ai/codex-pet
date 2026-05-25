import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { AnalysisWorkspace } from "@/components/upload/analysis-workspace";

describe("AnalysisWorkspace", () => {
  it("shows a start analysis button when an image is selected", () => {
    render(
      <AnalysisWorkspace
        imagePreviewUrl="data:image/jpeg;base64,ZmFrZQ=="
        isAnalyzing={false}
        errorMessage={null}
        onAnalyze={vi.fn()}
        onReset={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", { name: /start analysis/i })
    ).toBeInTheDocument();
  });
});
