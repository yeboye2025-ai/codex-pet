"use client";

import Link from "next/link";
import type { AnalysisRecord } from "@/lib/types/analysis";
import { EmptyState } from "@/components/shared/empty-state";

type HistoryTimelineProps = {
  records?: AnalysisRecord[];
};

function formatHistoryDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Saved recently";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

export function HistoryTimeline({ records = [] }: HistoryTimelineProps) {
  if (records.length === 0) {
    return (
      <EmptyState
        title="No analysis history yet"
        description="Once you read your first dog moment, it will show up here like a gentle diary."
      />
    );
  }

  return (
    <div className="space-y-6">
      {records.map((record) => (
        <article key={record.id} className="flex gap-4">
          <div className="mt-2 h-3 w-3 rounded-full bg-amber-300" />
          <Link
            href={`/result/${record.id}`}
            className="flex-1 rounded-[28px] border border-white/70 bg-white/60 p-5 backdrop-blur-lg transition hover:-translate-y-0.5 hover:bg-white/72"
          >
            <p className="text-sm text-stone-500">
              {formatHistoryDate(record.createdAt)}
            </p>
            <div className="mt-3 flex items-start gap-4">
              <img
                src={record.imageDataUrl}
                alt={`${record.emotionLabel || "Saved"} history`}
                className="h-20 w-20 rounded-[18px] object-cover"
              />
              <div className="space-y-2">
                <h2 className="text-lg font-medium text-stone-900">
                  {record.emotionLabel || "Saved read"}
                </h2>
                <p className="text-sm leading-7 text-stone-600">
                  {record.emotionSummary || "A gentle reading is saved here."}
                </p>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
