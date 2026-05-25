const steps = [
  {
    title: "Upload",
    body: "Choose one clear moment."
  },
  {
    title: "Read",
    body: "Pet Whisper interprets visible cues."
  },
  {
    title: "Keep",
    body: "Save, revisit, or share the feeling."
  }
];

export function HowItWorks() {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.28em] text-stone-500">
          How It Works
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
          Three small steps
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step) => (
          <article
            key={step.title}
            className="rounded-[24px] border border-white/70 bg-white/50 p-5 backdrop-blur-lg"
          >
            <h3 className="text-base font-semibold uppercase tracking-[0.16em] text-stone-900">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-7 text-stone-600">{step.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
