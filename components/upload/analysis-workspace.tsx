"use client";

import { motion } from "framer-motion";

type AnalysisWorkspaceProps = {
  imagePreviewUrl: string | null;
  isAnalyzing: boolean;
  errorMessage: string | null;
  onAnalyze: () => void;
  onReset: () => void;
};

const readyCards = [
  ["Emotion", "Curious & Calm"],
  ["Signals", "Forward gaze, lowered posture"],
  ["Interpretation", "Attentive, not stressed."],
  ["Inner Thought", "“I’m waiting quietly.”"]
] as const;

const loadingSteps = [
  "Reading posture...",
  "Analyzing gaze...",
  "Understanding movement..."
];

function ResultCard({
  title,
  body,
  delay
}: {
  title: string;
  body: string;
  delay: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -3 }}
      className="glass-card rounded-[22px] p-4"
    >
      <p className="text-xs uppercase tracking-[0.28em] text-stone-500">{title}</p>
      <p className="mt-3 text-sm font-medium leading-7 text-stone-900">{body}</p>
    </motion.article>
  );
}

export function AnalysisWorkspace({
  imagePreviewUrl,
  isAnalyzing,
  errorMessage,
  onAnalyze,
  onReset
}: AnalysisWorkspaceProps) {
  if (!imagePreviewUrl) {
    return null;
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.55 }}
      className="glass-card-strong rounded-[32px] p-4 md:p-5"
    >
      <div className="grid gap-4 lg:grid-cols-[0.86fr_1.14fr]">
        <motion.div
          whileHover={{ scale: 1.015 }}
          className="group relative overflow-hidden rounded-[26px]"
        >
          <img
            src={imagePreviewUrl}
            alt="Selected dog photo preview"
            className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_34%)]" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/45 to-transparent" />
          <div className="absolute left-4 top-4 rounded-full bg-white/86 px-4 py-2 text-sm font-medium text-stone-900 backdrop-blur-xl">
            Gentle frame selected
          </div>
        </motion.div>

        <div className="space-y-4">
          {isAnalyzing ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {loadingSteps.map((step, index) => (
                <article
                  key={step}
                  className="glass-card rounded-[22px] p-4 sm:col-span-1"
                >
                  <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
                    Step {index + 1}
                  </p>
                  <p className="mt-3 text-sm font-medium text-stone-900">{step}</p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/85">
                    <div
                      className="animate-shimmer h-full rounded-full"
                      style={{ width: `${76 + index * 8}%` }}
                    />
                  </div>
                </article>
              ))}
              <article className="glass-card rounded-[22px] p-4 sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.28em] text-stone-500">
                  Reading
                </p>
                <div className="mt-4 space-y-3">
                  <div className="h-3 w-4/5 rounded-full bg-white/80" />
                  <div className="h-3 w-2/3 rounded-full bg-white/80" />
                  <div className="h-3 w-3/4 rounded-full bg-white/80" />
                </div>
              </article>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {readyCards.map(([title, body], index) => (
                <ResultCard
                  key={title}
                  title={title}
                  body={body}
                  delay={0.06 * index}
                />
              ))}
            </div>
          )}

          {errorMessage ? (
            <p className="text-sm text-rose-600">{errorMessage}</p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onAnalyze}
              disabled={isAnalyzing}
              className="rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {isAnalyzing ? "Reading..." : "Analyze"}
            </button>
            <button
              onClick={onReset}
              className="rounded-full border border-white/80 bg-white/78 px-5 py-3 text-sm font-medium text-stone-700 transition hover:-translate-y-0.5"
            >
              Choose another photo
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
