import { cva, type VariantProps } from "class-variance-authority"

import { twMerge } from "tailwind-merge"

const button = cva(
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
  ],
  {
    variants: {
      intent: {
        light: ["bg-white", "text-black", "hover:enabled:bg-gray-200", "dark:bg-black", "dark:text-white", "dark:hover:enabled:bg-gray-700", "border-black", "dark:border-white"],
        dark: ["bg-black", "text-white", "hover:enabled:bg-gray-700", "dark:bg-white", "dark:text-black", "dark:hover:enabled:bg-gray-200", "border-white", "dark:border-black"],
        muted: ["bg-[#E6E6E6]", "text-black", "hover:enabled:bg-gray-300", "border-black"],
        lightBorder: ["bg-black", "text-white", "border-white", "hover:enabled:bg-gray-700", "dark:bg-white", "dark:text-black", "dark:border-black", "dark:hover:enabled:bg-gray-200"],
        darkBorder: ["bg-white", "text-black", "border-black", "hover:enabled:bg-gray-200", "dark:bg-black", "dark:text-white", "dark:border-white", "dark:hover:enabled:bg-gray-700"],
      },
      size: {
        sm: ["min-w-20", "min-h-10", "text-sm", "py-1.5", "px-4"],
        md: ["min-w-28", "min-h-[2.75rem]", "text-base", "py-2", "px-5"],
        lg: ["min-w-32", "min-h-12", "text-lg", "py-2.5", "px-6"],
      },
      underline: { true: ["underline"], false: [] },
    },
    defaultVariants: {
      intent: "dark",
      size: "lg",
    },
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof button> {
  underline?: boolean

}

export function Button({ className, intent, size, underline, ...props }: ButtonProps) {
  return (
    <button className={twMerge(button({ intent, size, className, underline }))} {...props}>
      {props.children}
    </button>
  )
}
