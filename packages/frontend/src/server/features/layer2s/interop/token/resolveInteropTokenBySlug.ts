import { getAbstractTokenSlug } from './getAbstractTokenSlug'
import type { InteropAbstractToken } from './getInteropAbstractTokens'

export function resolveInteropTokenBySlug(
  tokens: InteropAbstractToken[],
  slug: string,
): InteropAbstractToken | undefined {
  return tokens.find((token) => getAbstractTokenSlug(token) === slug)
}
