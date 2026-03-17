import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import type { BlockDaIndexedConfig } from '../../../config/Config'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../../tools/uif/ManagedChildIndexer'
import { matchEthereumProject } from '../services/DaService'

interface Dependencies extends Omit<ManagedChildIndexerOptions, 'name'> {
  db: Database
  ethereumConfigs: BlockDaIndexedConfig[]
}

export interface UnmatchedBlobPair {
  from: string
  to: string | null
  count: number
}

export class DaBlobNotifierIndexer extends ManagedChildIndexer {
  constructor(
    private readonly $: Dependencies,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: INDEXER_NAMES.DA_BLOB_NOTIFIER,
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )
  }

  async update(_from: number, to: number): Promise<number> {
    // Only run at 1 AM UTC
    // if (UnixTime.toStartOf(to, 'day') + 1 * UnixTime.HOUR !== to) {
    //   return to
    // }

    const unmatchedPairs = await this.getUnmatchedPairs(to)

    if (unmatchedPairs.length > 0) {
      console.table(unmatchedPairs)
    }

    return to
  }

  async getUnmatchedPairs(to: number): Promise<UnmatchedBlobPair[]> {
    const todayStart = UnixTime.toStartOf(to, 'day')
    const yesterdayStart = todayStart - UnixTime.DAY

    const groups = await this.$.db.blobs.getGroupedByAddressInbox(
      'ethereum',
      UnixTime.toDate(yesterdayStart),
      UnixTime.toDate(todayStart),
    )

    // Aggregate by (from, to) to get total counts
    const pairMap = new Map<
      string,
      {
        from: string
        to: string | null
        totalCount: number
        groups: typeof groups
      }
    >()
    for (const g of groups) {
      const key = `${g.from}|${g.to}`
      const existing = pairMap.get(key)
      if (existing) {
        existing.totalCount += g.count
        existing.groups.push(g)
      } else {
        pairMap.set(key, {
          from: g.from,
          to: g.to,
          totalCount: g.count,
          groups: [g],
        })
      }
    }

    const ethereumConfigs = this.$.ethereumConfigs.filter(
      (c): c is Extract<BlockDaIndexedConfig, { type: 'ethereum' }> =>
        c.type === 'ethereum',
    )

    const unmatchedPairs: UnmatchedBlobPair[] = []

    for (const [_, pair] of pairMap) {
      if (pair.totalCount < 100) continue

      const isMatched = pair.groups.some((g) =>
        ethereumConfigs.some((config) =>
          matchEthereumProject(
            {
              inbox: g.to ?? '',
              sequencer: g.from,
              topics: g.topics ?? [],
            },
            config,
          ),
        ),
      )

      if (!isMatched) {
        unmatchedPairs.push({
          from: pair.from,
          to: pair.to,
          count: pair.totalCount,
        })
      }
    }

    return unmatchedPairs
  }

  async invalidate(targetHeight: number): Promise<number> {
    return await Promise.resolve(targetHeight)
  }
}
