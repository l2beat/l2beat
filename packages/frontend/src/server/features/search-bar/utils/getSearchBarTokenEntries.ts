import { assert } from '@l2beat/shared-pure'
import { getInteropTokenUrl } from '~/pages/interop/utils/getInteropTokenUrl'
import { UNKNOWN_ABSTRACT_TOKEN_ID } from '~/server/features/layer2s/interop/consts'
import type { InteropAbstractToken } from '~/server/features/layer2s/interop/token/getInteropAbstractTokens'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import type { SearchBarTokenEntry } from '../types'

export function getSearchBarTokenEntries(
  tokens: InteropAbstractToken[],
): SearchBarTokenEntry[] {
  return tokens
    .filter((token) => token.id !== UNKNOWN_ABSTRACT_TOKEN_ID)
    .map((token) => {
      const href = getInteropTokenUrl(token)
      assert(href, `Token ${token.id} has no href`)
      return {
        type: 'token',
        category: 'tokens',
        id: token.id,
        name: token.symbol,
        href: href,
        iconUrl: token.iconUrl ?? TOKEN_PLACEHOLDER_ICON_URL,
        issuer: token.issuer,
      }
    })
}
