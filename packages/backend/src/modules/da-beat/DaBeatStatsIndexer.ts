import type { Database } from '@l2beat/database'
import type { DaBeatStatsProvider } from '@l2beat/shared'
import { assert, type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import {
  ManagedChildIndexer,
  type ManagedChildIndexerOptions,
} from '../../tools/uif/ManagedChildIndexer'

export interface DaBeatStatsIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  projectId: ProjectId
  db: Database
  statsProvider: DaBeatStatsProvider
}

export class DaBeatStatsIndexer extends ManagedChildIndexer {
  constructor(private readonly $: DaBeatStatsIndexerDeps) {
    super({
      ...$,
      name: 'dabeat_stats_indexer',
      tags: {
        tag: $.projectId,
        project: $.projectId,
      },
      updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })
  }

  override async update(from: number, to: number): Promise<number> {
    // we only need to run once a day at midnight, if we just started (from === 0) we want to run it
    if (to !== UnixTime.toStartOf(to, 'day') && from !== 0) {
      this.logger.info('Skipping update', { from, to })
      return to
    }

    const stats = await this.$.statsProvider.getStats(this.$.projectId)

    assert(stats, 'No stats found')

    await this.$.db.daBeatStats.upsert({
      ...stats,
      id: this.$.projectId,
    })
    return to
  }

  override invalidate(targetHeight: number): Promise<number> {
    return Promise.resolve(targetHeight)
  }
}
