import { ImageResponse } from "next/og";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #fff9f2, #f0eadf)",
          padding: 48
        }}
      >
        <div style={{ fontSize: 24, color: "#6b5b48" }}>Pet Whisper</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 56, color: "#2f2419" }}>Shared dog moment</div>
          <div style={{ fontSize: 30, color: "#6f6254" }}>Analysis {id}</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 1600
    }
  );
}
