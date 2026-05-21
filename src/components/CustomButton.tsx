import type { ButtonHTMLAttributes, ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}
export const CustomButton = ({
  type = "button",
  disabled = false,
  children,
  className = "",
  ...props
}: Props) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        inline-flex h-11 items-center justify-center rounded-xl border px-4 text-sm font-medium transition
        focus:outline-none focus:ring-2 focus:ring-white/10
        ${
          disabled
            ? "cursor-not-allowed border-white/5 bg-white/5 text-zinc-500 opacity-60"
            : "border-white/10 bg-transparent text-zinc-200 hover:bg-white/5"
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
