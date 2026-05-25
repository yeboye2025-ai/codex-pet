import { render, screen } from "@testing-library/react";
import { EmptyState } from "@/components/shared/empty-state";

describe("EmptyState", () => {
  it("renders warm guidance copy", () => {
    render(
      <EmptyState
        title="No favorites yet"
        description="Save a result and it will float here for easy revisiting."
      />
    );

    expect(screen.getByText(/save a result/i)).toBeInTheDocument();
  });
});
