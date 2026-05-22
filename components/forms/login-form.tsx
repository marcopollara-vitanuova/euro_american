"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [identifier, setIdentifier] = useState("broker@axieme.test");
  const [password, setPassword] = useState("Password123!");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ identifier, password }) });
    setLoading(false);
    if (!response.ok) {
      setError("Credenziali non valide o account bloccato.");
      return;
    }
    const payload = await response.json();
    const role = payload.user?.role as string | undefined;
    const isMgaRole = role ? ["SUPER_ADMIN_AXIEME", "ADMIN_MGA", "UNDERWRITER", "BACK_OFFICE_MGA", "AUDITOR"].includes(role) : false;
    router.push(search.get("next") ?? (isMgaRole ? "/admin/dashboard" : "/dashboard"));
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="text-sm font-bold text-slate-900" htmlFor="identifier">Email o username</label>
        <input id="identifier" className="input mt-1" autoComplete="username" value={identifier} onChange={(event) => setIdentifier(event.target.value)} />
      </div>
      <div>
        <label className="text-sm font-bold text-slate-900" htmlFor="password">Password</label>
        <input id="password" className="input mt-1" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </div>
      {error ? <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800" role="alert">{error}</p> : null}
      <Button className="w-full" disabled={loading}>{loading ? "Accesso in corso..." : "Accedi"}</Button>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-700">
        <strong>Profili demo:</strong><br />
        Console MGA: admin.mga@axieme.test / Password123!<br />
        Underwriter: underwriter@axieme.test / Password123!<br />
        Portale broker: broker@axieme.test / Password123!
      </div>
    </form>
  );
}
