import { UNKNOWN_ABSTRACT_TOKEN_ID } from '~/server/features/scaling/interop/consts'
import {
  type AbstractTokenSlugData,
  getAbstractTokenSlug,
} from '~/server/features/scaling/interop/token/getAbstractTokenSlug'
import { buildInteropUrl } from './buildInteropUrl'
import type { InteropSelection } from './types'

export function getInteropTokenUrl(
  token: AbstractTokenSlugData & { id: string },
  selection: InteropSelection,
): string | undefined {
  if (token.id === UNKNOWN_ABSTRACT_TOKEN_ID) {
    return undefined
  }

  const path = `/interop/tokens/${getAbstractTokenSlug(token)}`
  return buildInteropUrl(path, selection)
}
