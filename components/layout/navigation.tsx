import Link from "next/link";
import { ShieldCheck } from "lucide-react";

const distributorLinks = [
  ["Dashboard", "/dashboard"], ["Clienti", "/customers"], ["Nuovo preventivo", "/quotes/new"], ["Preventivi", "/quotes"], ["Referral", "/referrals"], ["Polizze", "/policies"], ["Rinnovi", "/renewals"], ["Estratti conto", "/statements"], ["Documenti", "/documents"],
];
const adminLinks = [
  ["MGA dashboard", "/admin/dashboard"], ["Distributori", "/admin/distributors"], ["Utenti", "/admin/users"], ["Prodotti", "/admin/products"], ["Questionari", "/admin/questionnaires"], ["Pricing", "/admin/pricing"], ["Rules", "/admin/rules"], ["Referral", "/admin/referrals"], ["Template", "/admin/templates"], ["Bordereaux", "/admin/bordereaux"], ["Audit log", "/admin/audit-logs"], ["Security", "/admin/security"], ["Compliance", "/admin/compliance"], ["Incidenti", "/admin/incidents"], ["Fornitori ICT", "/admin/third-party-providers"], ["Change requests", "/admin/change-requests"],
];

export function Sidebar() {
  return <aside className="sidebar"><div className="mb-7 flex items-center gap-3"><ShieldCheck className="h-8 w-8 text-teal-300" /><div><div className="font-bold text-white">Axieme MGA</div><div className="text-xs text-slate-400">InsurTech Platform</div></div></div><div className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500">Portale distributore</div><nav className="space-y-1">{distributorLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav><div className="mb-4 mt-7 text-xs font-bold uppercase tracking-widest text-slate-500">Backend MGA</div><nav className="space-y-1">{adminLinks.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav></aside>;
}
