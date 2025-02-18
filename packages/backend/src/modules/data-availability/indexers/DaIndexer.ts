import { INDEXER_NAMES } from '@l2beat/backend-shared'
import type { DaBlob, DaProvider } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import type { DaTrackingConfig } from '../../../config/Config'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  RemovalConfiguration,
} from '../../../tools/uif/multi/types'
import type { DaService } from '../../data-availability/services/DaService'

export interface Dependencies
  extends Omit<ManagedMultiIndexerOptions<DaTrackingConfig>, 'name'> {
  daService: DaService
  daProvider: DaProvider
  /** Used only for tagging a logger */
  daLayer: string
  // TODO: rethink
  batchSize: number
}

export class DaIndexer extends ManagedMultiIndexer<DaTrackingConfig> {
  constructor(private readonly $: Dependencies) {
    super({
      ...$,
      name: INDEXER_NAMES.DA,
      tags: { tag: $.daLayer },
      updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<DaTrackingConfig>[],
  ) {
    const adjustedTo =
      from + this.$.batchSize < to ? from + this.$.batchSize : to

    this.logger.info('Fetching blobs', {
      from,
      to: adjustedTo,
    })

    const blobs = await this.$.daProvider.getBlobs(from, adjustedTo)

    this.logger.info('Fetched blobs', {
      blobs: blobs.length,
    })

    const previousRecords = await this.getPreviousRecordsInBlobsRange(blobs)

    this.logger.info('Fetched previous records', {
      previousRecords: previousRecords.length,
    })

    const records = this.$.daService.generateRecords(blobs, previousRecords)

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
    if (blobs.length === 0) return []

    const from = new UnixTime(
      Math.min(...blobs.map((b) => b.blockTimestamp.toNumber())),
    ).toStartOf('day')

    const to = new UnixTime(
      Math.max(...blobs.map((b) => b.blockTimestamp.toNumber())),
    ).toEndOf('day')

    return await this.$.db.dataAvailability.getForDaLayerInTimeRange(
      this.$.daLayer,
      from,
      to,
    )
  }

  override removeData(_: RemovalConfiguration[]): Promise<void> {
    throw new Error('This indexer should not invalidate')
  }

  get daLayer() {
    return this.$.daLayer
  }
}
