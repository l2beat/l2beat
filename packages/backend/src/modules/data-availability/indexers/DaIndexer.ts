import { INDEXER_NAMES } from '@l2beat/backend-shared'
import type { ProjectDaTrackingConfig } from '@l2beat/config'
import type { DaProvider } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  RemovalConfiguration,
} from '../../../tools/uif/multi/types'
import type { DaService } from '../../data-availability/services/DaService'

type DaTrackingConfig = ProjectDaTrackingConfig & { project: string }

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
      configurations: configurations.length,
    })

    const blobs = await this.$.daProvider.getBlobs(from, to)

    const from2 = new UnixTime(
      Math.min(...blobs.map((b) => b.blockTimestamp.toNumber())),
    )

    const to2 = new UnixTime(
      Math.max(...blobs.map((b) => b.blockTimestamp.toNumber())),
    )

    const previous = await this.$.db.dataAvailability.getForDaLayerInTimeRange(
      this.$.daLayer,
      from2,
      to2,
    )

    const projects = new Set(configurations.map((c) => c.properties.project))

    const filtered = previous.filter((p) => projects.has(p.projectId))

    const records = this.$.daService.generateRecords(blobs, filtered)

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
