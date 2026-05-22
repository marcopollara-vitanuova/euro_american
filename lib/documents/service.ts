import crypto from "node:crypto";
import { nanoid } from "nanoid";

export function generateMockPdf(entityId: string, title: string) {
  const content = `%PDF-AXIEME-MOCK\n${title}\nEntity: ${entityId}\nGenerated: ${new Date().toISOString()}\n`;
  const hash = crypto.createHash("sha256").update(content).digest("hex");
  return { id: `doc-${nanoid(8)}`, name: `${title}.pdf`, content, hash, templateVersion: "proposal-2026.01" };
}
