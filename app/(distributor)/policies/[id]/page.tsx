import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/tables/data-table";
import { demoDocuments, demoPayments, demoSignatureRequests, policies, products, customers, quotes } from "@/lib/demo/data";
import { formatCurrency } from "@/lib/utils";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const policy = policies.find((entry) => entry.id === id);
  if (!policy) notFound();
  const quote = quotes.find((item) => item.id === policy.quoteId);
  const customer = customers.find((item) => item.id === policy.customerId);
  const product = products.find((item) => item.id === policy.productId);
  const documents = demoDocuments.filter((document) => document.entityId === policy.id || document.entityId === policy.quoteId);
  const payments = demoPayments.filter((payment) => payment.quoteId === policy.quoteId);
  const signatures = demoSignatureRequests.filter((signature) => signature.policyId === policy.id);

  return (
    <AppShell title={`Polizza ${policy.policyNumber}`} breadcrumb="Polizze / dettaglio">
      <div className="grid gap-5">
        <Card>
          <CardHeader title="Riepilogo polizza" action={<Badge tone={policy.status === "ACTIVE" ? "green" : "blue"}>{policy.status}</Badge>} />
          <div className="grid gap-3 md:grid-cols-4">
            <p><strong>Cliente</strong><br />{customer?.displayName}</p>
            <p><strong>Prodotto</strong><br />{product?.name}</p>
            <p><strong>Periodo</strong><br />{policy.inceptionDate} - {policy.expiryDate}</p>
            <p><strong>Premio</strong><br />{formatCurrency(policy.grossPremium)}</p>
          </div>
        </Card>
        <div className="data-grid">
          <Card>
            <CardHeader title="Garanzie e origine" description="Preventivo convertito in polizza" />
            <div className="metric-row"><span>Preventivo</span><strong>{quote?.id ?? "-"}</strong></div>
            <div className="metric-row"><span>Massimale</span><strong>{formatCurrency(quote?.selectedLimit)}</strong></div>
            <div className="metric-row"><span>Franchigia</span><strong>{formatCurrency(quote?.selectedDeductible)}</strong></div>
          </Card>
          <Card>
            <CardHeader title="Firma e rinnovi" description="Predisposizione firma OTP e rinnovo" />
            <DataTable headers={["Firma", "Stato", "Canale", "Scadenza"]} rows={signatures.map((signature) => [signature.id, <Badge key={signature.id} tone={signature.status === "SIGNED" ? "green" : "blue"}>{signature.status}</Badge>, signature.otpChannel, signature.expiresAt])} />
          </Card>
        </div>
        <Card>
          <CardHeader title="Documenti e pagamenti" description="Archivio operativo associato alla polizza" />
          <div className="grid gap-5">
            <DataTable headers={["Documento", "Tipo", "Stato", "Hash"]} rows={documents.map((document) => [document.name, document.type, <Badge key={document.id} tone="blue">{document.status}</Badge>, document.hash])} />
            <DataTable headers={["Pagamento", "Importo", "Stato", "Provider"]} rows={payments.map((payment) => [payment.id, formatCurrency(payment.amount), <Badge key={payment.id} tone={payment.status === "CAPTURED" ? "green" : "amber"}>{payment.status}</Badge>, payment.providerPaymentId])} />
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
