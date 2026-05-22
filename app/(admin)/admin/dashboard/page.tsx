import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/charts/kpi-card";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { distributors, incidents, policies, products, quotes, referrals, users } from "@/lib/demo/data";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboard() {
  const premium = policies.reduce((sum, policy) => sum + policy.grossPremium, 0);
  const usersWithoutMfa = users.filter((user) => !user.mfaEnabled);
  const todo = [
    { title: "Gestire referral ad alta priorita", href: "/admin/referrals", meta: `${referrals.filter((item) => item.priority === "HIGH").length} pratiche`, tone: "amber" as const },
    { title: "Completare access review MFA", href: "/admin/security", meta: `${usersWithoutMfa.length} utenti senza MFA`, tone: "red" as const },
    { title: "Validare configurazione prodotti 2026", href: "/admin/products", meta: `${products.length} prodotti attivi`, tone: "blue" as const },
    { title: "Controllare incidenti e change request", href: "/admin/incidents", meta: `${incidents.length} incidente aperto`, tone: "amber" as const },
  ];

  return (
    <AppShell title="Control room MGA" breadcrumb="Backend MGA">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-700">Priorita operative di oggi</p>
          <p className="text-sm text-slate-600">Focus su referral, sicurezza, configurazioni e continuita operativa.</p>
        </div>
        <Button asChild><Link href="/admin/referrals">Apri coda referral</Link></Button>
      </div>

      <div className="kpi-grid">
        <KpiCard label="Preventivi generati" value={quotes.length} hint="Quote e referral nel tenant demo" />
        <KpiCard label="Premi emessi" value={formatCurrency(premium)} hint="Produzione emessa demo" />
        <KpiCard label="Referral aperti" value={referrals.length} hint="SLA underwriter da presidiare" />
        <KpiCard label="Utenti senza MFA" value={usersWithoutMfa.length} hint="Hardening accessi richiesto" />
      </div>

      <div className="dashboard-grid mt-6">
        <Card>
          <CardHeader title="Da fare oggi" description="Azioni che riducono rischio operativo e bloccano delivery" />
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
          <CardHeader title="Panoramica piattaforma" description="Stato commerciale, governance e configurazione" />
          <div className="metric-row"><span>Distributori attivi</span><strong>{distributors.filter((item) => item.status === "ACTIVE").length}</strong></div>
          <div className="metric-row"><span>Prodotti configurati</span><strong>{products.length}</strong></div>
          <div className="metric-row"><span>Referral aperti</span><strong>{referrals.filter((item) => item.status === "OPEN").length}</strong></div>
          <div className="metric-row"><span>Incidenti security</span><strong>{incidents.length}</strong></div>
        </Card>
      </div>
    </AppShell>
  );
}
