import { UNKNOWN_ABSTRACT_TOKEN_ID } from '~/server/features/layer2s/interop/consts'
import {
  type AbstractTokenSlugData,
  getAbstractTokenSlug,
} from '~/server/features/layer2s/interop/token/getAbstractTokenSlug'

export function getInteropTokenUrl(
  token: AbstractTokenSlugData & { id: string; isUnknown?: boolean },
): string | undefined {
  if (token.isUnknown || token.id === UNKNOWN_ABSTRACT_TOKEN_ID) {
    return undefined
  }

  return `/interop/tokens/${getAbstractTokenSlug(token)}`
}
