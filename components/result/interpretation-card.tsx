type InterpretationCardProps = {
  text: string;
};

export function InterpretationCard({ text }: InterpretationCardProps) {
  return (
    <section className="rounded-[28px] border border-white/70 bg-white/55 p-6 backdrop-blur-lg">
      <h2 className="text-2xl font-semibold text-stone-900">
        Scientific interpretation
      </h2>
      <p className="mt-4 text-base leading-8 text-stone-700">{text}</p>
    </section>
  );
}
