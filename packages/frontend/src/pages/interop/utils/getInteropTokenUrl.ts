import { UNKNOWN_ABSTRACT_TOKEN_ID } from '~/server/features/scaling/interop/consts'

export function getInteropTokenUrl(token: {
  id: string
  symbol: string
  isUnknown?: boolean
}): string | undefined {
  if (token.isUnknown || token.id === UNKNOWN_ABSTRACT_TOKEN_ID) {
    return undefined
  }

  return `/interop/tokens/${token.id}`
}
