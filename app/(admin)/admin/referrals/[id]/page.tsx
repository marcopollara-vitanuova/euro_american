import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardHeader } from "@/components/ui/card";
import { referrals } from "@/lib/demo/data";
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const item = (referrals as any[]).find((entry) => entry.id === id || entry.pricingVersionId === id); if (!item) notFound(); return <AppShell title="Referral {item.name ?? item.title ?? id}" breadcrumb="Backend MGA / dettaglio"><Card><CardHeader title="Configurazione versionata" description="Audit, change request, rollback e confronto versioni predisposti." /><pre className="overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{JSON.stringify(item, null, 2)}</pre></Card></AppShell>; }
