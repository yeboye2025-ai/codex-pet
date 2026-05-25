import type { AnalysisSignal } from "@/lib/types/analysis";

type SignalsListProps = {
  signals: AnalysisSignal[];
};

export function SignalsList({ signals }: SignalsListProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold text-stone-900">Behavior signals</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {signals.map((signal) => (
          <article
            key={`${signal.name}-${signal.observation}`}
            className="rounded-[28px] border border-white/70 bg-white/55 p-5 backdrop-blur-lg"
          >
            <h3 className="text-lg font-medium text-stone-900">{signal.name}</h3>
            <p className="mt-2 text-sm text-stone-600">{signal.observation}</p>
            <p className="mt-3 text-sm leading-7 text-stone-700">{signal.meaning}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
