/**
 * Builds the token page path. The token is identified by its id alone —
 * the trailing symbol segment is decorative and ignored during routing.
 */
export function getInteropTokenPath(token: {
  id: string
  symbol: string
}): string {
  const symbolSlug = slugify(token.symbol)
  return symbolSlug
    ? `/interop/tokens/${token.id}/${symbolSlug}`
    : `/interop/tokens/${token.id}`
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
