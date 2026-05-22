import { Card } from "@/components/ui/card";
export function KpiCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return <Card><p className="text-sm text-slate-500">{label}</p><div className="mt-2 text-3xl font-bold text-slate-950">{value}</div>{hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}</Card>;
}
