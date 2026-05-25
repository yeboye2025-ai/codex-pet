import type { ChangeEvent, DragEvent } from "react";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { validatePhotoFile } from "@/lib/utils/file";

type DropzoneProps = {
  onSelect: (file: File) => void;
};

export function Dropzone({ onSelect }: DropzoneProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleFile(file: File | null | undefined) {
    if (!file) {
      return;
    }

    const error = validatePhotoFile(file);
    if (error) {
      setErrorMessage(error);
      return;
    }

    setErrorMessage(null);
    setSelectedFileName(file.name);
    onSelect(file);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    handleFile(event.target.files?.[0]);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`relative block cursor-pointer overflow-hidden rounded-[24px] border px-4 py-4 text-left transition ${
        isDragging
          ? "border-stone-900/60 bg-white/84"
          : "border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(255,255,255,0.64))]"
      }`}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(216,183,160,0.22),transparent_42%)]" />
      <input
        ref={inputRef}
        aria-label="Upload dog photo"
        className="sr-only"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleChange}
      />
      <div className="relative flex items-center gap-4">
        <div className="soft-ring flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/90 text-lg text-stone-800">
          +
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-stone-950">
            Drop a gentle moment here.
          </p>
          <p className="mt-1 text-sm text-stone-500">
            Drag, click, or upload from mobile.
          </p>
        </div>
      </div>
      <div className="relative mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-full bg-stone-950 px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5"
        >
          Choose photo
        </button>
        <p className="truncate text-sm text-stone-500">
          {selectedFileName ?? "No photo selected yet"}
        </p>
      </div>
      {errorMessage ? (
        <span className="relative mt-3 block text-sm text-rose-600">
          {errorMessage}
        </span>
      ) : null}
    </motion.div>
  );
}
