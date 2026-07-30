import type { Logger } from '@l2beat/backend-tools'
import type { DataAvailabilityRecord } from '@l2beat/database'
import type { EigenApiClient } from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import uniq from 'lodash/uniq'
import type { TimestampDaIndexedConfig } from '../../../../config/Config'
import { ManagedMultiIndexer } from '../../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  WipeRemovalConfiguration,
} from '../../../../tools/uif/multi/types'

// Layer-level metrics are unavailable for this window - skip it without
// calling the Eigen API or saving any records.
const SYNC_DISABLED_FROM = UnixTime.fromDate(
  new Date('2026-06-22T00:00:00.000Z'),
)
const SYNC_DISABLED_UNTIL = UnixTime.fromDate(
  new Date('2026-06-29T00:00:00.000Z'),
)

export interface Dependencies
  extends Omit<
    ManagedMultiIndexerOptions<TimestampDaIndexedConfig>,
    'name' | 'logger'
  > {
  daLayer: string
  eigenClient: EigenApiClient
}

export class EigenDaLayerIndexer extends ManagedMultiIndexer<TimestampDaIndexedConfig> {
  constructor(
    private readonly $: Dependencies,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: 'eigenda_layer_indexer',
        tags: { tag: $.daLayer },
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )

    assert(
      $.configurations.every(
        (c) =>
          c.properties.daLayer === $.daLayer &&
          c.properties.projectId === $.daLayer,
      ),
      'DaLayer mismatch detected in configurations',
    )
  }

  override async multiUpdate(
    from: number,
    _to: number,
    configurations: Configuration<TimestampDaIndexedConfig>[],
  ) {
    const adjustedFrom = UnixTime.toStartOf(from, 'hour')
    const adjustedTo = adjustedFrom + UnixTime.HOUR

    if (
      adjustedFrom >= SYNC_DISABLED_FROM &&
      adjustedFrom < SYNC_DISABLED_UNTIL
    ) {
      this.logger.info('Skipping update - sync disabled for this range', {
        from: adjustedFrom,
        to: adjustedTo,
      })
      return () => {
        return Promise.resolve(adjustedTo)
      }
    }

    const daLayerData = await this.getDaLayerData(adjustedFrom, adjustedTo)

    this.logger.info('Da Layer data fetched')

    return async () => {
      await this.$.db.transaction(async () => {
        await this.$.db.dataAvailability.upsertMany([daLayerData])
        await this.$.db.syncMetadata.updateSyncedUntil(
          'dataAvailability',
          uniq(this.$.configurations.map((c) => c.properties.projectId)),
          adjustedTo,
        )
      })
      this.logger.info('Saved DA layer metrics into DB', {
        from: adjustedFrom,
        to: adjustedTo,
        configurations: configurations.length,
        records: 1,
      })

      return adjustedTo
    }
  }

  async getDaLayerData(
    from: number,
    to: number,
  ): Promise<DataAvailabilityRecord> {
    const metrics = await this.$.eigenClient.getMetrics(from, to - 1)
    const configurationId = this.$.configurations.find(
      (c) => c.properties.projectId === this.daLayer,
    )?.id

    assert(configurationId)

    return {
      timestamp: UnixTime.toStartOf(from, 'hour'),
      totalSize: BigInt(metrics.total_bytes_posted),
      projectId: 'eigenda',
      daLayer: this.daLayer,
      configurationId,
    }
  }

  override async wipeData(
    configurations: WipeRemovalConfiguration[],
  ): Promise<void> {
    const deletedRecords = await this.$.db.dataAvailability.deleteByConfigIds(
      configurations.map((c) => c.id),
    )

    if (deletedRecords > 0) {
      this.logger.info('Wiped DA records for configurations', {
        configurations: configurations.length,
        deletedRecords,
      })
    }
  }

  get daLayer() {
    return this.$.daLayer
  }
}
