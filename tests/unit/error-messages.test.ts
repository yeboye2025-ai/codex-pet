import { describe, expect, it } from "vitest";
import { normalizeOpenAICompatibleError } from "@/lib/openai/error-messages";

describe("normalizeOpenAICompatibleError", () => {
  it("translates unsupported image payload errors into a clearer message", () => {
    const message =
      "400 Failed to deserialize the JSON body into the target type: messages[0]: unknown variant `image_url`, expected `text`";

    expect(normalizeOpenAICompatibleError(message)).toContain(
      "does not support the image input format"
    );
  });

  it("translates unloaded model errors into a clearer message", () => {
    const message =
      "No models loaded. Please load a model in the developer page or use the 'lms load' command.";

    expect(normalizeOpenAICompatibleError(message)).toContain(
      "has no model loaded yet"
    );
  });
});
