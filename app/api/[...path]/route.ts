import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { authenticate, clearSession, createSession, getCurrentUser } from "@/lib/auth/session";
import { audit, runtimeAuditLogs } from "@/lib/audit";
import { createPaymentLinkMock } from "@/lib/payments/mock";
import { calculatePrice } from "@/lib/pricing/engine";
import { canAccessCustomer, canAccessQuote, hasPermission, visibleDistributors } from "@/lib/permissions";
import { createSignatureRequestMock } from "@/lib/signature/mock";
import { createSignedUrlMock } from "@/lib/storage/gcs";
import { generateMockPdf } from "@/lib/documents/service";
import { auditLogs, customers, demoDocuments, demoPayments, demoSignatureRequests, distributors, incidents, policies, products, questionnaires, quotes, referrals, thirdPartyProviders, users } from "@/lib/demo/data";
import type { Customer, Quote } from "@/lib/demo/types";

const loginSchema = z.object({ identifier: z.string().min(1), password: z.string().min(8) });
const customerSchema = z.object({ displayName: z.string().min(2), email: z.string().email(), taxCode: z.string().min(6), type: z.enum(["PERSON", "COMPANY", "PROFESSIONAL", "SOLE_PROPRIETOR", "ASSOCIATION"]).default("COMPANY") });
const quoteSchema = z.object({ customerId: z.string(), productId: z.string(), selectedLimit: z.number().or(z.string()).transform(Number), selectedDeductible: z.number().or(z.string()).transform(Number) });
const answersSchema = z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.array(z.string()), z.null()]));

type Params = { params: Promise<{ path: string[] }> };

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

async function requireApiUser() {
  const user = await getCurrentUser();
  if (!user) return { error: json({ error: "UNAUTHENTICATED" }, 401) } as const;
  return { user } as const;
}

function visibleQuotesFor(user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>) {
  return quotes.filter((quote) => canAccessQuote(user, quote));
}

function visibleCustomersFor(user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>) {
  return customers.filter((customer) => canAccessCustomer(user, customer));
}

