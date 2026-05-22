import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const user = await getCurrentUser();
  return <main className="min-h-screen bg-slate-950 p-8 text-white"><section className="mx-auto flex min-h-[80vh] max-w-5xl flex-col justify-center"><p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-teal-300">Axieme MGA Platform</p><h1 className="max-w-4xl text-5xl font-black tracking-tight md:text-7xl">InsurTech configurable platform for MGA underwriting operations.</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">MVP navigabile con auth demo, RBAC, tenant segregation, questionari dinamici, pricing/rules engine, referral workflow, audit log e predisposizione GCP.</p><div className="mt-8 flex flex-wrap gap-3"><Button asChild size="lg"><Link href={user ? "/dashboard" : "/login"}>{user ? "Apri dashboard" : "Accedi alla demo"}</Link></Button><Button asChild variant="outline" size="lg"><Link href="/admin/dashboard">Backend MGA</Link></Button></div></section></main>;
}
