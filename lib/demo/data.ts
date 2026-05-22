import bcrypt from "bcryptjs";
import type { AuditLog, Customer, DemoUser, Distributor, Policy, Product, Questionnaire, Quote, Referral } from "./types";

const passwordHash = bcrypt.hashSync("Password123!", 12);

export const tenants = [{ id: "tenant-axieme-demo", name: "Axieme Demo MGA", region: "europe-west8" }];

export const users: DemoUser[] = [
  { id: "user-superadmin", tenantId: "tenant-axieme-demo", email: "superadmin@axieme.test", username: "superadmin", name: "Super Admin Axieme", role: "SUPER_ADMIN_AXIEME", permissions: ["*"], passwordHash, mfaEnabled: true },
  { id: "user-admin", tenantId: "tenant-axieme-demo", email: "admin.mga@axieme.test", username: "admin.mga", name: "Admin MGA", role: "ADMIN_MGA", permissions: ["admin:*", "quote:*", "customer:*", "product:*", "security:*"], passwordHash, mfaEnabled: true },
  { id: "user-underwriter", tenantId: "tenant-axieme-demo", email: "underwriter@axieme.test", username: "underwriter", name: "Underwriter Demo", role: "UNDERWRITER", permissions: ["referral:review", "quote:read", "pricing:override"], passwordHash, mfaEnabled: true },
  { id: "user-broker", tenantId: "tenant-axieme-demo", distributorId: "dist-broker", email: "broker@axieme.test", username: "broker", name: "Broker Admin", role: "BROKER_ADMIN", permissions: ["customer:*", "quote:*", "policy:read", "document:read"], passwordHash, mfaEnabled: false },
  { id: "user-collab", tenantId: "tenant-axieme-demo", distributorId: "dist-collab-1", email: "collaboratore@axieme.test", username: "collaboratore", name: "Collaboratore Demo", role: "DISTRIBUTOR_USER", permissions: ["customer:create", "customer:read", "quote:create", "quote:read"], passwordHash, mfaEnabled: false },
];

export const distributors: Distributor[] = [
  { id: "dist-broker", tenantId: "tenant-axieme-demo", name: "Broker Demo S.r.l.", vat: "12345678901", rui: "B000000001", status: "ACTIVE", products: ["prod-lawyers", "prod-accountants", "prod-engineers", "prod-colpa", "prod-motor"], commissionRate: 0.18 },
  { id: "dist-collab-1", tenantId: "tenant-axieme-demo", parentDistributorId: "dist-broker", name: "Collaboratore Demo 1", vat: "12345678902", rui: "E000000001", status: "ACTIVE", products: ["prod-lawyers", "prod-accountants"], commissionRate: 0.08 },
  { id: "dist-collab-2", tenantId: "tenant-axieme-demo", parentDistributorId: "dist-broker", name: "Collaboratore Demo 2", vat: "12345678903", rui: "E000000002", status: "ACTIVE", products: ["prod-motor", "prod-colpa"], commissionRate: 0.08 },
];

