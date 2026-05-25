import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { Dropzone } from "@/components/upload/dropzone";

describe("Dropzone", () => {
  it("shows validation feedback for non-image files", async () => {
    render(<Dropzone onSelect={vi.fn()} />);

    const input = screen.getByLabelText(/upload dog photo/i);
    fireEvent.change(input, {
      target: {
        files: [new File(["hello"], "note.txt", { type: "text/plain" })]
      }
    });

    expect(await screen.findByText(/try a clear dog photo/i)).toBeInTheDocument();
  });
});
