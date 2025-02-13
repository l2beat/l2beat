import { INDEXER_NAMES } from '@l2beat/backend-shared'
import type { ProjectDaTrackingConfig } from '@l2beat/config'
import type { DaProvider } from '@l2beat/shared'
import { Indexer } from '@l2beat/uif'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  RemovalConfiguration,
} from '../../../tools/uif/multi/types'
import type { DaService } from '../../data-availability/services/DaService'

export interface Dependencies
  extends Omit<ManagedMultiIndexerOptions<ProjectDaTrackingConfig>, 'name'> {
  daService: DaService
  daProvider: DaProvider
  /** Used only for tagging a logger */
  daLayer: string
  // TODO: rethink
  batchSize: number
}

export class DaIndexer extends ManagedMultiIndexer<ProjectDaTrackingConfig> {
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
    configurations: Configuration<ProjectDaTrackingConfig>[],
  ) {
    const adjustedTo =
      from + this.$.batchSize < to ? from + this.$.batchSize : to

    this.logger.info('Fetching blobs', {
      from,
      to: adjustedTo,
      configurations: configurations.length,
    })

    const blobs = await this.$.daProvider.getBlobs(from, to)

    // TODO get previous records

    const records = this.$.daService.generateRecords(blobs, [])

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

  override async removeData(_: RemovalConfiguration[]) {
    return await Promise.resolve()

    // for (const configuration of configurations) {
    //   const deletedRecords = await this.$.db.price.deleteByConfigInTimeRange(
    //     configuration.id,
    //     new UnixTime(configuration.from),
    //     new UnixTime(configuration.to),
    //   )

    //   if (deletedRecords > 0) {
    //     this.logger.info('Deleted records', {
    //       from: configuration.from,
    //       to: configuration.to,
    //       id: configuration.id,
    //       deletedRecords,
    //     })
    //   }
    // }
  }

  get daLayer() {
    return this.$.daLayer
  }
}
