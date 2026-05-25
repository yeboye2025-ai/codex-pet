import type { ShareCardPayload } from "@/lib/types/share-card";

type ShareCardPreviewProps = {
  payload: ShareCardPayload;
};

export function ShareCardPreview({ payload }: ShareCardPreviewProps) {
  return (
    <div className="rounded-[32px] border border-white/70 bg-white/60 p-6 backdrop-blur-xl">
      <p className="text-sm uppercase tracking-[0.28em] text-stone-500">
        Pet Whisper
      </p>
      <h2 className="mt-4 text-3xl font-semibold text-stone-900">
        {payload.emotionLabel}
      </h2>
      <p className="mt-4 text-xl text-stone-800">{payload.title}</p>
      <p className="mt-3 text-sm leading-7 text-stone-600">{payload.subtitle}</p>
    </div>
  );
}
