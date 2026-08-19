import type { Logger } from '@l2beat/backend-tools'
import type { DataAvailabilityRecord } from '@l2beat/database'
import type { EigenApiClient } from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import type { TimestampDaIndexedConfig } from '../../../../config/Config'
import { ManagedMultiIndexer } from '../../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  TrimRemovalConfiguration,
  WipeRemovalConfiguration,
} from '../../../../tools/uif/multi/types'
import { mapEigenProjectData } from './mapEigenProjectData'

export interface Dependencies
  extends Omit<
    ManagedMultiIndexerOptions<TimestampDaIndexedConfig>,
    'name' | 'logger'
  > {
  daLayer: string
  eigenClient: EigenApiClient
}

export class EigenDaProjectsIndexer extends ManagedMultiIndexer<TimestampDaIndexedConfig> {
  constructor(
    private readonly $: Dependencies,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: 'eigenda_projects_indexer',
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
    configurations: Configuration<TimestampDaIndexedConfig>[],
  ) {
    const adjustedFrom = UnixTime.toStartOf(from, 'hour')
    const adjustedTo = Math.min(adjustedFrom + UnixTime.HOUR, to)

    // If not 02:00:00, we skip update
    if (
      UnixTime.toStartOf(adjustedTo, 'day') + 2 * UnixTime.HOUR !==
      adjustedTo
    ) {
      this.logger.info('Skipping update', {
        from: adjustedFrom,
        to: adjustedTo,
      })
      return () => {
        return Promise.resolve(adjustedTo)
      }
    }

    const projectData = await this.getByProjectData(adjustedTo)

    this.logger.info('Fetched records', {
      records: projectData.length,
    })

    if (projectData.length === 0) {
      this.logger.info('Empty data response received', {
        from,
        to: adjustedTo,
      })
      return () => {
        return Promise.resolve(adjustedTo)
      }
    }

    return async () => {
      await this.$.db.transaction(async () => {
        await this.$.db.dataAvailability.upsertMany(projectData)
        await this.$.db.syncMetadata.updateSyncedUntil(
          'dataAvailability',
          this.$.configurations.map((c) => c.properties.projectId),
          adjustedTo,
        )
      })
      this.logger.info('Saved DA metrics into DB', {
        from,
        to: adjustedTo,
        configurations: configurations.length,
        records: projectData.length,
      })

      return adjustedTo
    }
  }

  async getByProjectData(to: number): Promise<DataAvailabilityRecord[]> {
    const startOfTheDay = UnixTime.toStartOf(to, 'day')
    // this is date of first file that is accessible after migration to v2 API
    const firstFileDate = UnixTime.fromDate(
      new Date('2025-08-01T00:00:00.000Z'),
    )
    const adjustedDay =
      startOfTheDay < firstFileDate ? firstFileDate : startOfTheDay
    const data = await this.$.eigenClient.getByProjectData(adjustedDay)

    const projectsConfigurations = this.$.configurations.filter(
      (c) => c.properties.type === 'eigen-da',
    ) as Configuration<
      Extract<TimestampDaIndexedConfig, { type: 'eigen-da' }>
    >[]

    const records = mapEigenProjectData(
      data,
      projectsConfigurations,
      this.daLayer,
      startOfTheDay,
    )

    // The API reports every customer regardless of our ranges. Keep only the
    // hourly buckets inside the configuration's range, cut at full hours the
    // same way trimData cuts them, so later updates never recreate trimmed rows.
    const byId = new Map(projectsConfigurations.map((c) => [c.id, c]))
    return records.filter((record) => {
      const configuration = byId.get(record.configurationId)
      assert(configuration)
      return (
        record.timestamp >=
          UnixTime.toStartOf(configuration.minHeight, 'hour') &&
        (configuration.maxHeight === null ||
          record.timestamp <
            UnixTime.toStartOf(configuration.maxHeight + 1, 'hour'))
      )
    })
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

  override async trimData(
    configurations: TrimRemovalConfiguration[],
  ): Promise<void> {
    for (const configuration of configurations) {
      // Records are hourly buckets, so cut at full hours: keep the bucket holding
      // the new sinceTimestamp (range ends at since - 1; nothing re-indexes it),
      // drop the bucket holding the new untilTimestamp (range starts at until + 1;
      // it is re-fetched if the range grows again). Same rule as DaIndexer.
      const from = UnixTime.toStartOf(configuration.range[0], 'hour')
      const to = UnixTime.toStartOf(configuration.range[1] + 1, 'hour') - 1
      const deletedRecords =
        await this.$.db.dataAvailability.deleteByConfigInTimeRange(
          configuration.id,
          from,
          to,
        )

      if (deletedRecords > 0) {
        this.logger.info('Trimmed DA records for configuration', {
          id: configuration.id,
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