export const products: Product[] = [
  { id: "prod-lawyers", tenantId: "tenant-axieme-demo", code: "RC-AVV", name: "RC Professionale Avvocati", lineOfBusiness: "Professional Indemnity", status: "ACTIVE", carrier: "Carrier Demo Europe", target: "Avvocati individuali e studi associati", productVersionId: "pv-lawyers-2026", questionnaireVersionId: "qv-lawyers-2026", pricingVersionId: "pr-lawyers-2026", limits: [250000, 500000, 1000000, 2500000], deductibles: [500, 1000, 2500] },
  { id: "prod-accountants", tenantId: "tenant-axieme-demo", code: "RC-COM", name: "RC Professionale Commercialisti", lineOfBusiness: "Professional Indemnity", status: "ACTIVE", carrier: "Carrier Demo Europe", target: "Commercialisti e consulenti del lavoro", productVersionId: "pv-accountants-2026", questionnaireVersionId: "qv-accountants-2026", pricingVersionId: "pr-accountants-2026", limits: [250000, 500000, 1000000, 2500000], deductibles: [500, 1000, 2500] },
  { id: "prod-engineers", tenantId: "tenant-axieme-demo", code: "RC-TEC", name: "RC Professionale Architetti/Ingegneri/Geometri", lineOfBusiness: "Professional Indemnity", status: "ACTIVE", carrier: "Carrier Demo Europe", target: "Professioni tecniche", productVersionId: "pv-engineers-2026", questionnaireVersionId: "qv-engineers-2026", pricingVersionId: "pr-engineers-2026", limits: [250000, 500000, 1000000, 2500000], deductibles: [1000, 2500, 5000] },
  { id: "prod-colpa", tenantId: "tenant-axieme-demo", code: "CG-PA", name: "Colpa Grave", lineOfBusiness: "Public Sector Liability", status: "ACTIVE", carrier: "Carrier Demo Europe", target: "Enti e dipendenti pubblici", productVersionId: "pv-colpa-2026", questionnaireVersionId: "qv-colpa-2026", pricingVersionId: "pr-colpa-2026", limits: [500000, 1000000, 2500000], deductibles: [0, 500, 1000] },
  { id: "prod-motor", tenantId: "tenant-axieme-demo", code: "MOTOR-CVT", name: "Motor CVT / ARD", lineOfBusiness: "Motor", status: "ACTIVE", carrier: "Carrier Demo Motor", target: "Flotte e veicoli singoli", productVersionId: "pv-motor-2026", questionnaireVersionId: "qv-motor-2026", pricingVersionId: "pr-motor-2026", limits: [10000, 25000, 50000, 100000], deductibles: [250, 500, 1000] },
];

export const questionnaires: Questionnaire[] = products.map((product) => ({
  productId: product.id,
  version: "2026.01",
  sections: [
    { code: "proposer", title: "Dati proponente", questions: [
      { code: "turnover_total", label: "Fatturato totale", fieldType: "currency", required: true, pricingMappingKey: "turnoverTotal" },
      { code: "limit_of_indemnity", label: "Massimale richiesto", fieldType: "select", required: true, options: product.limits.map(String), referralRule: { operator: ">", value: 2500000 }, pricingMappingKey: "limit" },
      { code: "claims_last_5_years", label: "Sinistri ultimi 5 anni", fieldType: "number", required: true, referralRule: { operator: ">", value: 0 }, pricingMappingKey: "claimsLast5Years" },
    ] },
    { code: "underwriting", title: "Dichiarazioni assuntive", questions: [
      { code: "company_refused", label: "Precedente compagnia ha rifiutato rinnovo?", fieldType: "boolean", required: true, referralRule: { operator: "=", value: true } },
      { code: "territory", label: "Territorio", fieldType: "select", required: true, options: ["Italia", "UE", "USA", "CANADA"], referralRule: { operator: "in", value: ["USA", "CANADA"] } },
      { code: "special_activity_turnover", label: "Fatturato attività speciali", fieldType: "currency", required: false, pricingMappingKey: "specialActivityTurnover" },
    ] },
  ],
}));

export const customers: Customer[] = [
  { id: "cust-1", tenantId: "tenant-axieme-demo", ownerUserId: "user-broker", distributorId: "dist-broker", type: "COMPANY", displayName: "Studio Legale Demo Associato", taxCode: "SLDPLA80A01H501U", vatNumber: "11122233344", email: "studio.legale@example.test", phone: "+3906123456", city: "Roma", province: "RM", privacyConsent: true, retentionUntil: "2031-12-31" },
  { id: "cust-2", tenantId: "tenant-axieme-demo", ownerUserId: "user-collab", distributorId: "dist-collab-1", type: "PROFESSIONAL", displayName: "Mario Commercialista", taxCode: "MRCMRA80A01F205X", vatNumber: "22233344455", email: "commercialista@example.test", phone: "+3902123456", city: "Milano", province: "MI", privacyConsent: true, retentionUntil: "2031-12-31" },
  { id: "cust-3", tenantId: "tenant-axieme-demo", ownerUserId: "user-broker", distributorId: "dist-broker", type: "PERSON", displayName: "Giulia Motor Demo", taxCode: "GLIMTR90A41L219Z", email: "giulia.motor@example.test", phone: "+39011123456", city: "Torino", province: "TO", privacyConsent: true, retentionUntil: "2031-12-31" },
];

