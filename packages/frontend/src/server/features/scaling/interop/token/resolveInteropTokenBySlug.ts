import { getAbstractTokenSlug } from './getAbstractTokenSlug'
import type { InteropAbstractToken } from './getInteropAbstractTokens'

export function resolveInteropTokenBySlug(
  tokens: InteropAbstractToken[],
  slug: string,
): InteropAbstractToken | undefined {
  return new Map(
    tokens.map((token) => [getAbstractTokenSlug(token), token]),
  ).get(slug)
}
