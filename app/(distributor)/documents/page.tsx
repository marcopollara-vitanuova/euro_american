import { AppShell } from "@/components/layout/app-shell";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/tables/data-table";
import { DocumentSignedUrlButton } from "@/components/documents/document-actions";
import { demoDocuments } from "@/lib/demo/data";

export default function Page() {
  return (
    <AppShell title="Documenti" breadcrumb="Portale distributore / documents">
      <Card>
        <CardHeader title="Archivio documenti" description="Documenti generati, firmati o archiviati con signed URL mock autorizzata." />
        <DataTable headers={["Documento", "Tipo", "Entita", "Stato", "Download autorizzato"]} rows={demoDocuments.map((document) => [
          <span className="font-semibold" key={document.id}>{document.name}</span>,
          document.type,
          `${document.entityType} ${document.entityId}`,
          <Badge key={document.id} tone={document.status === "ARCHIVED" ? "green" : "blue"}>{document.status}</Badge>,
          <DocumentSignedUrlButton key={document.id} documentId={document.id} />,
        ])} />
      </Card>
    </AppShell>
  );
}
