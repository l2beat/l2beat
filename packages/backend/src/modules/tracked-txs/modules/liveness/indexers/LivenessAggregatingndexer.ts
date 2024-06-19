import { UnixTime } from '@l2beat/shared-pure'
import {
  ManagedChildIndexer,
  ManagedChildIndexerOptions,
} from '../../../../../tools/uif/ManagedChildIndexer'
import { AggregatedLivenessRepository } from '../repositories/AggregatedLivenessRepository'
import { LivenessRepository } from '../repositories/LivenessRepository'

export interface LivenessAggregatingnderIndexerDeps
  extends Omit<ManagedChildIndexerOptions, 'name'> {
  livenessRepository: LivenessRepository
  aggregatedLivenessRepository: AggregatedLivenessRepository
}

export class LivenessAggregatingndexer extends ManagedChildIndexer {
  constructor(private readonly $: LivenessAggregatingnderIndexerDeps) {
    super({ ...$, name: 'liveness_aggregating' })
  }

  override async update(
    safeHeight: number,
    parentSafeHeight: number,
  ): Promise<number> {
    const now = UnixTime.now()
    const startOfCurrentDay = now.toStartOf('day')
    const endOfDayToSync = new UnixTime(safeHeight).toEndOf('day')

    // not enough data to use
    if (parentSafeHeight < startOfCurrentDay.toNumber()) {
      this.logger.info('Not enough data to use', { parentSafeHeight })
      return parentSafeHeight
    }

    // nothing to sync - up to date
    if (endOfDayToSync.toNumber() > now.toNumber()) {
      this.logger.info('Nothing to sync', { endOfDayToSync })
      return parentSafeHeight
    }

    return await Promise.resolve(parentSafeHeight)
  }

  override async invalidate(targetHeight: number): Promise<number> {
    // no need to remove data
    // safeHeight will be updated to this vale
    return await Promise.resolve(targetHeight)
  }
}
