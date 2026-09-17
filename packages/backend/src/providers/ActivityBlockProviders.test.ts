import type { AztecBlockProvider, BlockProvider } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'
import type { UopsAnalyzer } from '../modules/activity/services/uops/types'
import {
  ActivityBlockProviders,
  AztecActivityBlockProvider,
  StandardActivityBlockProvider,
} from './ActivityBlockProviders'
import type { AztecBlockProviders } from './AztecBlockProviders'
import type { BlockProviders } from './BlockProviders'
import type { UopsAnalyzers } from './UopsAnalyzers'

describe(ActivityBlockProviders.name, () => {
  it('rejects duplicate chain providers', () => {
    const blockProvider = {
      chain: 'aztecnetwork',
    } as unknown as BlockProvider
    const aztecBlockProvider = {
      chain: 'aztecnetwork',
    } as unknown as AztecBlockProvider

    expect(
      () =>
        new ActivityBlockProviders(
          {
            getAll: vi.fn(() => [blockProvider]),
          } as unknown as BlockProviders,
          {
            getAll: vi.fn(() => [aztecBlockProvider]),
          } as unknown as AztecBlockProviders,
          {
            getUopsAnalyzer: vi.fn(() => undefined),
          } as unknown as UopsAnalyzers,
        ),
    ).toThrow('ActivityBlockProvider already exists: aztecnetwork')
  })
})

describe(StandardActivityBlockProvider.name, () => {
  it('maps normalized block transactions and uops to activity blocks', async () => {
    const blockProvider = {
      chain: 'ethereum',
      getBlockWithTransactions: vi.fn().mockResolvedValueOnce({
        number: 10,
        timestamp: UnixTime(1_700_000_000),
        transactions: [{}, {}],
      }),
    } as unknown as BlockProvider
    const uopsAnalyzer = {
      calculateUops: vi.fn().mockReturnValueOnce(5),
    } as unknown as UopsAnalyzer
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
    const blockProvider = {
      chain: 'aztecnetwork',
      getBlocks: vi.fn().mockResolvedValueOnce([
        { number: 10, timestamp: 1_700_000_000, txEffectsCount: 2 },
        { number: 11, timestamp: 1_700_003_600, txEffectsCount: 3 },
      ]),
    } as unknown as AztecBlockProvider
    const provider = new AztecActivityBlockProvider(blockProvider)

    const result = await provider.getBlocks(10, 11)

    expect(blockProvider.getBlocks).toHaveBeenCalledExactlyOnceWith(10, 2)
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
