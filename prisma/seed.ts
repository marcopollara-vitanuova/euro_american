import { PrismaClient, RoleCode } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.upsert({ where: { id: "tenant-axieme-demo" }, update: {}, create: { id: "tenant-axieme-demo", name: "Axieme Demo MGA", region: "europe-west8" } });
  for (const code of Object.values(RoleCode)) {
    await prisma.role.upsert({ where: { code }, update: {}, create: { code, name: code.replaceAll("_", " ") } });
  }
  const passwordHash = bcrypt.hashSync("Password123!", 12);
  await prisma.user.upsert({ where: { email: "admin.mga@axieme.test" }, update: {}, create: { tenantId: tenant.id, email: "admin.mga@axieme.test", username: "admin.mga", passwordHash, firstName: "Admin", lastName: "MGA", mfaEnabled: true } });
  await prisma.distributor.createMany({ data: [
    { id: "dist-broker", tenantId: tenant.id, name: "Broker Demo S.r.l.", vatNumber: "12345678901", rui: "B000000001", commissionRate: "0.18" },
    { id: "dist-collab-1", tenantId: tenant.id, parentDistributorId: "dist-broker", name: "Collaboratore Demo 1", vatNumber: "12345678902", rui: "E000000001", commissionRate: "0.08" },
  ], skipDuplicates: true });
  await prisma.product.createMany({ data: [
    { id: "prod-lawyers", tenantId: tenant.id, code: "RC-AVV", name: "RC Professionale Avvocati", lineOfBusiness: "Professional Indemnity", status: "ACTIVE" },
    { id: "prod-accountants", tenantId: tenant.id, code: "RC-COM", name: "RC Professionale Commercialisti", lineOfBusiness: "Professional Indemnity", status: "ACTIVE" },
    { id: "prod-engineers", tenantId: tenant.id, code: "RC-TEC", name: "RC Professionale Architetti/Ingegneri/Geometri", lineOfBusiness: "Professional Indemnity", status: "ACTIVE" },
    { id: "prod-colpa", tenantId: tenant.id, code: "CG-PA", name: "Colpa Grave", lineOfBusiness: "Public Sector Liability", status: "ACTIVE" },
    { id: "prod-motor", tenantId: tenant.id, code: "MOTOR-CVT", name: "Motor CVT", lineOfBusiness: "Motor", status: "ACTIVE" },
  ], skipDuplicates: true });
  await prisma.securityIncident.create({ data: { tenantId: tenant.id, title: "Incident demo", description: "Evento security demo", severity: "MEDIUM", status: "TRIAGED", detectedAt: new Date() } });
  await prisma.ictThirdPartyProvider.create({ data: { tenantId: tenant.id, name: "Google Cloud Platform", serviceType: "Cloud", criticality: "HIGH", supportsCriticalOrImportantFunction: true, dataProcessed: "Application data and logs", exitPlanAvailable: true } });
  console.log("Seed demo Axieme MGA completato");
}

main().finally(async () => prisma.$disconnect());
