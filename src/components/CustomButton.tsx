import type { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
}

export const CustomButton = ({
  type = "button",
  disabled = false,
  children,
  className = "",
  variant = "secondary",
  ...props
}: Props) => {
  const variants = {
    primary:
      "border-emerald-400/40 bg-emerald-400/15 text-emerald-50 hover:bg-emerald-400/25",
    secondary:
      "border-white/10 bg-white/5 text-zinc-100 hover:border-white/20 hover:bg-white/10",
    danger:
      "border-red-400/40 bg-red-500/15 text-red-100 hover:bg-red-500/25",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        inline-flex min-h-11 items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold shadow-sm transition
        focus:outline-none focus:ring-2 focus:ring-white/30
        ${
          disabled
            ? "cursor-not-allowed border-white/5 bg-white/5 text-zinc-500 opacity-60"
            : variants[variant]
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
