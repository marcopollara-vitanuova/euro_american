"use client";

import { useMemo, useState } from "react";
import type { Customer, Product, PricingResult } from "@/lib/demo/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const steps = ["Cliente e prodotto", "Rischio e garanzie", "Quotazione", "Emissione"];

type WizardEvent = { label: string; detail: string; tone: "green" | "amber" | "blue" | "red" };

export function QuoteWizard({ products, customers }: { products: Product[]; customers: Customer[] }) {
  const [step, setStep] = useState(0);
  const [productId, setProductId] = useState(products[0].id);
  const [customerId, setCustomerId] = useState(customers[0].id);
  const [answers, setAnswers] = useState({ turnover_total: 180000, limit_of_indemnity: 1000000, claims_last_5_years: 0, company_refused: false, territory: "Italia", special_activity_turnover: 15000 });
  const [quoteId, setQuoteId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paymentCaptured, setPaymentCaptured] = useState(false);
  const [policyId, setPolicyId] = useState<string | null>(null);
  const [pricingResult, setPricingResult] = useState<PricingResult | null>(null);
  const [events, setEvents] = useState<WizardEvent[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const product = products.find((item) => item.id === productId)!;
  const customer = customers.find((item) => item.id === customerId)!;
  const previewResult = useMemo<PricingResult>(() => {
    const turnover = Number(answers.turnover_total);
    const limitFactor = Math.max(1, Number(answers.limit_of_indemnity) / 1000000);
    const netPremium = Math.round(Math.max(450, turnover * 0.006 * limitFactor) * 100) / 100;
    const taxes = Math.round(netPremium * 0.22 * 100) / 100;
    const territory = String(answers.territory);
    const hasReferral = Number(answers.claims_last_5_years) > 0 || answers.company_refused === true || ["USA", "CANADA"].includes(territory);
    return {
      resultType: hasReferral ? "REFERRAL" : "QUOTABLE",
      netPremium: hasReferral ? null : netPremium,
      taxes: hasReferral ? null : taxes,
      grossPremium: hasReferral ? null : Math.round((netPremium + taxes) * 100) / 100,
      currency: "EUR",
      deductible: product.deductibles[0],
      rulesApplied: ["PREVIEW_TURNOVER_RATE", "LIMIT_FACTOR", hasReferral ? "UNDERWRITING_REVIEW" : "AUTO_QUOTABLE"],
      warnings: hasReferral ? ["Anteprima: serve valutazione underwriter"] : [],
      referralReasons: hasReferral ? [{ code: "PREVIEW_REFERRAL", label: "Dati assuntivi da verificare prima dell'emissione" }] : [],
    };
  }, [answers, product.deductibles]);

  function updateAnswer(key: string, value: string | number | boolean) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  async function runAction(label: string, action: () => Promise<WizardEvent>) {
    setLoading(label);
    try {
      const event = await action();
      setEvents((current) => [event, ...current]);
    } catch {
      setEvents((current) => [{ label: "Errore operativo", detail: "Azione non completata. Verifica dati obbligatori e riprova.", tone: "red" }, ...current]);
    } finally {
      setLoading(null);
    }
  }

  async function createAndCalculateQuote() {
    await runAction("calculate", async () => {
      const selectedDeductible = product.deductibles[0];
      const createResponse = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, productId, selectedLimit: Number(answers.limit_of_indemnity), selectedDeductible }),
      });
      if (!createResponse.ok) throw new Error("quote-create-failed");
      const quote = await createResponse.json();
      setQuoteId(quote.id);
      await fetch(`/api/quotes/${quote.id}/answers`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(answers) });
      const calcResponse = await fetch(`/api/quotes/${quote.id}/calculate-price`, { method: "POST" });
      if (!calcResponse.ok) throw new Error("quote-calculate-failed");
      const calculated = await calcResponse.json();
      setPricingResult(calculated.result);
      return { label: `Preventivo ${quote.id}`, detail: `Calcolo completato: ${calculated.result.resultType}`, tone: calculated.result.resultType === "QUOTABLE" ? "green" : "amber" };
    });
  }

  async function callQuoteAction(path: string, success: (payload: any) => WizardEvent) {
    if (!quoteId) return;
    await runAction(path, async () => {
      const response = await fetch(`/api/quotes/${quoteId}/${path}`, { method: "POST" });
      if (!response.ok) throw new Error(path);
      const payload = await response.json();
      if (path === "payment-link") setPaymentId(payload.id);
      if (path === "issue-policy") setPolicyId(payload.id);
      return success(payload);
    });
  }

  async function callPath(path: string, success: (payload: any) => WizardEvent) {
    await runAction(path, async () => {
      const response = await fetch(path, { method: "POST" });
      if (!response.ok) throw new Error(path);
      return success(await response.json());
    });
  }

  const displayedResult = pricingResult ?? previewResult;

  return (
    <div className="space-y-5">
      <div className="stepper" aria-label="Step preventivo">
        {steps.map((label, index) => (
          <button key={label} type="button" className={`step ${index === step ? "step-active" : index < step ? "step-done" : ""}`} onClick={() => setStep(index)}>
            {index + 1}. {label}
          </button>
        ))}
      </div>

      <div className="card p-6">
        {step === 0 && (
          <div>
            <p className="eyebrow-text">Step 1</p>
            <h2 className="text-2xl font-black text-slate-950">Cliente e prodotto in un solo passaggio</h2>
            <div className="form-grid mt-4">
              <label className="font-bold text-slate-900">Cliente
                <select className="input mt-1" value={customerId} onChange={(event) => setCustomerId(event.target.value)}>
                  {customers.map((item) => <option key={item.id} value={item.id}>{item.displayName}</option>)}
                </select>
              </label>
              <label className="font-bold text-slate-900">Prodotto
                <select className="input mt-1" value={productId} onChange={(event) => setProductId(event.target.value)}>
                  {products.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select>
              </label>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="card-soft p-4"><strong>{customer.displayName}</strong><p className="text-sm text-slate-700">{customer.email} · {customer.city}</p></div>
              <div className="card-soft p-4"><strong>{product.name}</strong><p className="text-sm text-slate-700">{product.target} · {product.carrier}</p></div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="eyebrow-text">Step 2</p>
            <h2 className="text-2xl font-black text-slate-950">Rischio, dichiarazioni e garanzie essenziali</h2>
            <div className="form-grid mt-4">
              <label className="font-bold text-slate-900">Fatturato totale<input className="input mt-1" type="number" value={Number(answers.turnover_total)} onChange={(event) => updateAnswer("turnover_total", Number(event.target.value))} /></label>
              <label className="font-bold text-slate-900">Massimale<select className="input mt-1" value={Number(answers.limit_of_indemnity)} onChange={(event) => updateAnswer("limit_of_indemnity", Number(event.target.value))}>{product.limits.map((limit) => <option key={limit} value={limit}>{formatCurrency(limit)}</option>)}</select></label>
              <label className="font-bold text-slate-900">Sinistri ultimi 5 anni<input className="input mt-1" type="number" value={Number(answers.claims_last_5_years)} onChange={(event) => updateAnswer("claims_last_5_years", Number(event.target.value))} /></label>
              <label className="font-bold text-slate-900">Territorio<select className="input mt-1" value={String(answers.territory)} onChange={(event) => updateAnswer("territory", event.target.value)}><option>Italia</option><option>UE</option><option>USA</option><option>CANADA</option></select></label>
              <label className="font-bold text-slate-900">Rifiuto precedente compagnia<select className="input mt-1" value={String(answers.company_refused)} onChange={(event) => updateAnswer("company_refused", event.target.value === "true")}><option value="false">No</option><option value="true">Si</option></select></label>
              <label className="font-bold text-slate-900">Fatturato attivita speciali<input className="input mt-1" type="number" value={Number(answers.special_activity_turnover)} onChange={(event) => updateAnswer("special_activity_turnover", Number(event.target.value))} /></label>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="eyebrow-text">Step 3</p>
            <h2 className="text-2xl font-black text-slate-950">Quotazione e regole assuntive</h2>
            <div className="mt-4 rounded-2xl bg-slate-50 p-5">
              <Badge tone={displayedResult.resultType === "QUOTABLE" ? "green" : displayedResult.resultType === "REFERRAL" ? "amber" : "red"}>{displayedResult.resultType}</Badge>
              <div className="mt-4 text-4xl font-black text-slate-950">{formatCurrency(displayedResult.grossPremium)}</div>
              <p className="mt-2 text-sm text-slate-700">Regole applicate: {displayedResult.rulesApplied.join(", ")}</p>
              {displayedResult.referralReasons.length ? <ul className="mt-3 text-sm font-semibold text-amber-800">{displayedResult.referralReasons.map((reason) => <li key={reason.code}>{reason.label}</li>)}</ul> : null}
            </div>
            <div className="mt-5"><Button onClick={createAndCalculateQuote} disabled={loading === "calculate"}>{loading === "calculate" ? "Calcolo in corso..." : "Crea preventivo e calcola"}</Button></div>
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="eyebrow-text">Step 4</p>
            <h2 className="text-2xl font-black text-slate-950">Proposta, pagamento ed emissione mock</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="card-soft p-4"><strong>Preventivo</strong><p>{quoteId ?? "Da creare"}</p></div>
              <div className="card-soft p-4"><strong>Cliente</strong><p>{customer.displayName}</p></div>
              <div className="card-soft p-4"><strong>Premio lordo</strong><p>{formatCurrency(displayedResult.grossPremium)}</p></div>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button disabled={!quoteId || loading === "generate-proposal"} onClick={() => callQuoteAction("generate-proposal", (payload) => ({ label: "Proposta PDF mock", detail: `${payload.document.name} generata`, tone: "green" }))}>Genera proposta</Button>
              <Button variant="secondary" disabled={!quoteId || loading === "payment-link"} onClick={() => callQuoteAction("payment-link", (payload) => ({ label: "Payment link mock", detail: `${payload.id} creato`, tone: "blue" }))}>Payment link</Button>
              <Button variant="outline" disabled={!paymentId || loading === `/api/payments/${paymentId}/simulate-success`} onClick={() => paymentId && callPath(`/api/payments/${paymentId}/simulate-success`, (payload) => { setPaymentCaptured(true); return { label: "Pagamento simulato", detail: `${payload.id} ${payload.status}`, tone: "green" }; })}>Simula pagamento</Button>
              <Button variant="outline" disabled={!quoteId || !paymentCaptured || loading === "issue-policy"} onClick={() => callQuoteAction("issue-policy", (payload) => ({ label: "Polizza emessa", detail: `${payload.policyNumber} creata`, tone: "green" }))}>Emetti polizza</Button>
              <Button variant="outline" disabled={!policyId || loading === `/api/policies/${policyId}/signature-request`} onClick={() => policyId && callPath(`/api/policies/${policyId}/signature-request`, (payload) => ({ label: "Firma OTP mock", detail: `${payload.id} inviata via ${payload.otpChannel}`, tone: "green" }))}>Firma OTP</Button>
            </div>
          </div>
        )}
      </div>

      {events.length ? (
        <section className="card p-5" aria-label="Eventi operativi wizard">
          <h3 className="text-lg font-black text-slate-950">Timeline operativa</h3>
          <div className="mt-3 grid gap-2">
            {events.map((event, index) => (
              <div className="task-item" key={`${event.label}-${index}`}>
                <span className="task-number">{index + 1}</span>
                <span><strong>{event.label}</strong><span className="block text-sm text-slate-700">{event.detail}</span></span>
                <Badge tone={event.tone}>OK</Badge>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="wizard-actions">
        <Button variant="outline" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>Indietro</Button>
        <Button disabled={step === steps.length - 1} onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))}>Avanti</Button>
      </div>
    </div>
  );
}
