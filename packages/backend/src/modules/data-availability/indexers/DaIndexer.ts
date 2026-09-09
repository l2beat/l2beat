import type { Logger } from '@l2beat/backend-tools'
import type { DaBlob, DaProvider } from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import uniq from 'lodash/uniq'
import type { BlockDaIndexedConfig } from '../../../config/Config'
import { withCoreFeatureRpcMetricsContext } from '../../../tools/coreFeatureRpcMetrics'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  TrimRemovalConfiguration,
  WipeRemovalConfiguration,
} from '../../../tools/uif/multi/types'
import type { BlobService } from '../services/BlobService'
import type { DaService } from '../services/DaService'

export interface Dependencies
  extends Omit<
    ManagedMultiIndexerOptions<BlockDaIndexedConfig>,
    'name' | 'logger'
  > {
  daService: DaService
  daProvider: DaProvider
  daLayer: string
  batchSize: number
  blobService?: BlobService
}

export class DaIndexer extends ManagedMultiIndexer<BlockDaIndexedConfig> {
  constructor(
    private readonly $: Dependencies,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: INDEXER_NAMES.DA2,
        tags: { tag: $.daLayer },
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )

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
    return await withCoreFeatureRpcMetricsContext(
      'dataAvailability.metrics',
      {
        daLayer: this.$.daLayer,
      },
      async () => {
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
          blobs = await this.$.daProvider.getBlobs(
            this.daLayer,
            from,
            adjustedTo,
          )

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

        const { records, latestTimestamp } = this.$.daService.generateRecords(
          blobs,
          previousRecords,
          configurations.map((c) => c.properties),
        )

        return async () => {
          await this.$.db.transaction(async () => {
            await this.$.db.dataAvailability.upsertMany(records)
            await this.$.db.syncMetadata.updateSyncedUntil(
              'dataAvailability',
              // There might be multiple configurations for the same project
              // so we need to uniq them
              uniq(this.$.configurations.map((c) => c.properties.projectId)),
              UnixTime.toEndOf(latestTimestamp, 'hour'),
              adjustedTo,
            )
          })

          this.logger.info('Saved DA metrics into DB', {
            from,
            to: adjustedTo,
            configurations: configurations.length,
            records: records.length,
          })

          return adjustedTo
        }
      },
    )
  }

  private async getPreviousRecordsInBlobsRange(blobs: DaBlob[]) {
    let minTimestamp = blobs[0]?.blockTimestamp
    let maxTimestamp = blobs[0]?.blockTimestamp

    assert(minTimestamp !== undefined && maxTimestamp !== undefined)

    for (const blob of blobs) {
      minTimestamp = Math.min(minTimestamp, blob.blockTimestamp)
      maxTimestamp = Math.max(maxTimestamp, blob.blockTimestamp)
    }

    const from = UnixTime.toStartOf(minTimestamp, 'hour')
    const to = UnixTime.toEndOf(maxTimestamp, 'hour')

    return await this.$.db.dataAvailability.getForDaLayerInTimeRange(
      this.$.daLayer,
      from,
      to,
    )
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

  /**
   * Records are hourly buckets while the range is in blocks, so the range
   * edges are mapped to timestamps (two rpc calls, inside the update
   * transaction) and every hour the range touches is deleted. The hour
   * straddling an edge holds blobs from both sides and cannot be split, so it
   * goes too: that loses at most an hour of in-range data per edited edge,
   * while keeping it would count the same blobs twice if indexing ever
   * resumes inside that hour.
   */
  override async trimData(configurations: TrimRemovalConfiguration[]) {
    for (const { id, range } of configurations) {
      const [from, to] = await Promise.all(
        range.map((block) =>
          this.$.daProvider.getBlockTimestamp(this.daLayer, block),
        ),
      )
      const deletedRecords =
        await this.$.db.dataAvailability.deleteByConfigInTimeRange(
          id,
          UnixTime.toStartOf(from, 'hour'),
          UnixTime.toStartOf(to, 'hour'),
        )

      if (deletedRecords > 0) {
        this.logger.info('Trimmed DA records for configuration', {
          id,
          range,
          deletedRecords,
        })
      }
    }
  }

  get daLayer() {
    return this.$.daLayer
  }
}
