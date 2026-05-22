import type { PricingResult, QuoteAnswerValue, ReferralReason } from "@/lib/demo/types";

type Rule = {
  code: string;
  type: "REFERRAL" | "BLOCKING" | "WARNING";
  field: string;
  operator: ">" | "<" | "=" | "in";
  value: QuoteAnswerValue | QuoteAnswerValue[];
  message: string;
};

export const defaultUnderwritingRules: Rule[] = [
  { code: "CLAIMS_REFERRAL", type: "REFERRAL", field: "claims_last_5_years", operator: ">", value: 0, message: "Presenza di sinistri negli ultimi 5 anni: valutazione underwriter richiesta" },
  { code: "HIGH_LIMIT_REFERRAL", type: "REFERRAL", field: "limit_of_indemnity", operator: ">", value: 2500000, message: "Massimale superiore allo standard" },
  { code: "COMPANY_REFUSED_REFERRAL", type: "REFERRAL", field: "company_refused", operator: "=", value: true, message: "Rifiuto o mancato rinnovo da precedente compagnia" },
  { code: "DECLINED_TERRITORY", type: "BLOCKING", field: "territory", operator: "in", value: ["USA", "CANADA"], message: "Rischio non quotabile per territorio" },
];

function compare(actual: QuoteAnswerValue, rule: Rule) {
  if (rule.operator === ">") return Number(actual ?? 0) > Number(rule.value);
  if (rule.operator === "<") return Number(actual ?? 0) < Number(rule.value);
  if (rule.operator === "=") return actual === rule.value;
  if (rule.operator === "in" && Array.isArray(rule.value)) return rule.value.some((item) => item === actual);
  return false;
}

export function evaluateUnderwritingRules(answers: Record<string, QuoteAnswerValue>) {
  const referralReasons: ReferralReason[] = [];
  const warnings: string[] = [];
  let declinedReason: string | undefined;
  const rulesApplied: string[] = [];
  for (const rule of defaultUnderwritingRules) {
    if (!compare(answers[rule.field], rule)) continue;
    rulesApplied.push(rule.code);
    if (rule.type === "BLOCKING") declinedReason = rule.message;
    if (rule.type === "REFERRAL") referralReasons.push({ code: rule.code, label: rule.message });
    if (rule.type === "WARNING") warnings.push(rule.message);
  }
  return { referralReasons, warnings, declinedReason, rulesApplied };
}

export function applyUnderwritingOutcome(base: Omit<PricingResult, "resultType" | "referralReasons" | "warnings" | "reason"> & { warnings?: string[] }, answers: Record<string, QuoteAnswerValue>): PricingResult {
  const rules = evaluateUnderwritingRules(answers);
  if (rules.declinedReason) {
    return { resultType: "DECLINED", netPremium: null, taxes: null, grossPremium: null, currency: "EUR", rulesApplied: [...base.rulesApplied, ...rules.rulesApplied], warnings: rules.warnings, referralReasons: rules.referralReasons, reason: rules.declinedReason };
  }
  if (rules.referralReasons.length) {
    return { resultType: "REFERRAL", netPremium: null, taxes: null, grossPremium: null, currency: "EUR", rulesApplied: [...base.rulesApplied, ...rules.rulesApplied], warnings: rules.warnings, referralReasons: rules.referralReasons };
  }
  return { ...base, resultType: "QUOTABLE", warnings: [...(base.warnings ?? []), ...rules.warnings], referralReasons: [] };
}
