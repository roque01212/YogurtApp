import { ArrowRight } from "lucide-react";
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
      className="group rounded-2xl border border-white/10 bg-white/5 p-4 text-white shadow-sm transition hover:border-white/20 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-zinc-500">
            Seccion
          </p>
          <p className="mt-1 text-lg font-semibold">{title}</p>
        </div>
        <ArrowRight className="mt-1 size-4 text-zinc-500 transition group-hover:translate-x-0.5 group-hover:text-white" />
      </div>
      <p className="mt-3 text-sm text-zinc-400">{description}</p>
    </Link>
  );
};
