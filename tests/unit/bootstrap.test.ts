import { describe, expect, it } from "vitest";

describe("bootstrap", () => {
  it("exposes a test environment", () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });
});
