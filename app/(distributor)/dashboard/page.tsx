import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/charts/kpi-card";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { customers, policies, quotes, referrals } from "@/lib/demo/data";
import { formatCurrency } from "@/lib/utils";

export default function DistributorDashboard() {
  const production = policies.reduce((sum, policy) => sum + policy.grossPremium, 0);
  return <AppShell title="Dashboard distributore" breadcrumb="Portale distributore"><div className="mb-6 flex justify-end"><Button asChild><Link href="/quotes/new">Nuovo preventivo</Link></Button></div><div className="kpi-grid"><KpiCard label="Preventivi in bozza" value={quotes.filter((q) => q.status === "DRAFT").length} /><KpiCard label="Referral aperti" value={referrals.filter((r) => r.status === "OPEN").length} /><KpiCard label="Polizze emesse" value={policies.length} /><KpiCard label="Produzione mese" value={formatCurrency(production)} /></div><div className="data-grid mt-6"><Card><CardHeader title="Clienti recenti" description="Ultimi soggetti censiti" />{customers.map((customer) => <Link className="block rounded-xl p-3 hover:bg-slate-50" key={customer.id} href={`/customers/${customer.id}`}><strong>{customer.displayName}</strong><div className="text-sm text-slate-500">{customer.email}</div></Link>)}</Card><Card><CardHeader title="Attività da completare" description="Pagamenti, referral e documenti" /><ul className="space-y-3 text-sm text-slate-600"><li>Completare questionario per preventivi draft</li><li>Inviare integrazione su referral aperti</li><li>Verificare rinnovi in scadenza 90/60/30 giorni</li><li>Scaricare documenti generati da proposta</li></ul></Card></div></AppShell>;
}
