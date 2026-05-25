import { FloatingCard } from "@/components/shared/floating-card";
import { SectionHeading } from "@/components/shared/section-heading";

export function SampleResultPreview() {
  return (
    <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
      <SectionHeading
        eyebrow="Preview"
        title="See the shape of the insight before you upload"
        description="Each result balances emotional readability with structured reasoning, so it feels warm without drifting into pure fiction."
      />
      <FloatingCard className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-800">
              Relaxed
            </span>
            <span className="text-sm text-stone-500">Confidence: gentle</span>
          </div>
          <p className="text-2xl font-medium leading-9 text-stone-900">
            Your dog looks calm, socially open, and comfortably tuned in to the
            moment.
          </p>
          <div className="space-y-4 text-sm leading-7 text-stone-600">
            <p>
              <span className="font-medium text-stone-900">Signal read:</span>{" "}
              Soft ears, loose posture, and an unstrained mouth often point to a
              settled state.
            </p>
            <p>
              <span className="font-medium text-stone-900">Inner monologue:</span>{" "}
              “Everything feels easy right now. I am happy just being here with
              you.”
            </p>
          </div>
        </div>
      </FloatingCard>
    </section>
  );
}
