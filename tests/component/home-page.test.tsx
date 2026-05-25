import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import HomePage from "@/app/page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}));

describe("HomePage", () => {
  it("shows the core value proposition and upload CTA", () => {
    render(<HomePage />);

    expect(
      screen.getByText(
        /understand the quiet emotions your dog never learned to say/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /upload a dog photo/i })
    ).toBeInTheDocument();
  });
});
