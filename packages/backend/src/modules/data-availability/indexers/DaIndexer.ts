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
   * Drops the data outside of a configuration's block range instead of wiping
   * its whole history. Runs when sinceBlock is raised or untilBlock changes.
   *
   * Records are hourly buckets and hold no block numbers, so the boundary block
   * is mapped to its timestamp and the hour it falls into is deleted together
   * with the out-of-range side. That hour mixes blobs from both sides of the
   * boundary and its partial size cannot be subtracted. Keeping it would be
   * worse: the framework leaves currentHeight at the boundary block, so its
   * blobs would be added a second time once indexing resumes (DaService sums
   * new blobs into existing records). We undercount by at most one hour per
   * edited edge and never double count.
   */
  override async trimData(
    configurations: TrimRemovalConfiguration[],
  ): Promise<void> {
    for (const { id, range } of configurations) {
      const configuration = this.$.configurations.find((c) => c.id === id)
      assert(configuration, `Configuration not found: ${id}`)

      // Trimming the head means everything before the new minHeight was removed
      const isHeadTrim = range[1] < configuration.minHeight
      const boundaryBlock = isHeadTrim
        ? configuration.minHeight
        : configuration.maxHeight
      assert(
        boundaryBlock !== null,
        `Configuration ${id} has no boundary to trim to`,
      )

      const boundaryBucket = UnixTime.toStartOf(
        await this.$.daProvider.getBlockTimestamp(
          this.$.daLayer,
          boundaryBlock,
        ),
        'hour',
      )

      const [from, to] = isHeadTrim
        ? [boundaryBucket + UnixTime.HOUR, null]
        : [null, boundaryBucket - UnixTime.HOUR]

      const deletedRecords =
        await this.$.db.dataAvailability.deleteByConfigurationIdOutsideTimeRange(
          id,
          from,
          to,
        )

      if (deletedRecords > 0) {
        this.logger.info('Trimmed DA records for configuration', {
          id,
          range,
          from,
          to,
          deletedRecords,
        })
      }
    }
  }

  get daLayer() {
    return this.$.daLayer
  }
}
