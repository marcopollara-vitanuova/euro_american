import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const user = await getCurrentUser();
  const isAdmin = user ? ["SUPER_ADMIN_AXIEME", "ADMIN_MGA", "UNDERWRITER", "BACK_OFFICE_MGA", "AUDITOR"].includes(user.role) : false;
  return (
    <main className="hero-login p-8 text-white">
      <section className="mx-auto flex min-h-[80vh] max-w-5xl flex-col justify-center">
        <p className="mb-4 text-sm font-black uppercase tracking-[0.3em] text-cyan-200">Axieme MGA Platform</p>
        <h1 className="max-w-4xl text-5xl font-black tracking-tight md:text-7xl">Piattaforma InsurTech per MGA e rete distributiva.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">Due esperienze distinte: Console MGA per governance e configurazione, Portale Distributore per clienti, preventivi, referral e documenti.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg"><Link href={user ? (isAdmin ? "/admin/dashboard" : "/dashboard") : "/login"}>{user ? "Apri area operativa" : "Accedi alla demo"}</Link></Button>
          <Button asChild variant="outline" size="lg"><Link href="/login">Scegli profilo demo</Link></Button>
        </div>
      </section>
    </main>
  );
}
