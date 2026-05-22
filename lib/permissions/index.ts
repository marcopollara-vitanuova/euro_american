import type { Customer, DemoUser, Distributor, Quote, RoleCode } from "@/lib/demo/types";
import { distributors } from "@/lib/demo/data";

const roleRank: Record<RoleCode, number> = {
  VIEWER: 1,
  AUDITOR: 2,
  DISTRIBUTOR_USER: 3,
  BROKER_ADMIN: 4,
  BACK_OFFICE_MGA: 5,
  UNDERWRITER: 6,
  ADMIN_MGA: 7,
  SUPER_ADMIN_AXIEME: 8,
};

export function hasPermission(user: DemoUser, permission: string) {
  if (user.permissions.includes("*")) return true;
  if (user.permissions.includes(permission)) return true;
  const [scope] = permission.split(":");
  return user.permissions.includes(`${scope}:*`) || user.permissions.includes("admin:*");
}

export function hasRoleAtLeast(user: DemoUser, role: RoleCode) {
  return roleRank[user.role] >= roleRank[role];
}

export function getDistributorDescendants(distributorId: string): string[] {
  const children = distributors.filter((item) => item.parentDistributorId === distributorId).map((item) => item.id);
  return [distributorId, ...children.flatMap(getDistributorDescendants)];
}

export function canAccessDistributor(user: DemoUser, distributorId: string) {
  if (["SUPER_ADMIN_AXIEME", "ADMIN_MGA", "UNDERWRITER", "BACK_OFFICE_MGA", "AUDITOR"].includes(user.role)) return true;
  if (!user.distributorId) return false;
  return getDistributorDescendants(user.distributorId).includes(distributorId);
}

export function canAccessCustomer(user: DemoUser, customer: Customer) {
  if (customer.tenantId !== user.tenantId) return false;
  if (["SUPER_ADMIN_AXIEME", "ADMIN_MGA", "UNDERWRITER", "BACK_OFFICE_MGA", "AUDITOR"].includes(user.role)) return true;
  if (user.role === "BROKER_ADMIN" && user.distributorId) return getDistributorDescendants(user.distributorId).includes(customer.distributorId);
  return customer.ownerUserId === user.id;
}

export function canAccessQuote(user: DemoUser, quote: Quote) {
  if (quote.tenantId !== user.tenantId) return false;
  if (["SUPER_ADMIN_AXIEME", "ADMIN_MGA", "UNDERWRITER", "BACK_OFFICE_MGA", "AUDITOR"].includes(user.role)) return true;
  if (user.role === "BROKER_ADMIN" && user.distributorId) return getDistributorDescendants(user.distributorId).includes(quote.distributorId);
  return quote.ownerUserId === user.id;
}

export function visibleDistributors(user: DemoUser): Distributor[] {
  if (["SUPER_ADMIN_AXIEME", "ADMIN_MGA", "UNDERWRITER", "BACK_OFFICE_MGA", "AUDITOR"].includes(user.role)) return distributors.filter((item) => item.tenantId === user.tenantId);
  if (!user.distributorId) return [];
  const ids = getDistributorDescendants(user.distributorId);
  return distributors.filter((item) => ids.includes(item.id));
}
