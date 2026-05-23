import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/tables/data-table";
import { QuoteActions } from "@/components/quote/quote-actions";
import { customers, demoDocuments, demoPayments, demoSignatureRequests, policies, products, quotes, referrals, auditLogs } from "@/lib/demo/data";
import { calculatePrice } from "@/lib/pricing/engine";
import { formatCurrency } from "@/lib/utils";

export default async function QuoteDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = quotes.find((item) => item.id === id);
  if (!quote) notFound();
  const customer = customers.find((item) => item.id === quote.customerId);
  const product = products.find((item) => item.id === quote.productId)!;
  const calc = calculatePrice({ quoteId: quote.id, productId: quote.productId, answers: quote.answers, selectedLimit: quote.selectedLimit, selectedDeductible: quote.selectedDeductible, userId: quote.ownerUserId });
  const quoteDocuments = demoDocuments.filter((document) => document.entityId === quote.id);
  const quotePayments = demoPayments.filter((payment) => payment.quoteId === quote.id);
  const quoteReferral = referrals.filter((referral) => referral.quoteId === quote.id);
  const quotePolicy = policies.find((policy) => policy.quoteId === quote.id);
  const quoteSignatures = quotePolicy ? demoSignatureRequests.filter((signature) => signature.policyId === quotePolicy.id) : [];
  const quoteAudit = auditLogs.filter((log) => log.entityId === quote.id || quoteReferral.some((referral) => referral.id === log.entityId));

  return (
    <AppShell title={`Preventivo ${quote.id}`} breadcrumb="Preventivo / dettaglio">
      <div className="grid gap-5">
        <Card>
          <CardHeader title="Riepilogo" action={<Badge tone={quote.status.includes("REFERRAL") ? "amber" : quote.status === "DECLINED" ? "red" : "green"}>{quote.status}</Badge>} />
          <div className="grid gap-3 md:grid-cols-4">
            <p><strong>Cliente</strong><br />{customer?.displayName}</p>
            <p><strong>Prodotto</strong><br />{product.name}</p>
            <p><strong>Massimale</strong><br />{formatCurrency(quote.selectedLimit)}</p>
            <p><strong>Premio lordo</strong><br />{formatCurrency(calc.result.grossPremium)}</p>
          </div>
        </Card>
        <QuoteActions quoteId={quote.id} initialPolicyId={quotePolicy?.id} />
        <div className="data-grid">
          <Card>
            <CardHeader title="Questionario" description="Snapshot risposte salvate sul preventivo" />
            <DataTable headers={["Campo", "Risposta"]} rows={Object.entries(quote.answers).map(([key, value]) => [key, String(value)])} />
          </Card>
          <Card>
            <CardHeader title="Pricing trace" description="Output motore tariffario e regole applicate" />
            <div className="metric-row"><span>Trace ID</span><strong>{calc.trace.id}</strong></div>
            <div className="metric-row"><span>Versione tariffa</span><strong>{calc.trace.pricingVersion}</strong></div>
            <div className="metric-row"><span>Regole</span><strong>{calc.trace.rulesApplied.join(", ")}</strong></div>
            {calc.result.referralReasons.map((reason) => <p className="mt-2 text-sm font-semibold text-amber-800" key={reason.code}>{reason.label}</p>)}
          </Card>
        </div>
        <Card>
          <CardHeader title="Documenti, pagamenti, referral e firma" description="Tab operative principali del dettaglio preventivo" />
          <div className="grid gap-5">
            <DataTable headers={["Documento", "Tipo", "Stato", "Hash"]} rows={quoteDocuments.map((document) => [document.name, document.type, <Badge key={document.id} tone="blue">{document.status}</Badge>, document.hash])} />
            <DataTable headers={["Pagamento", "Importo", "Stato", "Provider"]} rows={quotePayments.map((payment) => [payment.id, formatCurrency(payment.amount), <Badge key={payment.id} tone={payment.status === "CAPTURED" ? "green" : "amber"}>{payment.status}</Badge>, payment.providerPaymentId])} />
            <DataTable headers={["Referral", "Stato", "Priorita", "Motivo"]} rows={quoteReferral.map((referral) => [referral.id, <Badge key={referral.id} tone={referral.status === "APPROVED" ? "green" : "amber"}>{referral.status}</Badge>, referral.priority, referral.reasons.map((reason) => reason.label).join(", ")])} />
            <DataTable headers={["Firma", "Polizza", "Stato", "Canale"]} rows={quoteSignatures.map((signature) => [signature.id, signature.policyId, <Badge key={signature.id} tone={signature.status === "SIGNED" ? "green" : "blue"}>{signature.status}</Badge>, signature.otpChannel])} />
          </div>
        </Card>
        <Card>
          <CardHeader title="Audit" description="Eventi critici collegati al preventivo" />
          <DataTable headers={["Azione", "Entita", "Rischio", "Timestamp"]} rows={quoteAudit.map((log) => [log.action, `${log.entityType} ${log.entityId}`, <Badge key={log.id} tone={log.riskLevel === "HIGH" ? "amber" : "blue"}>{log.riskLevel}</Badge>, log.timestamp])} />
        </Card>
      </div>
    </AppShell>
  );
}
