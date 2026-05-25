import type { ChangeEvent } from "react";
import { FloatingCard } from "@/components/shared/floating-card";

type HeroProps = {
  onPhotoReady?: (imageDataUrl: string) => void;
};

export function Hero({ onPhotoReady }: HeroProps) {
  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || !onPhotoReady) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onPhotoReady(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <section className="grid gap-10 lg:grid-cols-[1fr_0.92fr] lg:items-center">
      <div className="space-y-5">
        <p className="text-xs uppercase tracking-[0.34em] text-stone-500">
          Gentle AI insight
        </p>
        <h1 className="max-w-xl text-5xl font-semibold tracking-[-0.04em] text-stone-900 md:text-6xl">
          Read the feelings behind the floppy ears.
        </h1>
        <p className="max-w-md text-base leading-8 text-stone-600 md:text-lg">
          One photo in. A softer, more readable understanding of what your dog
          may be feeling.
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <label
            aria-label="Upload a dog photo"
            role="button"
            tabIndex={0}
            className="cursor-pointer rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5"
          >
            <span>Upload a dog photo</span>
            <input
              aria-label="Upload dog photo"
              className="sr-only"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
            />
          </label>
          <p className="text-sm text-stone-500">
            Warm, science-grounded, and easy to keep.
          </p>
        </div>
      </div>
      <FloatingCard className="p-6 md:p-7">
        <div className="space-y-5">
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
          <div className="space-y-3 text-sm leading-7 text-stone-600">
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