export async function GET(request: NextRequest, context: Params) {
  const path = (await context.params).path.join("/");
  if (path === "health") return json({ status: "ok", service: "axieme-mga-platform" });
  if (path === "ready") return json({ status: "ready", checks: { next: true, prismaSchema: true, storageMock: true } });
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  const user = auth.user;

  if (path === "me") return json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, tenantId: user.tenantId, permissions: user.permissions } });
  if (path === "customers") return json({ items: visibleCustomersFor(user) });
  if (path.match(/^customers\/[^/]+$/)) {
    const id = path.split("/")[1];
    const customer = customers.find((item) => item.id === id && canAccessCustomer(user, item));
    return customer ? json(customer) : json({ error: "NOT_FOUND" }, 404);
  }
  if (path.match(/^customers\/[^/]+\/(quotes|policies|documents)$/)) {
    const [, id, child] = path.split("/");
    const customer = customers.find((item) => item.id === id && canAccessCustomer(user, item));
    if (!customer) return json({ error: "NOT_FOUND" }, 404);
    if (child === "quotes") return json({ items: quotes.filter((quote) => quote.customerId === id && canAccessQuote(user, quote)) });
    if (child === "policies") return json({ items: policies.filter((policy) => policy.customerId === id) });
    return json({ items: demoDocuments.filter((document) => document.entityId === id) });
  }
  if (path === "products") return json({ items: products.filter((product) => visibleDistributors(user).some((dist) => dist.products.includes(product.id)) || ["SUPER_ADMIN_AXIEME", "ADMIN_MGA", "UNDERWRITER", "BACK_OFFICE_MGA"].includes(user.role)) });
  if (path.match(/^products\/[^/]+(\/questionnaire|\/pricing)?$/)) {
    const [_, id, child] = path.split("/");
    const product = products.find((item) => item.id === id);
    if (!product) return json({ error: "NOT_FOUND" }, 404);
    if (child === "questionnaire") return json(questionnaires.find((item) => item.productId === id));
    if (child === "pricing") return json({ pricingVersionId: product.pricingVersionId, ratingTables: ["turnover", "limit", "deductible"], minimumPremium: 450 });
    return json(product);
  }
  if (path === "quotes") return json({ items: visibleQuotesFor(user) });
  if (path.match(/^quotes\/[^/]+$/)) {
    const id = path.split("/")[1];
    const quote = quotes.find((item) => item.id === id && canAccessQuote(user, item));
    if (!quote) return json({ error: "NOT_FOUND" }, 404);
    return json({ ...quote, customer: customers.find((item) => item.id === quote.customerId), product: products.find((item) => item.id === quote.productId) });
  }
  if (path === "referrals" || path === "admin/referrals") return json({ items: referrals.filter((referral) => referral.tenantId === user.tenantId) });
  if (path.match(/^(referrals|admin\/referrals)\/[^/]+$/)) {
    const id = path.split("/").pop();
    return json(referrals.find((item) => item.id === id) ?? { error: "NOT_FOUND" }, referrals.some((item) => item.id === id) ? 200 : 404);
  }
  if (path === "policies") return json({ items: policies.filter((policy) => policy.tenantId === user.tenantId) });
  if (path.match(/^policies\/[^/]+(\/documents)?$/)) {
    const id = path.split("/")[1];
    const policy = policies.find((item) => item.id === id);
    if (!policy) return json({ error: "NOT_FOUND" }, 404);
    if (path.endsWith("/documents")) return json({ items: demoDocuments.filter((doc) => doc.entityId === id) });
    return json(policy);
  }
  if (path === "documents") return json({ items: demoDocuments });
  if (path.match(/^documents\/[^/]+$/)) return json(demoDocuments.find((item) => item.id === path.split("/")[1]) ?? { error: "NOT_FOUND" });
  if (path === "payments") return json({ items: demoPayments });
  if (path === "signatures") return json({ items: demoSignatureRequests });
  if (path === "admin/distributors") return json({ items: distributors });
  if (path === "admin/users") return json({ items: users.map(({ passwordHash, ...safe }) => safe) });
  if (path === "admin/products") return json({ items: products });
  if (path === "admin/questionnaires") return json({ items: questionnaires });
  if (path === "admin/pricing") return json({ items: products.map((product) => ({ id: product.pricingVersionId, productId: product.id, productName: product.name, status: "ACTIVE" })) });
  if (path === "admin/audit-logs") return json({ items: [...runtimeAuditLogs, ...auditLogs] });
  if (path === "admin/security/settings") return json({ passwordMinLength: 12, mfaRequiredForAdmins: true, sessionTimeoutMinutes: 480, signedUrlExpirationMinutes: 15, maxUploadSizeMb: 25, rateLimits: { login: "5/min", sensitiveApi: "60/min" } });
  if (path === "admin/security/login-attempts") return json({ items: [{ id: "login-attempt-1", email: "broker@axieme.test", success: true, ipAddress: "127.0.0.1", createdAt: new Date().toISOString() }] });
  if (path === "admin/security/sessions") return json({ items: users.map((item) => ({ id: `sess-${item.id}`, userId: item.id, active: true, expiresAt: new Date(Date.now() + 3600000).toISOString() })) });
  if (path === "admin/security/access-reviews") return json({ items: [{ id: "access-review-1", status: "OPEN", scope: "Admin roles", dueAt: "2026-06-30" }] });
  if (path === "admin/incidents") return json({ items: incidents });
  if (path === "admin/third-party-providers") return json({ items: thirdPartyProviders });
  if (path === "admin/change-requests") return json({ items: [{ id: "chg-1", title: "Publish pricing 2026.01", status: "PENDING_APPROVAL", riskLevel: "MEDIUM" }] });
  if (path === "statements" || path === "admin/bordereaux") return json({ items: [{ id: "statement-1", period: "2026-05", status: "GENERATED", grossPremium: 1464, reconciliationStatus: "TO_RECONCILE" }] });
  return json({ error: "NOT_FOUND", path }, 404);
}

