import Link from "next/link";
import { Building2, ShieldCheck, Sparkles } from "lucide-react";

type ShellArea = "admin" | "distributor";

const distributorGroups = [
  { title: "Oggi", links: [["Dashboard", "/dashboard"], ["Nuovo preventivo", "/quotes/new"]] },
  { title: "Portafoglio", links: [["Clienti", "/customers"], ["Preventivi", "/quotes"], ["Referral", "/referrals"], ["Polizze", "/policies"]] },
  { title: "Back office", links: [["Rinnovi", "/renewals"], ["Estratti conto", "/statements"], ["Documenti", "/documents"]] },
];

const adminGroups = [
  { title: "Control room", links: [["Dashboard MGA", "/admin/dashboard"], ["Referral queue", "/admin/referrals"], ["Audit log", "/admin/audit-logs"], ["Incidenti", "/admin/incidents"]] },
  { title: "Configurazione prodotto", links: [["Prodotti", "/admin/products"], ["Questionari", "/admin/questionnaires"], ["Pricing", "/admin/pricing"], ["Regole assuntive", "/admin/rules"], ["Template", "/admin/templates"]] },
  { title: "Rete e governance", links: [["Distributori", "/admin/distributors"], ["Utenti", "/admin/users"], ["Fornitori ICT", "/admin/third-party-providers"], ["Change requests", "/admin/change-requests"], ["Compliance", "/admin/compliance"], ["Security", "/admin/security"]] },
  { title: "Rendicontazione", links: [["Bordereaux", "/admin/bordereaux"], ["Estratti conto", "/admin/statements"], ["Documenti", "/admin/documents"]] },
];

export function Sidebar({ area }: { area: ShellArea }) {
  const isAdmin = area === "admin";
  const groups = isAdmin ? adminGroups : distributorGroups;
  const Icon = isAdmin ? Building2 : Sparkles;
  return (
    <aside className="sidebar" aria-label={isAdmin ? "Navigazione Console MGA" : "Navigazione Portale distributore"}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">
          <Icon className="h-6 w-6" aria-hidden />
        </div>
        <div>
          <div className="font-bold text-white">{isAdmin ? "Console MGA" : "Portale Distributore"}</div>
          <div className="text-xs text-slate-300">Axieme MGA Platform</div>
        </div>
      </div>

      <div className="sidebar-context">
        <ShieldCheck className="h-4 w-4" aria-hidden />
        <span>{isAdmin ? "Ambiente configurazione e controllo" : "Operativita commerciale e post vendita"}</span>
      </div>

      <nav className="sidebar-nav">
        {groups.map((group, index) => (
          <details key={group.title} className="nav-group" open={index < 2}>
            <summary>{group.title}</summary>
            <div className="nav-links">
              {group.links.map(([label, href]) => (
                <Link key={href} href={href}>
                  {label}
                </Link>
              ))}
            </div>
          </details>
        ))}
      </nav>
    </aside>
  );
}
