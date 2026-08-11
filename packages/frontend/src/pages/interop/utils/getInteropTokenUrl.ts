import { UNKNOWN_ABSTRACT_TOKEN_ID } from '~/server/features/scaling/interop/consts'
import { getInteropTokenPath } from '~/server/features/scaling/interop/token/getInteropTokenPath'

export function getInteropTokenUrl(token: {
  id: string
  symbol: string
  isUnknown?: boolean
}): string | undefined {
  if (token.isUnknown || token.id === UNKNOWN_ABSTRACT_TOKEN_ID) {
    return undefined
  }

  return getInteropTokenPath(token)
}
