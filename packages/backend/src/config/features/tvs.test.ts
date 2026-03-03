import type { Project, TvsToken } from '@l2beat/config'
import { EthereumAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'

import { adjustTokensRange } from './tvs'

type AmountWithChain = Extract<TvsToken['amount'], { chain: string }>

describe(adjustTokensRange.name, () => {
  const chainSince = 1000
  const chainUntil = 2000

  const projectsWithChains: Project<'chainConfig'>[] = [
    mockObject<Project<'chainConfig'>>({
      chainConfig: {
        name: 'form',
        chainId: 478,
        sinceTimestamp: chainSince,
        untilTimestamp: chainUntil,
        apis: [],
      },
    }),
  ]

  it('clamps sinceTimestamp when token starts before chain', () => {
    const token = mockObject<TvsToken>({
      amount: {
        type: 'totalSupply',
        address: EthereumAddress.ZERO,
        chain: 'form',
        decimals: 18,
        sinceTimestamp: 500,
      },
    })
    adjustTokensRange([token], projectsWithChains)
    expect((token.amount as AmountWithChain).sinceTimestamp).toEqual(chainSince)
  })

  it('clamps untilTimestamp when token ends after chain', () => {
    const token = mockObject<TvsToken>({
      amount: {
        type: 'totalSupply',
        address: EthereumAddress.ZERO,
        chain: 'form',
        decimals: 18,
        sinceTimestamp: 1500,
        untilTimestamp: 3000,
      },
    })
    adjustTokensRange([token], projectsWithChains)
    expect((token.amount as AmountWithChain).untilTimestamp).toEqual(chainUntil)
  })

  it('leaves token unchanged when within chain range', () => {
    const token = mockObject<TvsToken>({
      amount: {
        type: 'balanceOfEscrow',
        address: EthereumAddress.ZERO,
        chain: 'form',
        escrowAddress: EthereumAddress.ZERO,
        decimals: 18,
        sinceTimestamp: 1200,
        untilTimestamp: 1800,
      },
    })
    adjustTokensRange([token], projectsWithChains)
    expect((token.amount as AmountWithChain).sinceTimestamp).toEqual(1200)
    expect((token.amount as AmountWithChain).untilTimestamp).toEqual(1800)
  })

  it('skips tokens without chain in amount', () => {
    const token = mockObject<TvsToken>({
      amount: {
        type: 'const',
        value: '100',
        decimals: 0,
        sinceTimestamp: 0,
      },
    })
    adjustTokensRange([token], projectsWithChains)
    expect(token.amount).toEqual({
      type: 'const',
      value: '100',
      decimals: 0,
      sinceTimestamp: 0,
    })
  })

  it('skips when chain not in config', () => {
    const token = mockObject<TvsToken>({
      amount: {
        type: 'totalSupply',
        address: EthereumAddress.ZERO,
        chain: 'unknown-chain',
        decimals: 18,
        sinceTimestamp: 500,
      },
    })
    adjustTokensRange([token], projectsWithChains)
    expect((token.amount as AmountWithChain).sinceTimestamp).toEqual(500)
  })

  it('sets untilTimestamp when token has no untilTimestamp', () => {
    const token = mockObject<TvsToken>({
      amount: {
        type: 'totalSupply',
        address: EthereumAddress.ZERO,
        chain: 'form',
        decimals: 18,
        sinceTimestamp: 1500,
      },
    })
    adjustTokensRange([token], projectsWithChains)
    expect((token.amount as AmountWithChain).untilTimestamp).toEqual(chainUntil)
  })
})
