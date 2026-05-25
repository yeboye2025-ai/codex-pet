import type { AnalysisRecord } from "@/lib/types/analysis";

type ResultHeaderProps = {
  record: AnalysisRecord;
};

export function ResultHeader({ record }: ResultHeaderProps) {
  return (
    <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
      <img
        src={record.imageDataUrl}
        alt={`${record.emotionLabel} dog result`}
        className="w-full rounded-[32px] object-cover shadow-[0_24px_60px_rgba(120,92,52,0.15)]"
      />
      <div className="space-y-6 rounded-[32px] border border-white/70 bg-white/60 p-6 backdrop-blur-xl">
        <span className="inline-flex rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-900">
          {record.emotionLabel}
        </span>
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-stone-900">
            {record.emotionSummary}
          </h1>
          <p className="text-base leading-7 text-stone-600">
            {record.confidenceNote}
          </p>
        </div>
      </div>
    </section>
  );
}
