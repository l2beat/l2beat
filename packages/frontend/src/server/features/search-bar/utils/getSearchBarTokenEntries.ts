import { UNKNOWN_ABSTRACT_TOKEN_ID } from '~/server/features/scaling/interop/consts'
import type { InteropAbstractToken } from '~/server/features/scaling/interop/token/getInteropAbstractTokens'
import { getInteropTokenPath } from '~/server/features/scaling/interop/token/getInteropTokenPath'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import type { SearchBarTokenEntry } from '../types'

export function getSearchBarTokenEntries(
  tokens: InteropAbstractToken[],
): SearchBarTokenEntry[] {
  return tokens
    .filter((token) => token.id !== UNKNOWN_ABSTRACT_TOKEN_ID)
    .map((token) => ({
      type: 'token',
      category: 'tokens',
      id: token.id,
      name: token.symbol,
      href: getInteropTokenPath(token),
      iconUrl: token.iconUrl ?? TOKEN_PLACEHOLDER_ICON_URL,
      issuer: token.issuer,
    }))
}
