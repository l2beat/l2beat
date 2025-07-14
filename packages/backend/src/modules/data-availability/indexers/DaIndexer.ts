import type { DaBlob, DaProvider } from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import type { BlockDaIndexedConfig } from '../../../config/Config'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  RemovalConfiguration,
} from '../../../tools/uif/multi/types'
import type { BlobService } from '../services/BlobService'
import type { DaService } from '../services/DaService'

export interface Dependencies
  extends Omit<ManagedMultiIndexerOptions<BlockDaIndexedConfig>, 'name'> {
  daService: DaService
  daProvider: DaProvider
  daLayer: string
  batchSize: number
  blobService?: BlobService
}

export class DaIndexer extends ManagedMultiIndexer<BlockDaIndexedConfig> {
  constructor(private readonly $: Dependencies) {
    super({
      ...$,
      name: INDEXER_NAMES.DA2,
      tags: { tag: $.daLayer },
      updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      configurationsTrimmingDisabled: true,
      dataWipingAfterDeleteDisabled: false,
    })

    assert(
      $.configurations.every((c) => c.properties.daLayer === $.daLayer),
      'DaLayer mismatch detected in configurations',
    )
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<BlockDaIndexedConfig>[],
  ) {
    const adjustedTo =
      from + this.$.batchSize < to ? from + this.$.batchSize : to

    this.logger.info('Fetching blobs', {
      from,
      to: adjustedTo,
    })

    let blobs: DaBlob[] = []
    if (this.$.blobService) {
      blobs = await this.$.blobService.get(this.daLayer, from, adjustedTo)

      this.logger.info('Fetched blobs from cache', {
        blobs: blobs.length,
      })
    } else {
      blobs = await this.$.daProvider.getBlobs(this.daLayer, from, adjustedTo)

      this.logger.info('Fetched blobs from provider', {
        blobs: blobs.length,
      })
    }

    if (blobs.length === 0) {
      this.logger.info('Empty blobs response received', {
        from,
        to: adjustedTo,
      })
      return () => {
        return Promise.resolve(adjustedTo)
      }
    }

    const previousRecords = await this.getPreviousRecordsInBlobsRange(blobs)

    this.logger.info('Loaded previous records', {
      previousRecords: previousRecords.length,
    })

    const records = this.$.daService.generateRecords(
      blobs,
      previousRecords,
      configurations.map((c) => c.properties),
    )

    return async () => {
      await this.$.db.dataAvailability.upsertMany(records)
      this.logger.info('Saved DA metrics into DB', {
        from,
        to: adjustedTo,
        configurations: configurations.length,
        records: records.length,
      })

      return adjustedTo
    }
  }

  private async getPreviousRecordsInBlobsRange(blobs: DaBlob[]) {
    const from = UnixTime.toStartOf(
      Math.min(...blobs.map((b) => b.blockTimestamp)),
      'hour',
    )

    const to = UnixTime.toEndOf(
      Math.max(...blobs.map((b) => b.blockTimestamp)),
      'hour',
    )

    return await this.$.db.dataAvailability.getForDaLayerInTimeRange(
      this.$.daLayer,
      from,
      to,
    )
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
