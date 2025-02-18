import type { Logger } from '@l2beat/backend-tools'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { ChildIndexer, Indexer } from '@l2beat/uif'
import { mean } from 'lodash'

import type { Database, FinalityRecord } from '@l2beat/database'
import {
  batchToTimeToInclusionDelays,
  batchesToStateUpdateDelays,
} from './analyzers/types/BaseAnalyzer'
import type { FinalityConfig } from './types/FinalityConfig'

export class FinalityIndexer extends ChildIndexer {
  readonly indexerId: string

  constructor(
    logger: Logger,
    parentIndexer: ChildIndexer,
    private readonly db: Database,
    private readonly configuration: FinalityConfig,
  ) {
    super(
      logger.tag({
        tag: configuration.projectId,
        project: configuration.projectId,
      }),
      [parentIndexer],
      {
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
    )
    this.indexerId = `finality_indexer_${configuration.projectId.toString()}`
  }

  override async start(): Promise<void> {
    this.logger.info('Starting...')
    await super.start()
  }

  override async update(from: number, to: number): Promise<number> {
    from -= 1 // TODO: refactor logic after uif update
    const targetTimestamp = new UnixTime(to).toStartOf('day')

    if (to < this.configuration.minTimestamp.toNumber()) {
      this.logger.debug('Update skipped: target earlier than minimumTimestamp')
      return to
    }

    const isSynced = await this.isConfigurationSynced(targetTimestamp)
    if (isSynced) {
      this.logger.debug('Update skipped: configuration already synced', {
        from,
        to,
        targetTimestamp,
      })
      return to
    }

    const now = UnixTime.now().toStartOf('day')
    if (targetTimestamp.toNumber() < now.add(-1, 'days').toNumber()) {
      this.logger.debug('Update skipped: target in the past', {
        from,
        to,
        targetTimestamp,
      })
      return to
    }

    const finalityData = await this.getFinalityData(
      targetTimestamp,
      this.configuration,
    )

    if (finalityData) {
      // Sometimes if finality is wrongly configured we get negative values,
      // we do not want to save those data to db
      assert(
        finalityData.minimumTimeToInclusion > 0 &&
          finalityData.averageTimeToInclusion > 0 &&
          finalityData.maximumTimeToInclusion > 0 &&
          (finalityData.averageStateUpdate === null ||
            finalityData.averageStateUpdate >= 0),
        `Finality data cannot be negative: ${this.configuration.projectId}`,
      )

      await this.db.finality.insert(finalityData)
    }

    this.logger.info('Update finished', {
      from,
      to,
      targetTimestamp,
      finalityData,
    })

    return to
  }

  async isConfigurationSynced(targetTimestamp: UnixTime) {
    const latestSynced = await this.db.finality.findLatestByProjectId(
      this.configuration.projectId,
    )

    return !!latestSynced?.timestamp.gte(targetTimestamp)
  }

  async getFinalityData(
    to: UnixTime,
    configuration: FinalityConfig,
  ): Promise<FinalityRecord | undefined> {
    const { timeToInclusion, stateUpdate } = configuration.analyzers
    const { stateUpdateMode } = configuration

    const from = to.add(-1, 'days')

    const t2iBatches = await timeToInclusion.analyzeInterval(from, to)
    if (!t2iBatches) {
      return
    }

    const t2iDelay = t2iBatches.flatMap((batch) =>
      batchToTimeToInclusionDelays(batch),
    )
    const averageTimeToInclusion = Math.round(mean(t2iDelay))
    const minimumTimeToInclusion = minimum(t2iDelay)
    const maximumTimeToInclusion = maximum(t2iDelay)

    const baseResult = {
      projectId: configuration.projectId,
      timestamp: to,

      minimumTimeToInclusion,
      maximumTimeToInclusion,
      averageTimeToInclusion,
    }

    if (stateUpdateMode !== 'analyze') {
      return {
        ...baseResult,
        averageStateUpdate: null,
      }
    }

    assert(
      stateUpdate,
      `State update analyzer is not defined for ${configuration.projectId}, update module or set state update mode to 'disabled'`,
    )

    const suBatches = await stateUpdate.analyzeInterval(from, to)
    if (!suBatches) {
      return
    }

    const stateUpdateDelays = batchesToStateUpdateDelays(t2iBatches, suBatches)
    return {
      ...baseResult,
      averageStateUpdate: Math.round(mean(stateUpdateDelays)),
    }
  }

  override async initialize() {
    const indexerState = await this.db.indexerState.findByIndexerId(
      this.indexerId,
    )

    const safeHeight =
      indexerState?.safeHeight ?? this.configuration.minTimestamp.toNumber()

    return { safeHeight }
  }

  override async setInitialState(
    safeHeight: number,
    _configHash?: string | undefined,
  ): Promise<void> {
    await this.db.indexerState.upsert({
      indexerId: this.indexerId,
      safeHeight,
    })
  }

  async getSafeHeight(): Promise<number> {
    const indexerState = await this.db.indexerState.findByIndexerId(
      this.indexerId,
    )
    return (
      indexerState?.safeHeight ?? this.configuration.minTimestamp.toNumber()
    )
  }

  override async setSafeHeight(safeHeight: number): Promise<void> {
    await this.db.indexerState.updateSafeHeight(this.indexerId, safeHeight)
  }

  /**
   * WARNING: this method does not do anything
   *
    In our case there is no re-org handling so we do not have to worry
    that our data will become invalid.
    Also there is no need to handle the case when the server is randomly shut down during update,
    liveness configurations are storing the latest synced timestamp, so even if the server is shut down
    without setting new safeHeight. And although the next update will run on the already processed timestamp,
    the configuration's lastSyncedTimestamp will filter out already processed configurations
    and the data will not be fetched again
  **/
  override async invalidate(targetHeight: number): Promise<number> {
    return await Promise.resolve(targetHeight)
  }
}

function minimum(values: number[]): number {
  if (values.length === 0) {
    return 0
  }

  let result = Infinity
  for (const v of values) {
    result = Math.min(result, v)
  }
  return result
}

function maximum(values: number[]): number {
  if (values.length === 0) {
    return 0
  }

  let result = -Infinity
  for (const v of values) {
    result = Math.max(result, v)
  }
  return result
}
