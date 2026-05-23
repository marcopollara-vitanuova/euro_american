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
    <div className="grid max-w-[24rem] gap-2">
      <Button size="sm" variant="outline" onClick={generate} disabled={loading}>{loading ? "Genero..." : "Signed URL"}</Button>
      {url ? <code className="block max-w-full break-all rounded-lg bg-slate-50 p-2 text-[11px] font-semibold leading-4 text-slate-700">{url}</code> : null}
    </div>
  );
}
