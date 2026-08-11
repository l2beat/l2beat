export interface AbstractTokenSlugData {
  symbol: string
  issuer: string | null
}

export function getAbstractTokenSlug(token: AbstractTokenSlugData): string {
  const symbolSlug = slugify(token.symbol)
  return token.issuer ? `${slugify(token.issuer)}-${symbolSlug}` : symbolSlug
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
