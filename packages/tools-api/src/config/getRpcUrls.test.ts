import type { ChainConfig } from '@l2beat/config'
import { expect, mockObject } from 'earl'
import { getRpcUrls } from './getRpcUrls'
import type { Chain } from './types'

describe(getRpcUrls.name, () => {
  const taikoConfig = mockObject<ChainConfig>({
    chainId: 167000,
    apis: [
      { type: 'etherscan', chainId: 167000 },
      { type: 'rpc', url: 'https://rpc.mainnet.taiko.xyz', callsPerMinute: 1 },
    ],
  })

  it('prefers Alchemy and falls back to the project RPC of the same chain id', () => {
    const chains = [
      mockObject<Chain>({ chainId: 1, alchemyId: 'eth-mainnet' }),
      mockObject<Chain>({ chainId: 167000, alchemyId: undefined }),
    ]

    expect(getRpcUrls(chains, 'key', [taikoConfig])).toEqual({
      1: 'https://eth-mainnet.g.alchemy.com/v2/key',
      167000: 'https://rpc.mainnet.taiko.xyz',
    })
  })

  it('throws when a chain has neither Alchemy nor a project RPC', () => {
    const chains = [mockObject<Chain>({ chainId: 10, alchemyId: undefined })]

    expect(() => getRpcUrls(chains, 'key', [taikoConfig])).toThrow(
      'No RPC URL for chain',
    )
  })
})
