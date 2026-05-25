import { describe, expect, it } from "vitest";
import {
  applyApiConfigDefaults,
  readApiConfig,
  saveApiConfig
} from "@/lib/storage/api-config";

describe("api config storage", () => {
  it("saves and reads user api settings from localStorage", () => {
    const storage = window.localStorage;
    storage.clear();

    saveApiConfig(storage, {
      apiUrl: "https://example.com/v1",
      apiKey: "test-key",
      model: "gpt-4.1-mini"
    });

    expect(readApiConfig(storage)).toEqual({
      apiUrl: "https://example.com/v1",
      apiKey: "test-key",
      model: "gpt-4.1-mini"
    });
  });

  it("applies Gemini defaults when a Gemini key is present", () => {
    expect(
      applyApiConfigDefaults({
        apiUrl: "",
        apiKey: "AIza-example-key",
        model: ""
      })
    ).toEqual({
      apiUrl: "https://generativelanguage.googleapis.com/v1beta/openai/",
      apiKey: "AIza-example-key",
      model: "gemini-2.0-flash"
    });
  });
});
