import { expect } from 'earl'
import { getAbstractTokenSlug } from './getAbstractTokenSlug'

describe(getAbstractTokenSlug.name, () => {
  it('uses issuer and symbol when issuer is present', () => {
    expect(getAbstractTokenSlug({ issuer: 'Circle', symbol: 'USDC' })).toEqual(
      'circle-usdc',
    )
  })

  it('uses only symbol when issuer is null', () => {
    expect(getAbstractTokenSlug({ issuer: null, symbol: 'ETH' })).toEqual('eth')
  })

  it('normalizes casing and special characters', () => {
    expect(
      getAbstractTokenSlug({ issuer: 'Tether.to', symbol: 'USD₮ 0' }),
    ).toEqual('tether-to-usd-0')
  })
})
