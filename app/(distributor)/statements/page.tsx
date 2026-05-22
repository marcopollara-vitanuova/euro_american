import { AppShell } from "@/components/layout/app-shell";
import { Card, CardHeader } from "@/components/ui/card";
export default function Page() { return <AppShell title="Estratti conto" breadcrumb="Portale distributore / statements"><Card><CardHeader title="Estratti conto" description="Lista, filtri avanzati, export mock, stati operativi e audit accessi predisposti." /><p className="text-sm text-slate-600">Modulo MVP pronto per collegamento dati reali e workflow asincroni.</p></Card></AppShell>; }
