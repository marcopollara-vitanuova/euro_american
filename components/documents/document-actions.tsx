"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function DocumentSignedUrlButton({ documentId }: { documentId: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    const response = await fetch(`/api/documents/${documentId}/signed-url`, { method: "POST" });
    setLoading(false);
    if (!response.ok) return;
    const payload = await response.json();
    setUrl(payload.url);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" variant="outline" onClick={generate} disabled={loading}>{loading ? "Genero..." : "Signed URL"}</Button>
      {url ? <span className="text-xs font-semibold text-slate-700">{url}</span> : null}
    </div>
  );
}
