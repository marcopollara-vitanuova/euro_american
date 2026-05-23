"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const actions = [
  { path: "assign", label: "Assegna a me", status: "ASSIGNED" },
  { path: "request-info", label: "Richiedi integrazione", status: "INFO_REQUESTED" },
  { path: "approve", label: "Approva", status: "APPROVED" },
  { path: "reject", label: "Respingi", status: "REJECTED" },
];

export function ReferralActions({ referralId, initialStatus }: { referralId: string; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  async function run(path: string, nextStatus: string) {
    setLoading(path);
    const response = await fetch(`/api/admin/referrals/${referralId}/${path}`, { method: "POST" });
    setLoading(null);
    if (!response.ok) {
      setMessage("Azione non completata.");
      return;
    }
    const referral = await response.json();
    setStatus(referral.status ?? nextStatus);
    setMessage(`Referral aggiornato a ${referral.status ?? nextStatus}. Audit runtime registrato.`);
  }

  return (
    <section className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-950">Decisione underwriter</h2>
          <p className="mt-1 text-sm text-slate-700">Workflow operativo collegato alle API referral.</p>
        </div>
        <Badge tone={status === "APPROVED" ? "green" : status === "REJECTED" ? "red" : "amber"}>{status}</Badge>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        {actions.map((action) => (
          <Button key={action.path} variant={action.path === "reject" ? "destructive" : action.path === "approve" ? "default" : "outline"} disabled={loading === action.path} onClick={() => run(action.path, action.status)}>
            {loading === action.path ? "Aggiornamento..." : action.label}
          </Button>
        ))}
      </div>
      {message ? <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-800" role="status">{message}</p> : null}
    </section>
  );
}
