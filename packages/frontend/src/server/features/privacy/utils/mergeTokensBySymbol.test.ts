import type { ProjectPrivacyToken } from '@l2beat/config'
import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { mergeTokensBySymbol } from './mergeTokensBySymbol'

const POOL = EthereumAddress('0x12D66f87A04A9E220743712cE6d9bB1B5616B8Fc')
const NAMES = new Map([
  ['base', 'Base Chain'],
  ['optimism', 'OP Mainnet'],
])

describe(mergeTokensBySymbol.name, () => {
  it('makes one token of a symbol held on several chains', () => {
    const merged = mergeTokensBySymbol(
      [
        token('WETH', 'base', 'a'),
        token('USDC', 'base', 'b'),
        token('WETH', 'optimism', 'c'),
      ],
      NAMES,
    )

    expect(merged.map((t) => t.token.symbol)).toEqual(['WETH', 'USDC'])
    expect(merged[0]?.buckets.map((b) => [b.id, b.label])).toEqual([
      ['a', 'Pool on Base Chain'],
      ['c', 'Pool on OP Mainnet'],
    ])
  })

  it('leaves a symbol held on one chain as it is', () => {
    const usdc = token('USDC', 'base', 'b')
    expect(mergeTokensBySymbol([usdc], NAMES)).toEqual([usdc])
  })
})

function token(symbol: string, chain: string, bucketId: string) {
  return {
    token: { symbol },
    buckets: [
      {
        id: bucketId,
        label: 'Pool',
        address: ChainSpecificAddress.fromLong(chain, POOL),
      },
    ],
  } as unknown as ProjectPrivacyToken
}
