import type { ReactNode } from "react";
import { getCurrentUser } from "@/lib/auth/session";
import { Sidebar } from "./navigation";
import { Button } from "@/components/ui/button";

const adminRoles = new Set(["SUPER_ADMIN_AXIEME", "ADMIN_MGA", "UNDERWRITER", "BACK_OFFICE_MGA", "AUDITOR"]);

function resolveArea(title: string, breadcrumb?: string) {
  return breadcrumb?.startsWith("Backend MGA") || title.toLowerCase().includes("mga") ? "admin" : "distributor";
}

export async function AppShell({ children, title, breadcrumb }: { children: ReactNode; title: string; breadcrumb?: string }) {
  const user = await getCurrentUser();
  const area = resolveArea(title, breadcrumb);
  const isAdminArea = area === "admin";
  const isAuthorized = !isAdminArea || (user ? adminRoles.has(user.role) : false);

  return (
    <div className="enterprise-shell" data-area={area}>
      <Sidebar area={area} />
      <main>
        <header className="topbar">
          <div>
            <p className="eyebrow-text">{breadcrumb ?? "Axieme MGA Platform"}</p>
            <h1 className="page-title">{title}</h1>
          </div>
          <div className="user-cluster">
            <div className="text-right">
              <div className="font-semibold">{user?.name ?? "Guest"}</div>
              <div className="text-slate-600">{user?.role ?? "NO_SESSION"} · Axieme Demo MGA</div>
            </div>
            <form action="/api/auth/logout" method="post">
              <Button variant="outline" size="sm">Logout</Button>
            </form>
          </div>
        </header>
        <section className="content">
          {isAuthorized ? children : (
            <section className="card max-w-2xl p-6" role="alert">
              <p className="eyebrow-text">Accesso non autorizzato</p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">Questa console e' riservata ai ruoli MGA.</h2>
              <p className="mt-3 text-slate-700">Usa il portale distributore per clienti, preventivi, referral e documenti della tua rete.</p>
            </section>
          )}
        </section>
      </main>
    </div>
  );
}
