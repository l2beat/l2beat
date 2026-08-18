import { expect } from 'earl'
import { UNKNOWN_ABSTRACT_TOKEN_ID } from '~/server/features/scaling/interop/consts'
import { getInteropTokenUrl } from './getInteropTokenUrl'

describe(getInteropTokenUrl.name, () => {
  it('returns undefined for unknown tokens', () => {
    const result = getInteropTokenUrl({
      id: UNKNOWN_ABSTRACT_TOKEN_ID,
      issuer: null,
      symbol: 'UNKNOWN',
    })

    expect(result).toEqual(undefined)
  })

  it('returns undefined for synthetic unknown tokens', () => {
    const result = getInteropTokenUrl({
      id: 'unknown-cctp',
      issuer: null,
      symbol: 'USDC',
      isUnknown: true,
    })

    expect(result).toEqual(undefined)
  })

  it('builds token URL from the token id, issuer and symbol', () => {
    const result = getInteropTokenUrl({
      id: 'usdc01',
      issuer: 'circle',
      symbol: 'USDC',
    })

    expect(result).toEqual('/interop/tokens/usdc01/circle/usdc')
  })

  it('skips the issuer segment when the issuer is unknown', () => {
    const result = getInteropTokenUrl({
      id: 'eth001',
      issuer: null,
      symbol: 'ETH',
    })

    expect(result).toEqual('/interop/tokens/eth001/eth')
  })

  it('slugifies segments that are not URL friendly', () => {
    const result = getInteropTokenUrl({
      id: 'usdce1',
      issuer: 'Circle & Co.',
      symbol: 'USDC.e',
    })

    expect(result).toEqual('/interop/tokens/usdce1/circle-co/usdc-e')
  })

  it('folds accented characters down to ASCII', () => {
    const result = getInteropTokenUrl({
      id: 'usdt01',
      issuer: 'Tether.to',
      symbol: 'USD₮ 0',
    })

    expect(result).toEqual('/interop/tokens/usdt01/tether-to/usd-0')
  })

  it('falls back to the id alone when no segment survives slugification', () => {
    const result = getInteropTokenUrl({
      id: 'bBIepa',
      issuer: null,
      symbol: '屎壳郎',
    })

    expect(result).toEqual('/interop/tokens/bBIepa')
  })
})
