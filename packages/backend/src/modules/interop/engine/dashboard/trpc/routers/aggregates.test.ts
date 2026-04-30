import type { Database, InteropTransferRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { createCallerFactory } from '../../../../../../trpc/init'
import { createAggregatesRouter } from './aggregates'

describe(createAggregatesRouter.name, () => {
  it('returns latest aggregate coverage diagnostics', async () => {
    const latestTimestamp = UnixTime(1_700_000_000)
    const transfers: InteropTransferRecord[] = [
      createTransfer({
        transferId: 'included-deposit',
        plugin: 'across',
        type: 'deposit',
        srcValueUsd: 10,
        dstValueUsd: 10,
      }),
      createTransfer({
        transferId: 'included-withdraw',
        plugin: 'across',
        type: 'withdraw',
        srcValueUsd: 20,
        dstValueUsd: 20,
      }),
      createTransfer({
        transferId: 'included-one-sided',
        plugin: 'across',
        type: 'deposit',
        bridgeType: undefined,
        srcEventId: 'src-only-event',
        dstEventId: undefined,
        srcWasBurned: false,
        dstWasMinted: undefined,
        srcValueUsd: 15,
        dstValueUsd: undefined,
      }),
      createTransfer({
        transferId: 'missing-relay',
        plugin: 'relay',
        type: 'send',
        srcValueUsd: 30,
        dstValueUsd: 30,
      }),
    ]

    const aggregatedInteropTransfer = mockObject<
      Database['aggregatedInteropTransfer']
    >({
      getLatestTimestamp: mockFn().resolvesTo(latestTimestamp),
    })
    const interopTransfer = mockObject<Database['interopTransfer']>({
      getByRange: mockFn().resolvesTo(transfers),
    })
    const db = mockObject<Database>({
      aggregatedInteropTransfer,
      interopTransfer,
    })

    const callerFactory = createCallerFactory(
      createAggregatesRouter({
        aggregationConfigs: [
          {
            id: 'across',
            type: 'other',
            plugins: [{ plugin: 'across', bridgeType: 'lockAndMint' }],
            durationSplit: {
              lockAndMint: [
                {
                  label: 'Fast',
                  transferTypes: ['deposit'],
                },
              ],
            },
          },
        ],
      }),
    )
    const caller = callerFactory({
      headers: new Headers(),
      db,
      session: { email: 'dev@l2beat.com' },
    })

    const result = await caller.latest()

    expect(result.latestTimestamp).toEqual(latestTimestamp)
    expect(result.latestTransfersCount).toEqual(4)
    expect(result.includedTransfersCount).toEqual(3)
    expect(result.notIncludedTransfers).toHaveLength(1)
    expect(result.notIncludedTransfers[0]?.transferId).toEqual('missing-relay')
    expect(result.notIncludedByPlugin).toEqual([
      {
        plugin: 'relay',
        bridgeType: 'lockAndMint',
        count: 1,
        totalValueUsd: 30,
      },
    ])
    expect(result.durationSplitCoverage).toEqual([
      {
        projectId: 'across',
        projectName: 'across',
        bridgeType: 'lockAndMint',
        observedTransferTypes: ['deposit', 'withdraw'],
        includedSplits: [
          {
            label: 'Fast',
            transferTypes: ['deposit'],
          },
        ],
        notIncludedTransferTypes: ['withdraw'],
      },
    ])
    expect(result.aggregationConfigured).toEqual(true)
    expect(result.aggregationConfigsCount).toEqual(1)
  })

  it('returns disabled state when aggregation configs are unavailable', async () => {
    const db = mockObject<Database>({})

    const callerFactory = createCallerFactory(
      createAggregatesRouter({
        aggregationConfigs: [],
      }),
    )
    const caller = callerFactory({
      headers: new Headers(),
      db,
      session: { email: 'dev@l2beat.com' },
    })

    const result = await caller.latest()

    expect(result).toEqual({
      aggregationConfigured: false,
      aggregationConfigsCount: 0,
      latestTimestamp: null,
      latestTransfersCount: 0,
      includedTransfersCount: 0,
      notIncludedTransfers: [],
      notIncludedByPlugin: [],
      durationSplitCoverage: [],
    })
  })
})

function createTransfer(
  overrides: Partial<InteropTransferRecord>,
): InteropTransferRecord {
  return {
    plugin: 'across',
    bridgeType: 'lockAndMint',
    transferId: 'transfer-id',
    type: 'deposit',
    duration: 60,
    timestamp: UnixTime(1_700_000_000 - 60),
    srcTime: undefined,
    srcChain: 'ethereum',
    srcTxHash: '0xsrc',
    srcLogIndex: 0,
    srcEventId: undefined,
    srcTokenAddress: '0xsrc-token',
    srcRawAmount: undefined,
    srcWasBurned: false,
    srcAbstractTokenId: 'eth',
    srcSymbol: 'ETH',
    srcAmount: 1,
    srcPrice: 10,
    srcValueUsd: 10,
    dstTime: undefined,
    dstChain: 'arbitrum',
    dstTxHash: '0xdst',
    dstLogIndex: 0,
    dstEventId: undefined,
    dstTokenAddress: '0xdst-token',
    dstRawAmount: undefined,
    dstWasMinted: true,
    dstAbstractTokenId: 'eth',
    dstSymbol: 'ETH',
    dstAmount: 1,
    dstPrice: 10,
    dstValueUsd: 10,
    isProcessed: true,
    ...overrides,
  }
}
