interface Props {
  title: string;
  description: string;
  value: string | number;
}

export const StatCard = (props: Props) => {
  const { title, description, value } = props;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm text-zinc-400">{title}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-2 text-xs text-zinc-500">{description}</p>
    </div>
  );
};
