import { nanoid } from "nanoid";
import type { AuditLog, DemoUser } from "@/lib/demo/types";

export const runtimeAuditLogs: AuditLog[] = [];

export function audit(user: DemoUser, action: string, entityType: string, entityId: string, riskLevel: AuditLog["riskLevel"] = "LOW", success = true) {
  const entry: AuditLog = {
    id: `audit-${nanoid(8)}`,
    tenantId: user.tenantId,
    userId: user.id,
    role: user.role,
    action,
    entityType,
    entityId,
    timestamp: new Date().toISOString(),
    requestId: `req-${nanoid(10)}`,
    correlationId: `corr-${nanoid(10)}`,
    riskLevel,
    success,
  };
  runtimeAuditLogs.unshift(entry);
  return entry;
}
