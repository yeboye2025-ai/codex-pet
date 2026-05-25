"use client";

import { motion } from "framer-motion";

const featuredInsights = [
  {
    title: "Emotional State",
    body: "Curious, calm, and gently tuned in to whoever is just outside the frame.",
    accent: "from-emerald-200/80 to-white/20"
  },
  {
    title: "Behavioral Signals",
    body: "Forward gaze, softened jaw, and a body posture that stays low without looking guarded.",
    accent: "from-amber-200/80 to-white/20"
  },
  {
    title: "Scientific Interpretation",
    body: "Visible cues suggest quiet anticipation rather than stress. Attention is engaged, but tension is not escalating.",
    accent: "from-rose-200/80 to-white/20"
  },
  {
    title: "Inner Thoughts",
    body: "I know something is happening. I am staying close, watching gently, and waiting for my turn.",
    accent: "from-stone-200/80 to-white/20"
  }
];

const memoryCards = [
  {
    name: "Golden Retriever",
    emotion: "Curious & Calm",
    time: "2 hours ago",
    image:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Border Collie",
    emotion: "Focused & Bright",
    time: "Yesterday",
    image:
      "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Shiba Inu",
    emotion: "Settled & Soft",
    time: "Tuesday",
    image:
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80"
  }
];

export function HomeStory() {
  return (
    <section className="grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
      <motion.article
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="glass-card-strong rounded-[32px] p-6 md:p-7"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.34em] text-stone-500">
              Real Analysis Example
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-stone-950 md:text-4xl">
              Golden Retriever
            </h2>
          </div>
          <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900">
            Curious & Calm
          </span>
        </div>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700 md:text-xl">
          Your dog appears relaxed but visually attentive. The forward gaze and
          lowered posture suggest quiet anticipation rather than stress.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {featuredInsights.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: index * 0.06 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="glass-card rounded-[24px] p-5"
            >
              <div
                className={`h-24 rounded-[18px] bg-gradient-to-br ${card.accent}`}
              />
              <h3 className="mt-4 text-lg font-semibold text-stone-950">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-stone-600">{card.body}</p>
            </motion.div>
          ))}
        </div>
      </motion.article>

      <motion.article
        initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
        className="space-y-5"
      >
        <div className="px-2">
          <p className="text-[11px] uppercase tracking-[0.34em] text-stone-500">
            Recent Soft Reads
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-stone-950 md:text-4xl">
            A warmer content flow makes it feel like a real companion product.
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-8 text-stone-600">
            Saved moments, emotion labels, and time context give the homepage a
            living product rhythm instead of a static template feel.
          </p>
        </div>
        <div className="columns-1 gap-5 md:columns-2">
          {memoryCards.map((card, index) => (
            <motion.article
              key={card.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              whileHover={{ y: -5 }}
              className="glass-card mb-5 break-inside-avoid rounded-[28px] p-4"
            >
              <div className="relative overflow-hidden rounded-[22px]">
                <img
                  src={card.image}
                  alt={card.name}
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/35 to-transparent" />
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg font-semibold text-stone-950">
                    {card.name}
                  </p>
                  <span className="rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-stone-700">
                    {card.time}
                  </span>
                </div>
                <p className="inline-flex rounded-full bg-[#f2e2d7] px-3 py-1 text-sm font-medium text-stone-800">
                  {card.emotion}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.article>
    </section>
  );
}
