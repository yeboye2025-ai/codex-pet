type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-[28px] border border-dashed border-stone-300 bg-white/55 px-8 py-14 text-center">
      <h2 className="text-2xl font-medium text-stone-900">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-stone-600">{description}</p>
    </div>
  );
}
