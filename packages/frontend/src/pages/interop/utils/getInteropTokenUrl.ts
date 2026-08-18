import { UNKNOWN_ABSTRACT_TOKEN_ID } from '~/server/features/scaling/interop/consts'

/**
 * Builds `/interop/tokens/{id}/{issuer}/{symbol}`. The issuer and symbol
 * segments are decorative - the page is resolved by id alone, so links that
 * carry stale segments still land on the right token.
 */
export function getInteropTokenUrl(token: {
  id: string
  symbol: string
  issuer: string | null
  isUnknown?: boolean
}): string | undefined {
  if (token.isUnknown || token.id === UNKNOWN_ABSTRACT_TOKEN_ID) {
    return undefined
  }

  const suffix = [token.issuer ?? '', token.symbol]
    .map(slugify)
    .filter((segment) => segment !== '')

  return ['/interop/tokens', token.id, ...suffix].join('/')
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      // NFKD splits accented letters into a base letter plus a combining mark,
      // so "é" becomes "e" once the marks are dropped below.
      .normalize('NFKD')
      // Drops the combining diacritical marks NFKD just separated out.
      .replace(/[̀-ͯ]/g, '')
      // Collapses every run of non-alphanumeric characters into a single dash,
      // which also strips anything NFKD could not fold into ASCII.
      .replace(/[^a-z0-9]+/g, '-')
      // Trims the leading and trailing dashes left by the previous step.
      .replace(/^-+|-+$/g, '')
  )
}
