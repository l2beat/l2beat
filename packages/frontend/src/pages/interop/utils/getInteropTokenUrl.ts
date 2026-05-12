import { getAbstractTokenSlug } from '~/server/features/scaling/interop/token/getAbstractTokenSlug'
import { buildInteropUrl } from './buildInteropUrl'
import type { InteropSelection } from './types'

export function getInteropTokenUrl(
  token: { symbol: string; issuer: string | null },
  selection: InteropSelection,
) {
  const path = `/interop/tokens/${getAbstractTokenSlug(token)}`
  return buildInteropUrl(path, selection, 'public')
}
