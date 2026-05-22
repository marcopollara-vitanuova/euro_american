import { AppShell } from "@/components/layout/app-shell";
import { QuoteWizard } from "@/components/quote-wizard/quote-wizard";
import { customers, products } from "@/lib/demo/data";

export default function NewQuotePage() {
  return <AppShell title="Nuovo preventivo" breadcrumb="Portale distributore / quote wizard"><QuoteWizard customers={customers} products={products} /></AppShell>;
}
