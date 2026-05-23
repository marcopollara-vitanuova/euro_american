import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { DataTable } from "@/components/tables/data-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { CustomerCreateForm } from "@/components/customer/customer-create-form";
import { customers } from "@/lib/demo/data";

export default function CustomersPage() {
  return (
    <AppShell title="Clienti" breadcrumb="Portale distributore / clienti">
      <Card>
        <CardHeader title="Anagrafiche clienti" description="Ricerca, creazione e controllo consensi privacy in runtime demo." />
        <CustomerCreateForm />
        <div className="mt-5">
        <DataTable headers={["Cliente", "Tipo", "CF/P.IVA", "Email", "Privacy"]} rows={customers.map((customer) => [
          <Link key={customer.id} className="font-semibold text-teal-700" href={`/customers/${customer.id}`}>{customer.displayName}</Link>,
          customer.type,
          customer.vatNumber ?? customer.taxCode,
          customer.email,
          <Badge key={customer.id} tone={customer.privacyConsent ? "green" : "amber"}>{customer.privacyConsent ? "Consenso" : "Da acquisire"}</Badge>,
        ])} />
        </div>
      </Card>
    </AppShell>
  );
}
