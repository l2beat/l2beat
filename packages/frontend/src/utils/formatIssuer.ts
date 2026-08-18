export function formatIssuer(issuer: string): string {
  return issuer.replace(/(^|\s)\p{L}/gu, (match) => match.toUpperCase())
}
