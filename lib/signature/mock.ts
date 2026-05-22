import { nanoid } from "nanoid";
export function createSignatureRequestMock(policyId: string) {
  return { id: `sig-${nanoid(8)}`, policyId, status: "REQUEST_CREATED", otpChannel: "email", expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() };
}
