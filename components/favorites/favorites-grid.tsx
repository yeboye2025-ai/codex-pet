"use client";

import type { AnalysisRecord } from "@/lib/types/analysis";
import { EmptyState } from "@/components/shared/empty-state";

type FavoritesGridProps = {
  records?: AnalysisRecord[];
};

export function FavoritesGrid({ records = [] }: FavoritesGridProps) {
  if (records.length === 0) {
    return (
      <EmptyState
        title="No favorites yet"
        description="Save a result and it will float here for easy revisiting."
      />
    );
  }

  return (
    <div className="columns-1 gap-5 md:columns-2 xl:columns-3">
      {records.map((record) => (
        <article
          key={record.id}
          className="mb-5 break-inside-avoid rounded-[28px] border border-white/70 bg-white/60 p-4 backdrop-blur-lg"
        >
          <img
            src={record.imageDataUrl}
            alt={`${record.emotionLabel} favorite`}
            className="w-full rounded-[22px] object-cover"
          />
          <div className="mt-4 space-y-3">
            <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-900">
              {record.emotionLabel}
            </span>
            <p className="text-base leading-7 text-stone-700">
              {record.innerMonologue}
            </p>
            <p className="text-sm text-stone-500">{record.createdAt}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
