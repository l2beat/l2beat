import type { Database } from '@l2beat/database'
import type { DaBeatStatsProvider } from '@l2beat/shared'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
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
    // we want to run it once an hour, if from and to are in the same hour it means we already ran it and want to skip
    if (UnixTime.toStartOf(from, 'hour') === UnixTime.toStartOf(to, 'hour')) {
      this.logger.info('Skipping update', { from, to })
      return to
    }

    const stats = await this.$.statsProvider.getStats(this.$.projectId)

    if (!stats) {
      this.logger.warn('No DABEAT stats found', {
        from,
        to,
        projectId: this.$.projectId,
      })
      return to
    }

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
