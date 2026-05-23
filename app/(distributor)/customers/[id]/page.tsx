import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/tables/data-table";
import { customers, demoDocuments, policies, products, quotes } from "@/lib/demo/data";
import { formatCurrency } from "@/lib/utils";

export default async function CustomerDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = customers.find((item) => item.id === id);
  if (!customer) notFound();
  const customerQuotes = quotes.filter((quote) => quote.customerId === id);
  const customerPolicies = policies.filter((policy) => policy.customerId === id);
  const customerDocuments = demoDocuments.filter((document) => document.entityId === id || customerQuotes.some((quote) => quote.id === document.entityId) || customerPolicies.some((policy) => policy.id === document.entityId));

  return (
    <AppShell title={customer.displayName} breadcrumb="Cliente / dettaglio">
      <div className="grid gap-5">
        <div className="kpi-grid">
          <Card><p className="text-sm font-semibold text-slate-700">Preventivi</p><div className="mt-2 text-3xl font-black">{customerQuotes.length}</div></Card>
          <Card><p className="text-sm font-semibold text-slate-700">Polizze</p><div className="mt-2 text-3xl font-black">{customerPolicies.length}</div></Card>
          <Card><p className="text-sm font-semibold text-slate-700">Documenti</p><div className="mt-2 text-3xl font-black">{customerDocuments.length}</div></Card>
          <Card><p className="text-sm font-semibold text-slate-700">Privacy</p><div className="mt-2"><Badge tone={customer.privacyConsent ? "green" : "amber"}>{customer.privacyConsent ? "Consenso attivo" : "Da acquisire"}</Badge></div></Card>
        </div>
        <div className="data-grid">
          <Card>
            <CardHeader title="Anagrafica" description="Dati essenziali e retention" />
            <dl className="grid gap-3 text-sm">
              <div><dt className="font-bold text-slate-700">Email</dt><dd>{customer.email}</dd></div>
              <div><dt className="font-bold text-slate-700">Telefono</dt><dd>{customer.phone}</dd></div>
              <div><dt className="font-bold text-slate-700">Codice fiscale / P.IVA</dt><dd>{customer.taxCode} {customer.vatNumber ? `· ${customer.vatNumber}` : ""}</dd></div>
              <div><dt className="font-bold text-slate-700">Sede</dt><dd>{customer.city} ({customer.province})</dd></div>
              <div><dt className="font-bold text-slate-700">Retention</dt><dd>{customer.retentionUntil}</dd></div>
            </dl>
          </Card>
          <Card>
            <CardHeader title="Note operative" description="Controlli predisposti per produzione" />
            <ul className="grid gap-2 text-sm text-slate-700">
              <li>Controllo duplicati su codice fiscale / partita IVA.</li>
              <li>Consensi privacy versionati e audit modifiche.</li>
              <li>Cancellazione logica e data retention configurabile.</li>
            </ul>
          </Card>
        </div>
        <Card>
          <CardHeader title="Storico preventivi" description="Tab richiesto: riepilogo, questionario, pricing, documenti, referral e audit" />
          <DataTable headers={["Preventivo", "Prodotto", "Stato", "Premio"]} rows={customerQuotes.map((quote) => [
            <Link key={quote.id} className="font-semibold text-teal-700" href={`/quotes/${quote.id}`}>{quote.id}</Link>,
            products.find((product) => product.id === quote.productId)?.name,
            <Badge key={quote.id} tone={quote.status.includes("REFERRAL") ? "amber" : "green"}>{quote.status}</Badge>,
            formatCurrency(quote.grossPremium),
          ])} />
        </Card>
        <Card>
          <CardHeader title="Documenti collegati" description="Documenti generati o archiviati per cliente, preventivo e polizza" />
          <DataTable headers={["Documento", "Tipo", "Stato", "Hash"]} rows={customerDocuments.map((document) => [document.name, document.type, <Badge key={document.id} tone="blue">{document.status}</Badge>, document.hash])} />
        </Card>
      </div>
    </AppShell>
  );
}
