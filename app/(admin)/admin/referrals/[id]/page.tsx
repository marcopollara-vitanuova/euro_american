import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/tables/data-table";
import { ReferralActions } from "@/components/referrals/referral-actions";
import { auditLogs, customers, products, quotes, referrals } from "@/lib/demo/data";
import { formatCurrency } from "@/lib/utils";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const referral = referrals.find((entry) => entry.id === id);
  if (!referral) notFound();
  const quote = quotes.find((item) => item.id === referral.quoteId);
  const customer = quote ? customers.find((item) => item.id === quote.customerId) : null;
  const product = quote ? products.find((item) => item.id === quote.productId) : null;
  const audit = auditLogs.filter((log) => log.entityId === referral.id || log.entityId === referral.quoteId);

  return (
    <AppShell title={`Referral ${referral.id}`} breadcrumb="Backend MGA / dettaglio">
      <div className="grid gap-5">
        <Card>
          <CardHeader title="Riepilogo pratica" action={<Badge tone={referral.priority === "HIGH" ? "amber" : "blue"}>{referral.priority}</Badge>} />
          <div className="grid gap-3 md:grid-cols-4">
            <p><strong>Stato</strong><br />{referral.status}</p>
            <p><strong>Cliente</strong><br />{customer?.displayName ?? "-"}</p>
            <p><strong>Prodotto</strong><br />{product?.name ?? "-"}</p>
            <p><strong>SLA</strong><br />{referral.slaDueAt}</p>
          </div>
        </Card>
        <ReferralActions referralId={referral.id} initialStatus={referral.status} />
        <div className="data-grid">
          <Card>
            <CardHeader title="Risposte critiche" description="Motivi referral e campi assuntivi principali" />
            <DataTable headers={["Elemento", "Valore"]} rows={[
              ["Motivi", referral.reasons.map((reason) => reason.label).join(", ")],
              ["Massimale", quote ? formatCurrency(quote.selectedLimit) : "-"],
              ["Sinistri ultimi 5 anni", String(quote?.answers.claims_last_5_years ?? "-")],
              ["Territorio", String(quote?.answers.territory ?? "-")],
            ]} />
          </Card>
          <Card>
            <CardHeader title="Dati intermediario e preventivo" description="Contesto per decisione underwriter" />
            <div className="metric-row"><span>Quote ID</span><strong>{quote?.id ?? "-"}</strong></div>
            <div className="metric-row"><span>Premio preliminare</span><strong>{formatCurrency(quote?.grossPremium)}</strong></div>
            <div className="metric-row"><span>Owner user</span><strong>{quote?.ownerUserId ?? "-"}</strong></div>
            <div className="metric-row"><span>Distributore</span><strong>{quote?.distributorId ?? "-"}</strong></div>
          </Card>
        </div>
        <Card>
          <CardHeader title="Messaggi, decisione e audit" description="Timeline minima per review e tracciabilita" />
          <DataTable headers={["Azione", "Entita", "Rischio", "Timestamp"]} rows={audit.map((log) => [log.action, `${log.entityType} ${log.entityId}`, <Badge key={log.id} tone={log.riskLevel === "HIGH" ? "amber" : "blue"}>{log.riskLevel}</Badge>, log.timestamp])} />
        </Card>
      </div>
    </AppShell>
  );
}
