"use client";

import { use, useEffect, useState } from "react";
import { InnerMonologueCard } from "@/components/result/inner-monologue-card";
import { InterpretationCard } from "@/components/result/interpretation-card";
import { ResultHeader } from "@/components/result/result-header";
import { SignalsList } from "@/components/result/signals-list";
import { AppShell } from "@/components/shared/app-shell";
import { createLocalRecordsStore } from "@/lib/storage/local-records";
import type { AnalysisRecord } from "@/lib/types/analysis";

export default function ResultPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [record, setRecord] = useState<AnalysisRecord | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const store = createLocalRecordsStore(window.localStorage);
    setRecord(store.getById(id));
  }, [id]);

  if (!hasMounted) {
    return <AppShell />;
  }

  if (!record) {
    return (
      <AppShell>
        <div className="rounded-[28px] border border-white/70 bg-white/55 p-8 text-stone-600 backdrop-blur-lg">
          We could not find that saved dog moment.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <ResultHeader record={record} />
        <SignalsList signals={record.signals} />
        <InterpretationCard text={record.scientificInterpretation} />
        <InnerMonologueCard text={record.innerMonologue} />
        <p className="max-w-3xl text-sm leading-7 text-stone-500">
          {record.disclaimer}
        </p>
      </div>
    </AppShell>
  );
}
