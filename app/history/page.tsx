"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/shared/app-shell";
import { HistoryTimeline } from "@/components/history/history-timeline";
import { SectionHeading } from "@/components/shared/section-heading";
import { createLocalRecordsStore } from "@/lib/storage/local-records";
import type { AnalysisRecord } from "@/lib/types/analysis";

export default function HistoryPage() {
  const [records, setRecords] = useState<AnalysisRecord[]>([]);

  useEffect(() => {
    setRecords(createLocalRecordsStore(window.localStorage).list());
  }, []);

  return (
    <AppShell>
      <section className="space-y-8">
        <SectionHeading
          eyebrow="History"
          title="A timeline of what your dog has been telling you"
          description="Every analysis is saved locally so you can revisit a little emotional diary over time."
        />
        <HistoryTimeline records={records} />
      </section>
    </AppShell>
  );
}
