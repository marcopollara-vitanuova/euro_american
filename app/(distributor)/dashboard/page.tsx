import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/charts/kpi-card";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { customers, policies, products, quotes, referrals } from "@/lib/demo/data";
import { formatCurrency } from "@/lib/utils";

export default function DistributorDashboard() {
  const production = policies.reduce((sum, policy) => sum + policy.grossPremium, 0);
  const todo = [
    { title: "Creare un nuovo preventivo", href: "/quotes/new", meta: "Flusso guidato in 4 macro-step", tone: "green" as const },
    { title: "Seguire referral aperti", href: "/referrals", meta: `${referrals.filter((item) => item.status === "OPEN").length} pratica in attesa`, tone: "amber" as const },
    { title: "Controllare rinnovi e documenti", href: "/renewals", meta: "Scadenze 90/60/30 giorni", tone: "blue" as const },
  ];

  return (
    <AppShell title="Dashboard operativa" breadcrumb="Portale distributore">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-700">Cosa fare oggi</p>
          <p className="text-sm text-slate-600">Priorita commerciali e post-vendita per broker e collaboratori.</p>
        </div>
        <Button asChild><Link href="/quotes/new">Nuovo preventivo</Link></Button>
      </div>

      <div className="kpi-grid">
        <KpiCard label="Preventivi in bozza" value={quotes.filter((quote) => quote.status === "DRAFT").length} hint="Da completare o inviare" />
        <KpiCard label="Referral aperti" value={referrals.filter((referral) => referral.status === "OPEN").length} hint="Da presidiare con underwriter" />
        <KpiCard label="Polizze emesse" value={policies.length} hint="Portafoglio attivo" />
        <KpiCard label="Produzione mese" value={formatCurrency(production)} hint="Premio lordo demo" />
      </div>

      <div className="dashboard-grid mt-6">
        <Card>
          <CardHeader title="To-do list" description="Azioni prioritarie, non menu generico" />
          <div className="task-list">
            {todo.map((item, index) => (
              <Link className="task-item" href={item.href} key={item.title}>
                <span className="task-number">{index + 1}</span>
                <span>
                  <strong className="text-slate-950">{item.title}</strong>
                  <span className="mt-1 block text-sm text-slate-700">{item.meta}</span>
                </span>
                <Badge tone={item.tone}>Apri</Badge>
              </Link>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Clienti e prodotti" description="Contesto rapido per iniziare una trattativa" />
          <div className="metric-row"><span>Clienti recenti</span><strong>{customers.length}</strong></div>
          <div className="metric-row"><span>Prodotti disponibili</span><strong>{products.length}</strong></div>
          {customers.slice(0, 3).map((customer) => (
            <Link className="block rounded-xl p-3 hover:bg-slate-50 focus:bg-slate-50" key={customer.id} href={`/customers/${customer.id}`}>
              <strong className="text-slate-950">{customer.displayName}</strong>
              <div className="text-sm text-slate-700">{customer.email} · {customer.city}</div>
            </Link>
          ))}
        </Card>
      </div>
    </AppShell>
  );
}
