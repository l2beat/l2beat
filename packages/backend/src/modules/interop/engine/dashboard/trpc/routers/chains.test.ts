import type { Database } from '@l2beat/database'
import { expect, mockFn, mockObject } from 'earl'
import { createCallerFactory } from '../../../../../../trpc/init'
import { createChainsRouter } from './chains'

describe(createChainsRouter.name, () => {
  it('returns metadata enriched with capture and one-sided flags', async () => {
    const caller = createCaller()

    const result = await caller.metadata()

    expect(result.find((chain) => chain.id === 'ethereum')).toEqual({
      id: 'ethereum',
      name: 'Ethereum',
      display: 'ETH',
      explorerUrl: 'https://explorer.example/ethereum',
      isCaptureChain: true,
      isOneSided: false,
    })
    expect(result.find((chain) => chain.id === 'solana')).toEqual({
      id: 'solana',
      name: 'Solana',
      display: 'SOL',
      explorerUrl: 'https://explorer.example/solana',
      isCaptureChain: false,
      isOneSided: true,
    })
  })

  it('returns chain summaries including unknown observed chains', async () => {
    const getChainSummaryStats = mockFn().resolvesTo([
      {
        chain: 'ethereum',
        outgoingTransfersCount: 2,
        outgoingValueUsd: 100,
        incomingTransfersCount: 1,
        incomingValueUsd: 40,
      },
      {
        chain: 'solana',
        outgoingTransfersCount: 0,
        outgoingValueUsd: 0,
        incomingTransfersCount: 3,
        incomingValueUsd: 75,
      },
      {
        chain: 'mysterychain',
        outgoingTransfersCount: 1,
        outgoingValueUsd: 10,
        incomingTransfersCount: 0,
        incomingValueUsd: 0,
      },
    ])
    const caller = createCaller(
      {
        captureEnabled: false,
      },
      {
        interopTransfer: mockObject<Database['interopTransfer']>({
          getChainSummaryStats,
        }),
      },
    )

    const result = await caller.summary()

    expect(getChainSummaryStats).toHaveBeenCalledTimes(1)
    expect(result.captureEnabled).toEqual(false)
    expect(result.rows[0]).toEqual({
      id: 'ethereum',
      name: 'Ethereum',
      display: 'ETH',
      explorerUrl: 'https://explorer.example/ethereum',
      isKnownChain: true,
      isCaptureChain: true,
      isOneSided: false,
      outgoingTransfersCount: 2,
      outgoingValueUsd: 100,
      incomingTransfersCount: 1,
      incomingValueUsd: 40,
      totalTransfersCount: 3,
      totalValueUsd: 140,
    })
    expect(result.rows.find((chain) => chain.id === 'solana')).toEqual({
      id: 'solana',
      name: 'Solana',
      display: 'SOL',
      explorerUrl: 'https://explorer.example/solana',
      isKnownChain: true,
      isCaptureChain: false,
      isOneSided: true,
      outgoingTransfersCount: 0,
      outgoingValueUsd: 0,
      incomingTransfersCount: 3,
      incomingValueUsd: 75,
      totalTransfersCount: 3,
      totalValueUsd: 75,
    })
    expect(result.rows.find((chain) => chain.id === 'mysterychain')).toEqual({
      id: 'mysterychain',
      name: 'mysterychain',
      display: 'mysterychain',
      explorerUrl: 'https://explorer.example/mysterychain',
      isKnownChain: false,
      isCaptureChain: false,
      isOneSided: false,
      outgoingTransfersCount: 1,
      outgoingValueUsd: 10,
      incomingTransfersCount: 0,
      incomingValueUsd: 0,
      totalTransfersCount: 1,
      totalValueUsd: 10,
    })
  })
})

function createCaller(
  deps?: Partial<Parameters<typeof createChainsRouter>[0]>,
  db?: Partial<Database>,
) {
  const callerFactory = createCallerFactory(
    createChainsRouter({
      captureEnabled: true,
      chains: [{ id: 'ethereum', type: 'evm' }],
      oneSidedChains: ['solana'],
      getExplorerUrl: (chain) => `https://explorer.example/${chain}`,
      ...deps,
    }),
  )

  return callerFactory({
    headers: new Headers(),
    db: mockObject<Database>(db ?? {}),
    session: { email: 'user@example.com' },
  })
}
