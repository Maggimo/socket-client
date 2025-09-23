import { clsx } from "clsx";
import type { InputHTMLAttributes } from "react";

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = ({ error, ...props }: IInputProps) => {
  return (
    <div>
      <input
        type="text"
        autoComplete="off"
        required
        className={clsx(
          "bg-white w-full border  rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-300",
          error ? "border-red-500!" : "border-slate-300",
        )}
        {...props}
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
};
