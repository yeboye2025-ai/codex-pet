import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("README", () => {
  it("documents setup and the analyze route environment variable", () => {
    const readme = fs.readFileSync("README.md", "utf8");

    expect(readme).toContain("OPENAI_API_KEY");
    expect(readme).toContain("npm run dev");
  });
});
