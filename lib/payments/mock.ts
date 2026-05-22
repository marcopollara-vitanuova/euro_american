import { nanoid } from "nanoid";
export function createPaymentLinkMock(quoteId: string, amount: number) {
  return { id: `pay-${nanoid(8)}`, quoteId, amount, status: "LINK_GENERATED", providerPaymentId: `mock-${nanoid(10)}`, url: `/api/payments/mock/${quoteId}` };
}
