import { expect } from 'earl'
import { UNKNOWN_ABSTRACT_TOKEN_ID } from '~/server/features/scaling/interop/consts'
import type { InteropAbstractToken } from '~/server/features/scaling/interop/token/getInteropAbstractTokens'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import { getSearchBarTokenEntries } from './getSearchBarTokenEntries'

describe(getSearchBarTokenEntries.name, () => {
  it('maps tokens to entries linking to their token page', () => {
    const entries = getSearchBarTokenEntries([
      token({ id: 'usdc01', symbol: 'USDC', issuer: 'circle' }),
    ])

    expect(entries).toEqual([
      {
        type: 'token',
        category: 'tokens',
        id: 'usdc01',
        name: 'USDC',
        href: '/interop/tokens/usdc01/circle/usdc',
        iconUrl: 'https://example.com/icon.png',
        issuer: 'circle',
      },
    ])
  })

  it('links issuerless tokens by id and symbol and falls back to the placeholder icon', () => {
    const entries = getSearchBarTokenEntries([
      token({ id: 'eth001', symbol: 'ETH', issuer: null, iconUrl: null }),
    ])

    expect(entries[0]?.href).toEqual('/interop/tokens/eth001/eth')
    expect(entries[0]?.iconUrl).toEqual(TOKEN_PLACEHOLDER_ICON_URL)
  })

  it('omits the unknown abstract token', () => {
    const entries = getSearchBarTokenEntries([
      token({ id: UNKNOWN_ABSTRACT_TOKEN_ID, symbol: 'UNKNOWN' }),
    ])

    expect(entries).toEqual([])
  })
})

function token(overrides: Partial<InteropAbstractToken>): InteropAbstractToken {
  return {
    id: 'tkn001',
    symbol: 'TKN',
    issuer: null,
    iconUrl: 'https://example.com/icon.png',
    category: 'stablecoin',
    ...overrides,
  }
}
