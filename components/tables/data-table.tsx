import type { ReactNode } from "react";
export function DataTable({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm">
      <table className="table">
        <thead><tr>{headers.map((header) => <th scope="col" key={header}>{header}</th>)}</tr></thead>
        <tbody>
          {rows.length ? rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>) : (
            <tr><td colSpan={headers.length} className="text-center text-slate-700">Nessun elemento disponibile per i filtri correnti.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
