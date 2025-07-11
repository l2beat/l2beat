import type { DataAvailabilityRecord } from '@l2beat/database'
import type { EigenApiClient } from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import type { TimestampDaIndexedConfig } from '../../../../config/Config'
import { ManagedMultiIndexer } from '../../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  RemovalConfiguration,
} from '../../../../tools/uif/multi/types'

export interface Dependencies
  extends Omit<ManagedMultiIndexerOptions<TimestampDaIndexedConfig>, 'name'> {
  daLayer: string
  eigenClient: EigenApiClient
}

export class EigenDaLayerIndexer extends ManagedMultiIndexer<TimestampDaIndexedConfig> {
  constructor(private readonly $: Dependencies) {
    super({
      ...$,
      name: 'eigenda_layer_indexer',
      tags: { tag: $.daLayer },
      updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      configurationsTrimmingDisabled: true,
      dataWipingAfterDeleteDisabled: false,
    })

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
    const daLayerData = await this.getDaLayerData(adjustedFrom, adjustedTo)

    this.logger.info('Da Layer data fetched')

    return async () => {
      await this.$.db.dataAvailability.upsertMany([daLayerData])
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
    const throughput = await this.$.eigenClient.getMetrics(from, to - 1)
    const totalSize = BigInt(Math.round(throughput * (to - 1 - from)))
    const configurationId = this.$.configurations.find(
      (c) => c.properties.projectId === this.daLayer,
    )?.id

    assert(configurationId)

    return {
      timestamp: UnixTime.toStartOf(from, 'hour'),
      totalSize,
      projectId: 'eigenda',
      daLayer: this.daLayer,
      configurationId,
    }
  }

  override async removeData(
    configurations: RemovalConfiguration[],
  ): Promise<void> {
    //this function should only run with this flag enabled
    assert(this.options.configurationsTrimmingDisabled)

    for (const c of configurations) {
      const deletedRecords =
        await this.$.db.dataAvailability.deleteByConfigurationId(c.id)

      this.logger.info('Wiped DA records for configuration', {
        id: c.id,
        deletedRecords,
      })
    }
  }

  get daLayer() {
    return this.$.daLayer
  }
}
