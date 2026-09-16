import { describe, expect, it } from 'vitest'
import { toShortenedAddress } from './toShortenedAddress'

describe(toShortenedAddress.name, () => {
  it('shortens a chain-specific address', () => {
    expect(
      toShortenedAddress(
        'robinhood:0x94bAB9693Ba2f6358507eFfcbd372b0660AFfF9d',
      ),
    ).toStrictEqual('robinhood:0x94bA…fF9d')
  })

  it('handles an address without a chain prefix', () => {
    expect(
      toShortenedAddress('0x94bAB9693Ba2f6358507eFfcbd372b0660AFfF9d'),
    ).toStrictEqual('0x94bA…fF9d')
  })
})
