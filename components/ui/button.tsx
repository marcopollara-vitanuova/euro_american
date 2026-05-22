import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "default" | "secondary" | "outline" | "destructive";
  size?: "default" | "sm" | "lg";
};

export function Button({ className, variant = "default", size = "default", asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(
    "inline-flex items-center justify-center rounded-xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-teal-600 disabled:opacity-50",
    variant === "default" && "bg-teal-700 text-white hover:bg-teal-800",
    variant === "secondary" && "bg-slate-100 text-slate-900 hover:bg-slate-200",
    variant === "outline" && "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50",
    variant === "destructive" && "bg-red-700 text-white hover:bg-red-800",
    size === "sm" && "h-9 px-3 text-sm",
    size === "default" && "h-10 px-4",
    size === "lg" && "h-12 px-6 text-lg",
    className,
  )} {...props} />;
}
