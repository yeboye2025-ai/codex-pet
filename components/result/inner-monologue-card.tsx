type InnerMonologueCardProps = {
  text: string;
};

export function InnerMonologueCard({ text }: InnerMonologueCardProps) {
  return (
    <section className="rounded-[28px] border border-amber-100 bg-amber-50/80 p-6">
      <h2 className="text-2xl font-semibold text-stone-900">Inner monologue</h2>
      <p className="mt-4 text-lg leading-8 text-stone-700">{text}</p>
    </section>
  );
}
