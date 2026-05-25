"use client";

import { useMemo } from "react";
import { createLocalRecordsStore } from "@/lib/storage/local-records";

export function useAnalysisRecords() {
  return useMemo(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return createLocalRecordsStore(window.localStorage);
  }, []);
}
