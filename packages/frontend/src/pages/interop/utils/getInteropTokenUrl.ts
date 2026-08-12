import { UNKNOWN_ABSTRACT_TOKEN_ID } from '~/server/features/scaling/interop/consts'

/**
 * Builds `/interop/tokens/{id}/{issuer}/{symbol}`. The issuer and symbol
 * segments are decorative - the page is resolved by id alone, so links that
 * omit them or carry stale ones still land on the right token.
 */
export function getInteropTokenUrl(token: {
  id: string
  issuer?: string | null
  symbol?: string | null
  isUnknown?: boolean
}): string | undefined {
  if (token.isUnknown || token.id === UNKNOWN_ABSTRACT_TOKEN_ID) {
    return undefined
  }

  const suffix = [
    toUrlSegment(token.issuer),
    toUrlSegment(token.symbol),
  ].filter((segment) => segment !== undefined)

  return ['/interop/tokens', token.id, ...suffix].join('/')
}

function toUrlSegment(value: string | null | undefined): string | undefined {
  if (!value) return undefined

  const segment = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return segment !== '' ? segment : undefined
}
