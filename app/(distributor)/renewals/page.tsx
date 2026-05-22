import { AppShell } from "@/components/layout/app-shell";
import { Card, CardHeader } from "@/components/ui/card";
export default function Page() { return <AppShell title="Rinnovi" breadcrumb="Portale distributore / renewals"><Card><CardHeader title="Rinnovi" description="Lista, filtri avanzati, export mock, stati operativi e audit accessi predisposti." /><p className="text-sm text-slate-600">Modulo MVP pronto per collegamento dati reali e workflow asincroni.</p></Card></AppShell>; }
