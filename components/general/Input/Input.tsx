import { forwardRef } from "react"
import { twMerge } from "tailwind-merge"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-black dark:text-white mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={twMerge(
            "w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600",
            "bg-white dark:bg-black",
            "text-black dark:text-white",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",
            "focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent",
            "transition-colors",
            error && "border-red-500 dark:border-red-400",
            className
          )}
          {...props}
        />
        <p className={`mt-1 text-sm h-5 ${error ? "text-red-500 dark:text-red-400 visible" : "invisible"}`}>{error || ""}</p>
      </div>
    )
  }
)

Input.displayName = "Input"
