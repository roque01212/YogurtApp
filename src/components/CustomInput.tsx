import { forwardRef, type InputHTMLAttributes } from "react";

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  type?: string;
}

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, className, error, type, ...props }, ref) => {
    return (
      <div className="sm:col-span-1">
        <label className="mb-1 block text-xs font-semibold text-zinc-300">
          {label}
        </label>

        <input
          {...props}
          ref={ref}
          type={type}
          className={`
            min-h-11 w-full rounded-xl border bg-zinc-950/50 px-3 py-2 text-sm text-zinc-100
            placeholder:text-zinc-500 outline-none transition focus:ring-2
            ${className ?? ""}
            ${
              error
                ? "border-red-400/60 focus:border-red-300 focus:ring-red-400/20"
                : "border-white/10 focus:border-emerald-300/60 focus:ring-emerald-300/20"
            }
          `}
        />
        {error && <p className="mt-1 text-sm text-red-300">{error}</p>}
      </div>
    );
  },
);
