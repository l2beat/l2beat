import { expect } from 'earl'
import { splitChainPrefix } from './splitChainPrefix'

const ADDRESS = '0x94bAB9693Ba2f6358507eFfcbd372b0660AFfF9d'

describe(splitChainPrefix.name, () => {
  it('leaves a bare address without a chain', () => {
    expect(splitChainPrefix(`  ${ADDRESS} `)).toEqual({
      chain: undefined,
      address: ADDRESS,
    })
  })

  it('reads a short name prefix', () => {
    expect(splitChainPrefix(`arb1:${ADDRESS}`)).toEqual({
      chain: 'arb1',
      address: ADDRESS,
    })
  })

  it('reads a full chain name prefix and maps it to the short name', () => {
    expect(splitChainPrefix(`Arbitrum:${ADDRESS}`)).toEqual({
      chain: 'arb1',
      address: ADDRESS,
    })
  })

  it('keeps an unknown prefix as part of the address', () => {
    expect(splitChainPrefix(`nope:${ADDRESS}`)).toEqual({
      chain: undefined,
      address: `nope:${ADDRESS}`,
    })
  })

  it('reads an explorer link and drops the trailing path and query', () => {
    expect(
      splitChainPrefix(`https://basescan.org/address/${ADDRESS}#code`),
    ).toEqual({ chain: 'base', address: ADDRESS })
    expect(
      splitChainPrefix(`https://etherscan.io/address/${ADDRESS}/code?a=1`),
    ).toEqual({ chain: 'eth', address: ADDRESS })
    expect(
      splitChainPrefix(`https://katanascan.com/address/${ADDRESS}`),
    ).toEqual({ chain: 'katana', address: ADDRESS })
  })
})
