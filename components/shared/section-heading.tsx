type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description
}: SectionHeadingProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm uppercase tracking-[0.28em] text-stone-500">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
        {title}
      </h2>
      <p className="max-w-2xl text-base leading-7 text-stone-600">{description}</p>
    </div>
  );
}
