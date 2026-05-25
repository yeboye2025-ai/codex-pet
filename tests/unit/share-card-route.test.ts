import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/share-card/[id]/route";

describe("GET /api/share-card/[id]", () => {
  it("returns an image response", async () => {
    const response = await GET(
      new Request("http://localhost:3000/api/share-card/rec_1"),
      {
        params: Promise.resolve({ id: "rec_1" })
      }
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("image/");
  });
});
