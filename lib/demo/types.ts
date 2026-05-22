export type RoleCode =
  | "SUPER_ADMIN_AXIEME"
  | "ADMIN_MGA"
  | "UNDERWRITER"
  | "BACK_OFFICE_MGA"
  | "BROKER_ADMIN"
  | "DISTRIBUTOR_USER"
  | "VIEWER"
  | "AUDITOR";

export type QuoteStatus =
  | "DRAFT"
  | "QUESTIONNAIRE_COMPLETED"
  | "QUOTABLE"
  | "QUOTED"
  | "REFERRAL_REQUIRED"
  | "REFERRAL_IN_REVIEW"
  | "APPROVED_BY_UNDERWRITER"
  | "DECLINED"
  | "PAYMENT_PENDING"
  | "PAID"
  | "CONVERTED_TO_POLICY";

export type PricingResultType = "QUOTABLE" | "REFERRAL" | "DECLINED";
export type CustomerType = "PERSON" | "COMPANY" | "PROFESSIONAL" | "SOLE_PROPRIETOR" | "ASSOCIATION";

export type Tenant = { id: string; name: string; region: string };
export type DemoUser = {
  id: string;
  tenantId: string;
  distributorId?: string;
  email: string;
  username: string;
  name: string;
  role: RoleCode;
  permissions: string[];
  passwordHash: string;
  mfaEnabled: boolean;
};
export type Distributor = {
  id: string;
  tenantId: string;
  parentDistributorId?: string;
  name: string;
  vat: string;
  rui: string;
  status: "ACTIVE" | "SUSPENDED";
  products: string[];
  commissionRate: number;
};
export type Customer = {
  id: string;
  tenantId: string;
  ownerUserId: string;
  distributorId: string;
  type: CustomerType;
  displayName: string;
  taxCode: string;
  vatNumber?: string;
  email: string;
  phone: string;
  city: string;
  province: string;
  privacyConsent: boolean;
  retentionUntil: string;
};
export type Product = {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  lineOfBusiness: string;
  status: "DRAFT" | "ACTIVE" | "SUSPENDED" | "ARCHIVED" | "DISCONTINUED";
  carrier: string;
  target: string;
  productVersionId: string;
  questionnaireVersionId: string;
  pricingVersionId: string;
  limits: number[];
  deductibles: number[];
};
export type Question = {
  code: string;
  label: string;
  helpText?: string;
  fieldType: string;
  required: boolean;
  options?: string[];
  visibilityCondition?: Record<string, unknown>;
  referralRule?: Record<string, unknown>;
  pricingMappingKey?: string;
};
export type QuestionnaireSection = { code: string; title: string; questions: Question[] };
export type Questionnaire = { productId: string; version: string; sections: QuestionnaireSection[] };
export type QuoteAnswerValue = string | number | boolean | string[] | null;
export type Quote = {
  id: string;
  tenantId: string;
  distributorId: string;
  ownerUserId: string;
  customerId: string;
  productId: string;
  status: QuoteStatus;
  answers: Record<string, QuoteAnswerValue>;
  selectedLimit: number;
  selectedDeductible: number;
  grossPremium?: number | null;
  referralReasons: ReferralReason[];
  pricingCalculationId?: string;
};
export type ReferralReason = { code: string; label: string };
export type PricingTrace = {
  id: string;
  quoteId: string;
  product: string;
  productVersion: string;
  pricingVersion: string;
  inputs: Record<string, QuoteAnswerValue>;
  output: PricingResult;
  rulesApplied: string[];
  userId: string;
  requestId: string;
  correlationId: string;
  createdAt: string;
};
export type PricingResult = {
  resultType: PricingResultType;
  netPremium: number | null;
  taxes: number | null;
  grossPremium: number | null;
  currency: "EUR";
  deductible?: number;
  rulesApplied: string[];
  warnings: string[];
  referralReasons: ReferralReason[];
  reason?: string;
};
export type Referral = {
  id: string;
  tenantId: string;
  quoteId: string;
  status: "OPEN" | "ASSIGNED" | "INFO_REQUESTED" | "INFO_PROVIDED" | "IN_REVIEW" | "APPROVED" | "APPROVED_WITH_CHANGES" | "REJECTED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  assignedToUserId?: string;
  reasons: ReferralReason[];
  slaDueAt: string;
};
export type Policy = {
  id: string;
  tenantId: string;
  quoteId: string;
  customerId: string;
  productId: string;
  policyNumber: string;
  status: "ISSUING" | "ISSUED_TO_SIGN" | "SIGNED" | "ACTIVE" | "CANCELLED" | "EXPIRED" | "RENEWED";
  inceptionDate: string;
  expiryDate: string;
  grossPremium: number;
};
export type AuditLog = {
  id: string;
  tenantId: string;
  userId: string;
  role: RoleCode;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  requestId: string;
  correlationId: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  success: boolean;
};
