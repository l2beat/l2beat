import { expect } from 'earl'
import { L1_USDC } from './test/fixtures'
import { tokenKey } from './tokens'

describe(tokenKey.name, () => {
  it('crops Address32 padding, lowercases and keeps native', () => {
    expect(
      tokenKey({
        chain: 'base',
        address:
          '0x000000000000000000000000A0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      }),
    ).toEqual(`base:${L1_USDC}`)
    expect(tokenKey({ chain: 'base', address: 'NATIVE' })).toEqual(
      'base:native',
    )
  })
})
