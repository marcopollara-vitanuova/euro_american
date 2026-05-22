import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { DataTable } from "@/components/tables/data-table";
import { Badge } from "@/components/ui/badge";
import { distributors } from "@/lib/demo/data";
export default function Page() { const items = distributors; return <AppShell title="Distributori" breadcrumb="Backend MGA / distributors"><DataTable headers={["ID/Nome","Stato/Tipo","Azioni"]} rows={items.map((item: any) => [item.name ?? item.title ?? item.id, <Badge key={item.id} tone="blue">{item.status ?? item.role ?? item.lineOfBusiness ?? item.severity ?? "ACTIVE"}</Badge>, <Link key={item.id} className="text-teal-700" href={`/admin/distributors/${item.id}`}>Apri</Link>])} /></AppShell>; }
