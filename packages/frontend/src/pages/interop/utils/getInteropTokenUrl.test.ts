import { expect } from 'earl'
import { UNKNOWN_ABSTRACT_TOKEN_ID } from '~/server/features/scaling/interop/consts'
import { getInteropTokenUrl } from './getInteropTokenUrl'

describe(getInteropTokenUrl.name, () => {
  it('returns undefined for unknown tokens', () => {
    const result = getInteropTokenUrl(
      { id: UNKNOWN_ABSTRACT_TOKEN_ID, issuer: null, symbol: 'Unknown' },
      { from: ['ethereum'], to: ['arbitrum'] },
    )

    expect(result).toEqual(undefined)
  })

  it('returns undefined for synthetic unknown tokens', () => {
    const result = getInteropTokenUrl(
      { id: 'unknown-cctp', issuer: null, symbol: 'Unknown', isUnknown: true },
      { from: ['ethereum'], to: ['arbitrum'] },
    )

    expect(result).toEqual(undefined)
  })

  it('builds token URL preserving chain selection', () => {
    const result = getInteropTokenUrl(
      { id: 'usdc', issuer: 'circle', symbol: 'USDC' },
      { from: ['ethereum'], to: ['arbitrum'] },
    )

    expect(result).toEqual(
      '/interop/tokens/circle-usdc?from=ethereum&to=arbitrum',
    )
  })

  it('returns path with query when selection has multiple chains', () => {
    const result = getInteropTokenUrl(
      { id: 'eth', issuer: null, symbol: 'ETH' },
      { from: ['ethereum', 'arbitrum'], to: ['base'] },
    )

    expect(result).toEqual(
      '/interop/tokens/eth?from=ethereum%2Carbitrum&to=base',
    )
  })
})
