import { Suspense } from "react";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6"><section className="card w-full max-w-md p-8"><p className="text-sm font-bold uppercase tracking-widest text-teal-700">Axieme MGA Platform</p><h1 className="mt-2 text-3xl font-black text-slate-950">Login sicuro</h1><p className="mt-2 text-sm text-slate-500">Accesso demo con email/username e password. MFA predisposto per ruoli admin.</p><div className="mt-6"><Suspense><LoginForm /></Suspense></div></section></main>;
}
