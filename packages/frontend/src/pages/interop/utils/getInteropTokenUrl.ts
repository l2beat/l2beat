import { getAbstractTokenSlug } from '~/server/features/scaling/interop/token/getAbstractTokenSlug'
import { buildInteropUrl } from './buildInteropUrl'
import type { InteropSelection } from './types'

export function getInteropTokenUrl(
  token: { id?: string; symbol: string; issuer: string | null },
  selection: InteropSelection,
): string | undefined {
  if (token.id === 'unknown') {
    return undefined
  }

  const path = `/interop/tokens/${getAbstractTokenSlug(token)}`
  return buildInteropUrl(path, selection)
}
