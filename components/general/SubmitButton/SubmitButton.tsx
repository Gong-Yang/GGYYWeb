import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

const submitButton = cva(
  [
    "justify-center",
    "inline-flex",
    "items-center",
    "rounded-xl",
    "text-center",
    "border",
    "border-black",
    "dark:border-white",
    "transition-colors",
    "delay-50",
    "cursor-pointer",
    "disabled:opacity-50",
    "disabled:cursor-not-allowed",
  ],
  {
    variants: {
      intent: {
        primary: [
          "bg-black",
          "text-white",
          "hover:enabled:bg-gray-700",
          "dark:bg-white",
          "dark:text-black",
          "dark:hover:enabled:bg-gray-200",
        ],
        secondary: [
          "bg-transparent",
          "text-black",
          "hover:enabled:bg-black",
          "hover:enabled:text-white",
          "dark:text-white",
          "dark:hover:enabled:bg-white",
          "dark:hover:enabled:text-black",
        ],
      },
      size: {
        sm: ["min-w-20", "h-full", "min-h-10", "text-sm", "py-1.5", "px-4"],
        lg: ["min-w-32", "h-full", "min-h-12", "text-lg", "py-2.5", "px-6"],
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "lg",
    },
  }
)

export interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof submitButton> {}

export function SubmitButton({
  className,
  intent,
  size,
  ...props
}: SubmitButtonProps) {
  return (
    <button
      className={twMerge(submitButton({ intent, size, className }))}
      {...props}
    >
      {props.children}
    </button>
  )
}
