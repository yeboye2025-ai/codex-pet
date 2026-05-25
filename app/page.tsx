"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/shared/app-shell";
import { AnalysisWorkspace } from "@/components/upload/analysis-workspace";
import { Dropzone } from "@/components/upload/dropzone";
import { analyzeDogPhotoWithArk } from "@/lib/ark/client";
import { createLocalRecordsStore } from "@/lib/storage/local-records";
import {
  isArkConfig,
  isDeepSeekConfig,
  readApiConfig
} from "@/lib/storage/api-config";
import { analyzeDogPhotoWithGeminiBrowser } from "@/lib/gemini/browser-client";

function ExampleResult() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="glass-card-strong relative overflow-hidden rounded-[32px] p-4 md:p-5"
    >
      <div className="absolute right-8 top-8 h-28 w-28 rounded-full bg-[rgba(216,183,160,0.18)] blur-3xl animate-pulse-glow" />
      <div className="grid gap-4 lg:grid-cols-[0.86fr_1.14fr]">
        <div className="group relative overflow-hidden rounded-[26px]">
          <img
            src="https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80"
            alt="Golden retriever example"
            className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/45 to-transparent" />
          <div className="absolute left-4 top-4 rounded-full bg-white/86 px-4 py-2 text-sm font-medium text-stone-900 backdrop-blur-xl">
            Curious & Calm
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-[24px] bg-white/82 p-5 shadow-[0_16px_40px_rgba(87,63,43,0.08)]">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
              Example Reading
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-stone-950">
              Golden Retriever
            </p>
            <p className="mt-2 text-sm leading-7 text-stone-600">
              A warm, readable view of what your companion may be feeling right
              now.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="glass-card rounded-[22px] p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
                Emotion
              </p>
              <p className="mt-2 text-base font-semibold text-stone-950">
                Curious & Calm
              </p>
            </div>
            <div className="glass-card rounded-[22px] p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
                Signals
              </p>
              <p className="mt-2 text-sm font-medium text-stone-800">
                Forward gaze, lowered posture
              </p>
            </div>
            <div className="glass-card rounded-[22px] p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
                Interpretation
              </p>
              <p className="mt-2 text-sm font-medium text-stone-800">
                Attentive, not stressed.
              </p>
            </div>
            <div className="glass-card rounded-[22px] p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
                Inner Thought
              </p>
              <p className="mt-2 text-sm font-medium text-stone-800">
                “I&apos;m waiting quietly.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default function HomePage() {
  const router = useRouter();
  const resultRef = useRef<HTMLDivElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  useEffect(() => {
    if (!previewUrl || !resultRef.current) {
      return;
    }

    resultRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, [previewUrl]);

  async function fileToDataUrl(file: File) {
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
          return;
        }

        reject(new Error("Could not read file"));
      };
      reader.onerror = () => reject(new Error("Could not read file"));
      reader.readAsDataURL(file);
    });
  }

  async function handleAnalyze(imageDataUrl: string) {
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const recordsStore = createLocalRecordsStore(window.localStorage);
      const { apiUrl, apiKey, model } = readApiConfig(window.localStorage);

      if (!apiUrl || !apiKey || !model) {
        throw new Error("Please fill in API CONFIG before analyzing.");
      }

      if (isDeepSeekConfig({ apiUrl, apiKey, model })) {
        throw new Error(
          "DeepSeek is text-capable here, but it does not currently support the image analysis Pet Whisper needs."
        );
      }

      if (isArkConfig({ apiUrl, apiKey, model })) {
        const result = await analyzeDogPhotoWithArk({
          imageDataUrl,
          apiUrl,
          apiKey,
          model
        });

        const record = {
          ...result,
          id: crypto.randomUUID(),
          imageDataUrl,
          createdAt: new Date().toISOString(),
          isFavorited: false
        };

        recordsStore.save(record);
        router.push(`/result/${record.id}`);
        return;
      }

      if (apiKey.startsWith("AIza")) {
        const result = await analyzeDogPhotoWithGeminiBrowser({
          imageDataUrl,
          apiKey,
          model
        });

        const record = {
          ...result,
          id: crypto.randomUUID(),
          imageDataUrl,
          createdAt: new Date().toISOString(),
          isFavorited: false
        };

        recordsStore.save(record);
        router.push(`/result/${record.id}`);
        return;
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ imageDataUrl, apiUrl, apiKey, model })
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | { message?: string }
          | null;
        throw new Error(body?.message || "Analysis failed");
      }

      const record = await response.json();
      recordsStore.save(record);
      router.push(`/result/${record.id}`);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We could not read this moment just yet. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  const canAnalyze = useMemo(() => Boolean(previewUrl), [previewUrl]);

  return (
    <AppShell>
      <section className="grid min-h-[calc(100vh-8rem)] gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center xl:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col gap-5 py-2"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/78 px-4 py-2 text-sm text-stone-600 shadow-[0_12px_30px_rgba(87,63,43,0.08)]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#d8b7a0]" />
              Quiet emotional cues
            </div>
            <h1 className="max-w-2xl text-[2.9rem] font-semibold tracking-[-0.06em] text-stone-950 md:text-[3.5rem] md:leading-[0.96] xl:text-[4.15rem]">
              Understand the quiet emotions your dog never learned to say.
            </h1>
            <p className="max-w-md text-base leading-7 text-stone-600">
              Upload a quiet moment.
              <br />
              We&apos;ll interpret visible emotional cues.
            </p>
          </div>

          <div className="glass-card-strong rounded-[28px] p-4 md:p-5">
            <div className="space-y-4">
              <Dropzone
                onSelect={async (file) => {
                  const dataUrl = await fileToDataUrl(file);
                  setPreviewUrl(dataUrl);
                  setErrorMessage(null);
                }}
              />
              <div className="flex flex-wrap gap-3">
                <label
                  className="rounded-full border border-white/80 bg-white/82 px-5 py-3 text-sm font-medium text-stone-700 transition hover:-translate-y-0.5"
                  role="button"
                  tabIndex={0}
                >
                  Upload photo
                  <input
                    aria-label="Secondary upload dog photo"
                    className="sr-only"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) {
                        return;
                      }
                      const dataUrl = await fileToDataUrl(file);
                      setPreviewUrl(dataUrl);
                      setErrorMessage(null);
                    }}
                  />
                </label>
                <button
                  onClick={() => previewUrl && handleAnalyze(previewUrl)}
                  disabled={!canAnalyze || isAnalyzing}
                  className="rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {isAnalyzing ? "Reading..." : "Analyze"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div ref={resultRef}>
          {previewUrl ? (
            <AnalysisWorkspace
              imagePreviewUrl={previewUrl}
              isAnalyzing={isAnalyzing}
              errorMessage={errorMessage}
              onAnalyze={() => previewUrl && handleAnalyze(previewUrl)}
              onReset={() => {
                setPreviewUrl(null);
                setErrorMessage(null);
              }}
            />
          ) : (
            <ExampleResult />
          )}
        </div>
      </section>
    </AppShell>
  );
}
