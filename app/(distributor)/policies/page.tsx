import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { DataTable } from "@/components/tables/data-table";
import { Badge } from "@/components/ui/badge";
import { policies } from "@/lib/demo/data";
export default function Page() { return <AppShell title="Polizze" breadcrumb="Portale distributore / policies"><DataTable headers={["ID","Stato","Dettaglio"]} rows={ policies.map((item) => [item.id, <Badge key={item.id} tone="blue">{item.status}</Badge>, <Link key={item.id} className="text-teal-700" href={`/policies/${item.id}`}>Apri</Link>]) } /></AppShell>; }
