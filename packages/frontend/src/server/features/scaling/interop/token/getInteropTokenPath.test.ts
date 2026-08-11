import { expect } from 'earl'
import { getInteropTokenPath } from './getInteropTokenPath'

describe(getInteropTokenPath.name, () => {
  it('appends the slugified symbol to the token id', () => {
    expect(getInteropTokenPath({ id: 'usdc01', symbol: 'USDC' })).toEqual(
      '/interop/tokens/usdc01/usdc',
    )
  })

  it('normalizes casing and special characters in the symbol', () => {
    expect(getInteropTokenPath({ id: 'usdt01', symbol: 'USD₮ 0' })).toEqual(
      '/interop/tokens/usdt01/usd-0',
    )
  })

  it('omits the symbol segment when it slugifies to nothing', () => {
    expect(getInteropTokenPath({ id: 'tkn001', symbol: '₮' })).toEqual(
      '/interop/tokens/tkn001',
    )
  })
})
