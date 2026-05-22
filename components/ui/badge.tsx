import { cn } from "@/lib/utils";
export function Badge({ children, tone = "blue" }: { children: React.ReactNode; tone?: "green" | "amber" | "red" | "blue" }) {
  return <span className={cn("badge", tone === "green" && "badge-green", tone === "amber" && "badge-amber", tone === "red" && "badge-red", tone === "blue" && "badge-blue")}>{children}</span>;
}
