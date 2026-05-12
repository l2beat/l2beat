import { expect } from 'earl'
import { getInteropTokenUrl } from './getInteropTokenUrl'

describe(getInteropTokenUrl.name, () => {
  it('builds token URL preserving selectedChains', () => {
    const result = getInteropTokenUrl(
      { issuer: 'circle', symbol: 'USDC' },
      { from: ['ethereum'], to: ['arbitrum'] },
    )

    expect(result).toEqual(
      '/interop/tokens/circle-usdc?selectedChains=ethereum%2Carbitrum',
    )
  })

  it('returns path without query when selection is not one pair', () => {
    const result = getInteropTokenUrl(
      { issuer: null, symbol: 'ETH' },
      { from: ['ethereum', 'arbitrum'], to: ['base'] },
    )

    expect(result).toEqual('/interop/tokens/eth')
  })
})
