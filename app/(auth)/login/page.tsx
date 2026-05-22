import { Suspense } from "react";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <main className="hero-login grid place-items-center p-6">
      <section className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_.9fr]">
        <div className="flex flex-col justify-center">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-cyan-200">Axieme MGA Platform</p>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight md:text-6xl">Console operativa per MGA, underwriter e rete distributiva.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">
            Demo end-to-end con ruoli separati, pricing tracciato, referral, documenti mock, audit e controlli DORA/NIS2/GDPR readiness.
          </p>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {["MGA control room", "Broker portal", "Audit by design"].map((item) => (
              <div className="login-proof rounded-2xl p-4 text-sm font-semibold" key={item}>{item}</div>
            ))}
          </div>
        </div>
        <section className="login-panel rounded-[28px] p-8" aria-labelledby="login-title">
          <p className="eyebrow-text text-teal-800">Accesso demo</p>
          <h2 id="login-title" className="mt-2 text-3xl font-black text-slate-950">Login sicuro</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">Scegli un profilo demo. Gli admin entrano nella Console MGA, broker e collaboratori nel Portale distributore.</p>
          <div className="mt-6">
            <Suspense>
              <LoginForm />
            </Suspense>
          </div>
        </section>
      </section>
    </main>
  );
}
