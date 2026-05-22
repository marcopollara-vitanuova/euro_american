import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth/session";
import { Sidebar } from "./navigation";
import { Button } from "@/components/ui/button";

export async function AppShell({ children, title, breadcrumb }: { children: ReactNode; title: string; breadcrumb?: string }) {
  const user = await getCurrentUser();
  return <div className="enterprise-shell"><Sidebar /><main><header className="topbar"><div><p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{breadcrumb ?? "Axieme MGA Platform"}</p><h1 className="text-2xl font-bold text-slate-950">{title}</h1></div><div className="flex items-center gap-3 text-sm"><div className="text-right"><div className="font-semibold">{user?.name ?? "Guest"}</div><div className="text-slate-500">{user?.role ?? "NO_SESSION"} · Axieme Demo MGA</div></div><form action="/api/auth/logout" method="post"><Button variant="outline" size="sm">Logout</Button></form></div></header><section className="content">{children}</section></main></div>;
}
