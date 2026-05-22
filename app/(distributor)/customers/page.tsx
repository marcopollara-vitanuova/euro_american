import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { DataTable } from "@/components/tables/data-table";
import { Badge } from "@/components/ui/badge";
import { customers } from "@/lib/demo/data";
export default function CustomersPage() { return <AppShell title="Clienti" breadcrumb="Portale distributore / clienti"><DataTable headers={["Cliente","Tipo","CF/P.IVA","Email","Privacy"]} rows={customers.map((c) => [<Link key={c.id} className="font-semibold text-teal-700" href={`/customers/${c.id}`}>{c.displayName}</Link>, c.type, c.vatNumber ?? c.taxCode, c.email, <Badge key={c.id} tone={c.privacyConsent ? "green" : "amber"}>{c.privacyConsent ? "Consenso" : "Da acquisire"}</Badge>])} /></AppShell>; }
