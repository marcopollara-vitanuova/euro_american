import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("card p-5", className)}>{children}</section>;
}
export function CardHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return <div className="mb-4 flex items-start justify-between gap-4"><div><h2 className="text-xl font-black text-slate-950">{title}</h2>{description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}</div>{action}</div>;
}
