export function sendEmailMock(to: string, subject: string) {
  return { provider: "email-mock", to, subject, status: "SENT", sentAt: new Date().toISOString() };
}
