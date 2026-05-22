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
    router.push(search.get("next") ?? "/dashboard");
    router.refresh();
  }

  return <form onSubmit={submit} className="space-y-4"><div><label className="text-sm font-semibold">Email o username</label><input className="input mt-1" value={identifier} onChange={(event) => setIdentifier(event.target.value)} /></div><div><label className="text-sm font-semibold">Password</label><input className="input mt-1" type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></div>{error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}<Button className="w-full" disabled={loading}>{loading ? "Accesso..." : "Accedi"}</Button><div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600"><strong>Demo:</strong> broker@axieme.test / Password123!<br />admin.mga@axieme.test / Password123!<br />underwriter@axieme.test / Password123!</div></form>;
}