export async function POST(request: NextRequest, context: Params) {
  const path = (await context.params).path.join("/");
  if (path === "auth/login") {
    const body = loginSchema.safeParse(await request.json());
    if (!body.success) return json({ error: "INVALID_INPUT" }, 400);
    const user = await authenticate(body.data.identifier, body.data.password);
    if (!user) return json({ error: "INVALID_CREDENTIALS" }, 401);
    await createSession(user);
    audit(user, "LOGIN_SUCCESS", "User", user.id, "MEDIUM", true);
    return json({ ok: true, user: { id: user.id, name: user.name, role: user.role } });
  }
  if (path === "auth/logout") {
    await clearSession();
    return NextResponse.redirect(new URL("/login", request.url), 303);
  }
  if (["auth/password-reset/request", "auth/password-reset/confirm", "auth/change-password", "auth/mfa/setup", "auth/mfa/verify", "auth/mfa/disable"].includes(path)) return json({ ok: true, status: "MOCKED_SECURE_FLOW" });

  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  const user = auth.user;

  if (path === "customers") {
    if (!hasPermission(user, "customer:create")) return json({ error: "FORBIDDEN" }, 403);
    const parsed = customerSchema.safeParse(await request.json());
    if (!parsed.success) return json({ error: "INVALID_INPUT", issues: parsed.error.flatten() }, 400);
    const customer: Customer = { id: `cust-${nanoid(8)}`, tenantId: user.tenantId, ownerUserId: user.id, distributorId: user.distributorId ?? "dist-broker", taxCode: parsed.data.taxCode, email: parsed.data.email, type: parsed.data.type, displayName: parsed.data.displayName, phone: "", city: "", province: "", privacyConsent: false, retentionUntil: "2031-12-31" };
    customers.unshift(customer);
    audit(user, "CUSTOMER_CREATED", "Customer", customer.id, "MEDIUM", true);
    return json(customer, 201);
  }
  if (path === "quotes") {
    if (!hasPermission(user, "quote:create")) return json({ error: "FORBIDDEN" }, 403);
    const parsed = quoteSchema.safeParse(await request.json());
    if (!parsed.success) return json({ error: "INVALID_INPUT", issues: parsed.error.flatten() }, 400);
    const customer = customers.find((item) => item.id === parsed.data.customerId && canAccessCustomer(user, item));
    if (!customer) return json({ error: "CUSTOMER_NOT_ACCESSIBLE" }, 403);
    const quote: Quote = { id: `quote-${nanoid(8)}`, tenantId: user.tenantId, distributorId: user.distributorId ?? customer.distributorId, ownerUserId: user.id, customerId: customer.id, productId: parsed.data.productId, selectedLimit: parsed.data.selectedLimit, selectedDeductible: parsed.data.selectedDeductible, status: "DRAFT", answers: {}, referralReasons: [] };
    quotes.unshift(quote);
    audit(user, "QUOTE_CREATED", "Quote", quote.id, "MEDIUM", true);
    return json(quote, 201);
  }
  if (path.match(/^quotes\/[^/]+\/answers$/)) {
    const id = path.split("/")[1];
    const quote = quotes.find((item) => item.id === id && canAccessQuote(user, item));
    if (!quote) return json({ error: "NOT_FOUND" }, 404);
    const parsed = answersSchema.safeParse(await request.json());
    if (!parsed.success) return json({ error: "INVALID_INPUT" }, 400);
    quote.answers = { ...quote.answers, ...parsed.data };
    quote.status = "QUESTIONNAIRE_COMPLETED";
    audit(user, "QUOTE_ANSWERS_SAVED", "Quote", quote.id, "MEDIUM", true);
    return json(quote);
  }
  if (path.match(/^quotes\/[^/]+\/(validate-underwriting|calculate-price)$/)) {
    const id = path.split("/")[1];
    const quote = quotes.find((item) => item.id === id && canAccessQuote(user, item));
    if (!quote) return json({ error: "NOT_FOUND" }, 404);
    const { result, trace } = calculatePrice({ quoteId: quote.id, productId: quote.productId, answers: quote.answers, selectedLimit: quote.selectedLimit, selectedDeductible: quote.selectedDeductible, userId: user.id });
    quote.status = result.resultType === "QUOTABLE" ? "QUOTABLE" : result.resultType === "REFERRAL" ? "REFERRAL_REQUIRED" : "DECLINED";
    quote.grossPremium = result.grossPremium;
    quote.referralReasons = result.referralReasons;
    quote.pricingCalculationId = trace.id;
    if (result.resultType === "REFERRAL") referrals.unshift({ id: `ref-${nanoid(8)}`, tenantId: user.tenantId, quoteId: quote.id, status: "OPEN", priority: "HIGH", reasons: result.referralReasons, slaDueAt: new Date(Date.now() + 7 * 86400000).toISOString() });
    audit(user, "QUOTE_CALCULATED", "Quote", quote.id, "HIGH", true);
    return json({ quote, result, trace });
  }
  if (path.match(/^quotes\/[^/]+\/generate-proposal$/)) {
    const id = path.split("/")[1];
    const doc = generateMockPdf(id, "Proposta Axieme MGA");
    demoDocuments.unshift({ id: doc.id, tenantId: user.tenantId, entityType: "Quote", entityId: id, type: "PROPOSAL", name: doc.name, hash: doc.hash, status: "GENERATED" });
    audit(user, "DOCUMENT_GENERATED", "Quote", id, "MEDIUM", true);
    return json({ document: doc });
  }
  if (path.match(/^quotes\/[^/]+\/send-proposal$/)) return json({ status: "SENT", channel: "email-mock" });
  if (path.match(/^quotes\/[^/]+\/payment-link$/)) {
    const quoteId = path.split("/")[1];
    const quote = quotes.find((item) => item.id === quoteId && canAccessQuote(user, item));
    if (!quote) return json({ error: "NOT_FOUND" }, 404);
    const payment = createPaymentLinkMock(quoteId, quote.grossPremium ?? 1000);
    demoPayments.unshift(payment);
    audit(user, "PAYMENT_LINK_GENERATED", "Quote", quoteId, "MEDIUM", true);
    return json(payment);
  }
  if (path.match(/^quotes\/[^/]+\/issue-policy$/)) {
    const quoteId = path.split("/")[1];
    const quote = quotes.find((item) => item.id === quoteId && canAccessQuote(user, item));
    if (!quote) return json({ error: "NOT_FOUND" }, 404);
    const openReferral = referrals.find((item) => item.quoteId === quoteId && !["APPROVED", "APPROVED_WITH_CHANGES", "CLOSED"].includes(item.status));
    if (openReferral) return json({ error: "REFERRAL_NOT_APPROVED" }, 409);
    const capturedPayment = demoPayments.find((item) => item.quoteId === quoteId && item.status === "CAPTURED");
    if (!capturedPayment) return json({ error: "PAYMENT_REQUIRED" }, 409);
    const policy = { id: `pol-${nanoid(8)}`, tenantId: user.tenantId, quoteId, customerId: quote.customerId, productId: quote.productId, policyNumber: `AXM-${new Date().getFullYear()}-${String(policies.length + 1).padStart(6, "0")}`, status: "ACTIVE" as const, inceptionDate: new Date().toISOString(), expiryDate: new Date(Date.now() + 365 * 86400000).toISOString(), grossPremium: quote.grossPremium ?? 0 };
    policies.unshift(policy);
    quote.status = "CONVERTED_TO_POLICY";
    audit(user, "POLICY_ISSUED", "Policy", policy.id, "HIGH", true);
    return json(policy, 201);
  }
  if (path.match(/^referrals\/[^/]+\/(assign|request-info|approve|reject|message|override-price)$/) || path.match(/^admin\/referrals\/[^/]+\/(assign|request-info|approve|reject|message|override-price)$/)) {
    const parts = path.split("/");
    const id = parts.includes("admin") ? parts[2] : parts[1];
    const action = parts.at(-1);
    const referral = referrals.find((item) => item.id === id);
    if (!referral) return json({ error: "NOT_FOUND" }, 404);
    if (action === "assign") referral.status = "ASSIGNED";
    if (action === "approve") referral.status = "APPROVED";
    if (action === "reject") referral.status = "REJECTED";
    if (action === "request-info") referral.status = "INFO_REQUESTED";
    audit(user, `REFERRAL_${action?.toUpperCase().replaceAll("-", "_")}`, "Referral", referral.id, "HIGH", true);
    return json(referral);
  }
  if (path.match(/^documents\/[^/]+\/signed-url$/)) return json(createSignedUrlMock(path.split("/")[1]));
  if (path === "documents/upload") return json({ id: `upload-${nanoid(8)}`, scanStatus: "PENDING", hash: "sha256-upload-mock" }, 201);
  if (path.match(/^policies\/[^/]+\/signature-request$/)) {
    const policyId = path.split("/")[1];
    const signature = createSignatureRequestMock(policyId);
    demoSignatureRequests.unshift(signature);
    audit(user, "SIGNATURE_REQUEST_CREATED", "Policy", policyId, "HIGH", true);
    return json(signature);
  }
  if (path.match(/^policies\/[^/]+\/renewal$/)) return json({ id: `ren-${nanoid(8)}`, status: "RENEWAL_QUOTE_GENERATED" });
  if (path.match(/^payments\/[^/]+\/simulate-(success|failure)$/)) {
    const id = path.split("/")[1];
    const payment = demoPayments.find((item) => item.id === id);
    const status = path.endsWith("success") ? "CAPTURED" : "FAILED";
    if (payment) payment.status = status;
    audit(user, `PAYMENT_${status}`, "Payment", id, "HIGH", status === "CAPTURED");
    return json({ id, status, idempotencyKey: `idem-${nanoid(8)}` });
  }
  if (path.startsWith("admin/") || path.startsWith("statements") || path.startsWith("webhooks/")) return json({ ok: true, path, status: "MOCKED_ENDPOINT" });
  return json({ error: "NOT_FOUND", path }, 404);
}

export async function PUT(request: NextRequest, context: Params) {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  return json({ ok: true, path: (await context.params).path.join("/"), body: await request.json().catch(() => ({})), status: "MOCKED_UPDATE" });
}

export async function DELETE(_request: NextRequest, context: Params) {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;
  return json({ ok: true, path: (await context.params).path.join("/"), deleted: false, mode: "SOFT_DELETE_MOCK" });
}
