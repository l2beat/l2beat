import type { AztecBlockProvider, BlockProvider } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import type { UopsAnalyzer } from '../modules/activity/services/uops/types'
import {
  AztecActivityBlockProvider,
  StandardActivityBlockProvider,
} from './ActivityBlockProviders'

describe(StandardActivityBlockProvider.name, () => {
  it('maps normalized block transactions and uops to activity blocks', async () => {
    const blockProvider = mockObject<BlockProvider>({
      chain: 'ethereum',
      getBlockWithTransactions: mockFn().resolvesToOnce({
        number: 10,
        timestamp: UnixTime(1_700_000_000),
        transactions: [{}, {}],
      }),
    })
    const uopsAnalyzer = mockObject<UopsAnalyzer>({
      calculateUops: mockFn().returnsOnce(5),
    })
    const provider = new StandardActivityBlockProvider(
      blockProvider,
      uopsAnalyzer,
    )

    const result = await provider.getBlocks(10, 10)

    expect(result).toEqual([
      {
        number: 10,
        timestamp: UnixTime(1_700_000_000),
        txsCount: 2,
        uopsCount: 5,
      },
    ])
  })
})

describe(AztecActivityBlockProvider.name, () => {
  it('maps transaction effects to activity blocks in one range request', async () => {
    const blockProvider = mockObject<AztecBlockProvider>({
      chain: 'aztecnetwork',
      getBlocks: mockFn().resolvesToOnce([
        { number: 10, timestamp: 1_700_000_000, txEffectsCount: 2 },
        { number: 11, timestamp: 1_700_003_600, txEffectsCount: 3 },
      ]),
    })
    const provider = new AztecActivityBlockProvider(blockProvider)

    const result = await provider.getBlocks(10, 11)

    expect(blockProvider.getBlocks).toHaveBeenOnlyCalledWith(10, 2)
    expect(result).toEqual([
      {
        number: 10,
        timestamp: 1_700_000_000,
        txsCount: 2,
        uopsCount: null,
      },
      {
        number: 11,
        timestamp: 1_700_003_600,
        txsCount: 3,
        uopsCount: null,
      },
    ])
  })
})