export const quotes: Quote[] = [
  { id: "quote-1", tenantId: "tenant-axieme-demo", distributorId: "dist-broker", ownerUserId: "user-broker", customerId: "cust-1", productId: "prod-lawyers", status: "QUOTABLE", selectedLimit: 1000000, selectedDeductible: 1000, grossPremium: 1464, referralReasons: [], pricingCalculationId: "calc-1", answers: { turnover_total: 180000, limit_of_indemnity: 1000000, claims_last_5_years: 0, company_refused: false, territory: "Italia", special_activity_turnover: 20000 } },
  { id: "quote-2", tenantId: "tenant-axieme-demo", distributorId: "dist-collab-1", ownerUserId: "user-collab", customerId: "cust-2", productId: "prod-accountants", status: "REFERRAL_REQUIRED", selectedLimit: 2500000, selectedDeductible: 1000, grossPremium: null, referralReasons: [{ code: "CLAIMS_REFERRAL", label: "Presenza sinistri: valutazione underwriter richiesta" }], answers: { turnover_total: 240000, limit_of_indemnity: 2500000, claims_last_5_years: 1, company_refused: false, territory: "Italia", special_activity_turnover: 40000 } },
];

export const referrals: Referral[] = [
  { id: "ref-1", tenantId: "tenant-axieme-demo", quoteId: "quote-2", status: "OPEN", priority: "HIGH", reasons: [{ code: "CLAIMS_REFERRAL", label: "Presenza sinistri: valutazione underwriter richiesta" }], slaDueAt: "2026-06-01" },
];

export const policies: Policy[] = [
  { id: "pol-1", tenantId: "tenant-axieme-demo", quoteId: "quote-1", customerId: "cust-1", productId: "prod-lawyers", policyNumber: "AXM-2026-000001", status: "ACTIVE", inceptionDate: "2026-01-01", expiryDate: "2026-12-31", grossPremium: 1464 },
];

export const auditLogs: AuditLog[] = [
  { id: "audit-1", tenantId: "tenant-axieme-demo", userId: "user-broker", role: "BROKER_ADMIN", action: "QUOTE_CALCULATED", entityType: "Quote", entityId: "quote-1", timestamp: new Date().toISOString(), requestId: "req-demo-1", correlationId: "corr-demo-1", riskLevel: "MEDIUM", success: true },
  { id: "audit-2", tenantId: "tenant-axieme-demo", userId: "user-underwriter", role: "UNDERWRITER", action: "REFERRAL_CREATED", entityType: "Referral", entityId: "ref-1", timestamp: new Date().toISOString(), requestId: "req-demo-2", correlationId: "corr-demo-2", riskLevel: "HIGH", success: true },
];

export const demoDocuments = [
  { id: "doc-1", tenantId: "tenant-axieme-demo", entityType: "Quote", entityId: "quote-1", type: "PROPOSAL", name: "Proposta RC Avvocati Demo.pdf", hash: "sha256-demo-proposal", status: "GENERATED" },
  { id: "doc-2", tenantId: "tenant-axieme-demo", entityType: "Policy", entityId: "pol-1", type: "POLICY", name: "Polizza AXM-2026-000001.pdf", hash: "sha256-demo-policy", status: "ARCHIVED" },
];

export const incidents = [
  { id: "inc-1", tenantId: "tenant-axieme-demo", title: "Login brute force simulato", severity: "MEDIUM", status: "TRIAGED", dataBreachSuspected: false, owner: "Security Owner" },
];

export const thirdPartyProviders = [
  { id: "ict-1", name: "Google Cloud Platform", serviceType: "Cloud hosting", criticality: "HIGH", dataProcessed: "Applicazione, log tecnici, documenti su bucket privato", status: "ACTIVE" },
  { id: "ict-2", name: "Payment Provider Mock", serviceType: "Payments", criticality: "MEDIUM", dataProcessed: "Metadati pagamento mock, nessun dato carta", status: "MOCK" },
];
