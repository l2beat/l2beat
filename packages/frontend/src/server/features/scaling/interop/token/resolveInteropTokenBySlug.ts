import type { InteropAbstractToken } from './getInteropAbstractTokens'

export function resolveInteropTokenBySlug(
  tokens: InteropAbstractToken[],
  slug: string,
): InteropAbstractToken | undefined {
  return tokens.find((token) => token.id === slug)
}
