import { expect } from 'earl'
import { formatIssuer } from './formatIssuer'

describe(formatIssuer.name, () => {
  it('capitalizes the first letter of each word', () => {
    expect(formatIssuer('circle internet financial')).toEqual(
      'Circle Internet Financial',
    )
  })

  it('preserves existing casing', () => {
    expect(formatIssuer('USDC issuer')).toEqual('USDC Issuer')
    expect(formatIssuer('Tether.to')).toEqual('Tether.to')
  })

  it('supports non-ASCII letters', () => {
    expect(formatIssuer('éthena labs')).toEqual('Éthena Labs')
  })
})
