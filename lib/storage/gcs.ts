export function createSignedUrlMock(documentId: string) {
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  return { url: `https://storage.googleapis.com/private-axieme-demo/${documentId}?signature=mock&expires=${encodeURIComponent(expiresAt)}`, expiresAt };
}
