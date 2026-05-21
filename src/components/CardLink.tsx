import { Link } from "react-router";

interface Props {
  link: string;
  title: string;
  description: string;
}
export const CardLink = (props: Props) => {
  const { link, title, description } = props;

  return (
    <Link
      to={`/${link}`}
      className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
    >
      <p className="text-sm text-zinc-400">Sección</p>
      <p className="mt-1 text-lg font-semibold">{title}</p>
      <p className="mt-2 text-xs text-zinc-500">{description}</p>
    </Link>
  );
};
