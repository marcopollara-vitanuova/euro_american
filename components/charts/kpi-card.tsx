import { Card } from "@/components/ui/card";
export function KpiCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return <Card><p className="text-sm font-semibold text-slate-700">{label}</p><div className="mt-2 text-3xl font-black text-slate-950">{value}</div>{hint ? <p className="mt-2 text-xs font-medium text-slate-600">{hint}</p> : null}</Card>;
}
