"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Event = { label: string; detail: string; tone: "green" | "amber" | "blue" | "red" };

export function QuoteActions({ quoteId, initialPolicyId }: { quoteId: string; initialPolicyId?: string }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paymentCaptured, setPaymentCaptured] = useState(false);
  const [policyId, setPolicyId] = useState<string | null>(initialPolicyId ?? null);
  const [loading, setLoading] = useState<string | null>(null);

  async function run(label: string, action: () => Promise<Event>) {
    setLoading(label);
    try {
      const event = await action();
      setEvents((current) => [event, ...current]);
    } catch {
      setEvents((current) => [{ label: "Errore", detail: "Azione non completata nel runtime demo.", tone: "red" }, ...current]);
    } finally {
      setLoading(null);
    }
  }

  return (
    <section className="card p-5">
      <h2 className="text-xl font-black text-slate-950">Azioni operative</h2>
      <p className="mt-1 text-sm text-slate-700">Queste azioni chiamano le API mock e aggiornano documenti, pagamenti, polizza, firma e audit runtime.</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button disabled={loading === "proposal"} onClick={() => run("proposal", async () => {
          const response = await fetch(`/api/quotes/${quoteId}/generate-proposal`, { method: "POST" });
          if (!response.ok) throw new Error("proposal");
          const payload = await response.json();
          return { label: "Proposta PDF", detail: `${payload.document.name} generata`, tone: "green" };
        })}>Genera proposta</Button>
        <Button variant="secondary" disabled={loading === "payment"} onClick={() => run("payment", async () => {
          const response = await fetch(`/api/quotes/${quoteId}/payment-link`, { method: "POST" });
          if (!response.ok) throw new Error("payment");
          const payment = await response.json();
          setPaymentId(payment.id);
          return { label: "Payment link", detail: `${payment.id} generato per ${payment.amount} EUR`, tone: "blue" };
        })}>Payment link</Button>
        <Button variant="outline" disabled={!paymentId || loading === "capture"} onClick={() => run("capture", async () => {
          const response = await fetch(`/api/payments/${paymentId}/simulate-success`, { method: "POST" });
          if (!response.ok) throw new Error("capture");
          setPaymentCaptured(true);
          return { label: "Pagamento acquisito", detail: `${paymentId} marcato CAPTURED`, tone: "green" };
        })}>Simula pagamento</Button>
        <Button variant="outline" disabled={!paymentCaptured || loading === "policy"} onClick={() => run("policy", async () => {
          const response = await fetch(`/api/quotes/${quoteId}/issue-policy`, { method: "POST" });
          if (!response.ok) throw new Error("policy");
          const policy = await response.json();
          setPolicyId(policy.id);
          return { label: "Polizza emessa", detail: `${policy.policyNumber} creata`, tone: "green" };
        })}>Emetti polizza</Button>
        <Button variant="outline" disabled={!policyId || loading === "signature"} onClick={() => run("signature", async () => {
          const response = await fetch(`/api/policies/${policyId}/signature-request`, { method: "POST" });
          if (!response.ok) throw new Error("signature");
          const signature = await response.json();
          return { label: "Firma OTP", detail: `${signature.id} inviata via ${signature.otpChannel}`, tone: "green" };
        })}>Invia firma OTP</Button>
      </div>
      {events.length ? (
        <div className="mt-5 grid gap-2" aria-live="polite">
          {events.map((event, index) => (
            <div className="task-item" key={`${event.label}-${index}`}>
              <span className="task-number">{index + 1}</span>
              <span><strong>{event.label}</strong><span className="block text-sm text-slate-700">{event.detail}</span></span>
              <Badge tone={event.tone}>OK</Badge>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
