"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/shared/app-shell";
import { FavoritesGrid } from "@/components/favorites/favorites-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { createLocalRecordsStore } from "@/lib/storage/local-records";
import type { AnalysisRecord } from "@/lib/types/analysis";

export default function FavoritesPage() {
  const [records, setRecords] = useState<AnalysisRecord[]>([]);

  useEffect(() => {
    const nextRecords = createLocalRecordsStore(window.localStorage)
      .list()
      .filter((record) => record.isFavorited);
    setRecords(nextRecords);
  }, []);

  return (
    <AppShell>
      <section className="space-y-8">
        <SectionHeading
          eyebrow="Favorites"
          title="Your softest dog moments"
          description="Keep the most shareable or meaningful reads close at hand."
        />
        <FavoritesGrid records={records} />
      </section>
    </AppShell>
  );
}
