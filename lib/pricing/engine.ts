import { nanoid } from "nanoid";
import { products } from "@/lib/demo/data";
import type { PricingResult, PricingTrace, QuoteAnswerValue } from "@/lib/demo/types";
import { applyUnderwritingOutcome } from "@/lib/rules/engine";

const productFactors: Record<string, number> = {
  "prod-lawyers": 0.006,
  "prod-accountants": 0.007,
  "prod-engineers": 0.008,
  "prod-colpa": 0.004,
  "prod-motor": 0.035,
};

export function calculatePrice(input: {
  quoteId: string;
  productId: string;
  answers: Record<string, QuoteAnswerValue>;
  selectedLimit: number;
  selectedDeductible: number;
  userId: string;
}): { result: PricingResult; trace: PricingTrace } {
  const product = products.find((item) => item.id === input.productId);
  if (!product) throw new Error("PRODUCT_NOT_FOUND");
  const turnover = Number(input.answers.turnover_total ?? input.answers.vehicle_value ?? 100000);
  const limitFactor = Math.max(1, input.selectedLimit / 1000000);
  const deductibleDiscount = input.selectedDeductible >= 2500 ? 0.9 : input.selectedDeductible >= 1000 ? 0.96 : 1;
  const specialActivity = Number(input.answers.special_activity_turnover ?? 0);
  const factor = productFactors[input.productId] ?? 0.006;
  const basePremium = Math.max(450, turnover * factor * limitFactor * deductibleDiscount);
  const loadings = specialActivity > 0 ? specialActivity * 0.002 : 0;
  const netPremium = Math.round((basePremium + loadings) * 100) / 100;
  const taxes = Math.round(netPremium * 0.22 * 100) / 100;
  const grossPremium = Math.round((netPremium + taxes) * 100) / 100;
  const base = {
    netPremium,
    taxes,
    grossPremium,
    currency: "EUR" as const,
    deductible: input.selectedDeductible,
    rulesApplied: ["BASE_RATE_BY_TURNOVER", "LIMIT_FACTOR", "DEDUCTIBLE_FACTOR", specialActivity > 0 ? "SPECIAL_ACTIVITY_LOADING" : "NO_SPECIAL_ACTIVITY_LOADING"],
    warnings: [],
  };
  const result = applyUnderwritingOutcome(base, input.answers);
  const trace: PricingTrace = {
    id: `calc-${nanoid(8)}`,
    quoteId: input.quoteId,
    product: product.name,
    productVersion: product.productVersionId,
    pricingVersion: product.pricingVersionId,
    inputs: input.answers,
    output: result,
    rulesApplied: result.rulesApplied,
    userId: input.userId,
    requestId: `req-${nanoid(10)}`,
    correlationId: `corr-${nanoid(10)}`,
    createdAt: new Date().toISOString(),
  };
  return { result, trace };
}
