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
        <label className="mb-1 block text-xs font-medium text-zinc-300">
          {label}
        </label>

        <input
          {...props}
          ref={ref}
          type={type}
          className={`
          w-full rounded-xl border  bg-white/5 px-3 py-2 text-sm
           text-zinc-100 placeholder:text-zinc-500 outline-none transition  
           ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-white/10 focus:border-white/20 focus:ring-white/20"}
          
        `}
        />
        {error && <p className="mt-1 text-md text-red-400 ">{error}</p>}
      </div>
    );
  },
);
