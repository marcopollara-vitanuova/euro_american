"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function CustomerCreateForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: form.get("displayName"),
        email: form.get("email"),
        taxCode: form.get("taxCode"),
        type: form.get("type"),
      }),
    });
    setLoading(false);
    if (!response.ok) {
      setMessage("Cliente non creato: verifica email, codice fiscale e campi obbligatori.");
      return;
    }
    setMessage("Cliente creato. La lista e' stata aggiornata nella sessione demo.");
    event.currentTarget.reset();
    router.refresh();
  }

  if (!open) return <Button onClick={() => setOpen(true)}>Nuovo cliente</Button>;

  return (
    <form className="card mt-4 grid gap-4 p-5" onSubmit={submit}>
      <div className="form-grid">
        <label className="font-bold text-slate-900">Nome / ragione sociale<input name="displayName" className="input mt-1" required minLength={2} /></label>
        <label className="font-bold text-slate-900">Email<input name="email" className="input mt-1" type="email" required /></label>
        <label className="font-bold text-slate-900">Codice fiscale / P.IVA<input name="taxCode" className="input mt-1" required minLength={6} /></label>
        <label className="font-bold text-slate-900">Tipo cliente<select name="type" className="input mt-1" defaultValue="COMPANY"><option value="COMPANY">Persona giuridica</option><option value="PROFESSIONAL">Libero professionista</option><option value="PERSON">Persona fisica</option><option value="SOLE_PROPRIETOR">Ditta individuale</option><option value="ASSOCIATION">Ente / associazione</option></select></label>
      </div>
      {message ? <p className="rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-800" role="status">{message}</p> : null}
      <div className="flex flex-wrap gap-3">
        <Button disabled={loading}>{loading ? "Creazione..." : "Crea cliente"}</Button>
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Annulla</Button>
      </div>
    </form>
  );
}
