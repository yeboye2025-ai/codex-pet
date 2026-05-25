import type { AnalysisRecord } from "@/lib/types/analysis";
import { STORAGE_KEYS } from "@/lib/storage/storage-keys";

function readRecords(storage: Storage): AnalysisRecord[] {
  try {
    const raw = storage.getItem(STORAGE_KEYS.records);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AnalysisRecord[]) : [];
  } catch {
    return [];
  }
}

function writeRecords(storage: Storage, records: AnalysisRecord[]) {
  storage.setItem(STORAGE_KEYS.records, JSON.stringify(records));
}

export function createLocalRecordsStore(storage: Storage) {
  return {
    list() {
      return readRecords(storage).sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt)
      );
    },
    save(record: AnalysisRecord) {
      const records = readRecords(storage).filter((item) => item.id !== record.id);
      writeRecords(storage, [record, ...records]);
    },
    toggleFavorite(id: string) {
      const records = readRecords(storage).map((record) =>
        record.id === id
          ? { ...record, isFavorited: !record.isFavorited }
          : record
      );
      writeRecords(storage, records);
    },
    getById(id: string) {
      return readRecords(storage).find((record) => record.id === id) ?? null;
    }
  };
}
