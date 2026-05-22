import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { DataTable } from "@/components/tables/data-table";
import { Badge } from "@/components/ui/badge";
import { referrals } from "@/lib/demo/data";
export default function Page() { return <AppShell title="Referral" breadcrumb="Portale distributore / referrals"><DataTable headers={["ID","Stato","Dettaglio"]} rows={ referrals.map((item) => [item.id, <Badge key={item.id} tone="blue">{item.status}</Badge>, <Link key={item.id} className="text-teal-700" href={`/referrals/${item.id}`}>Apri</Link>]) } /></AppShell>; }
