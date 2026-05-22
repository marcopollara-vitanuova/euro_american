import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardHeader } from "@/components/ui/card";
import { policies } from "@/lib/demo/data";
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const item = policies.find((entry) => entry.id === id); if (!item) notFound(); return <AppShell title="Polizze {id}" breadcrumb="Polizze / dettaglio"><Card><CardHeader title="Dettaglio con tab" description="Riepilogo, questionario, documenti, messaggi, decisione e audit." /><pre className="overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">{JSON.stringify(item, null, 2)}</pre></Card></AppShell>; }
