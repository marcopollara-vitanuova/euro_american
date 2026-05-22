import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { DataTable } from "@/components/tables/data-table";
import { Badge } from "@/components/ui/badge";
import { customers, products, quotes } from "@/lib/demo/data";
import { formatCurrency } from "@/lib/utils";
export default function QuotesPage() { return <AppShell title="Preventivi" breadcrumb="Portale distributore / preventivi"><DataTable headers={["Preventivo","Cliente","Prodotto","Stato","Premio"]} rows={quotes.map((q) => [<Link key={q.id} className="font-semibold text-teal-700" href={`/quotes/${q.id}`}>{q.id}</Link>, customers.find((c) => c.id === q.customerId)?.displayName, products.find((p) => p.id === q.productId)?.name, <Badge key={q.id} tone={q.status.includes("REFERRAL") ? "amber" : q.status === "DECLINED" ? "red" : "green"}>{q.status}</Badge>, formatCurrency(q.grossPremium)])} /></AppShell>; }
