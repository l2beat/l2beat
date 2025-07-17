import type { DataAvailabilityRecord } from '@l2beat/database'
import type { EigenApiClient } from '@l2beat/shared'
import {
  assert,
  type Configuration,
  type RemovalConfiguration,
  UnixTime,
} from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import type { TimestampDaIndexedConfig } from '../../../../config/Config'
import { ManagedMultiIndexer } from '../../../../tools/uif/multi/ManagedMultiIndexer'
import type { ManagedMultiIndexerOptions } from '../../../../tools/uif/multi/types'

export interface Dependencies
  extends Omit<ManagedMultiIndexerOptions<TimestampDaIndexedConfig>, 'name'> {
  daLayer: string
  eigenClient: EigenApiClient
}

export class EigenDaProjectsIndexer extends ManagedMultiIndexer<TimestampDaIndexedConfig> {
  constructor(private readonly $: Dependencies) {
    super({
      ...$,
      name: 'eigenda_projects_indexer',
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
      await this.$.db.dataAvailability.upsertMany(projectData)
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
    const startOfLastDay = UnixTime.toStartOf(to, 'day') - UnixTime.DAY
    // this is date of first file that is somehow parsable, all before is a joke
    const firstFileDate = UnixTime.fromDate(
      new Date('2025-05-30T00:00:00.000Z'),
    )
    const adjustedDay =
      startOfLastDay < firstFileDate ? firstFileDate : startOfLastDay
    const data = await this.$.eigenClient.getByProjectData(adjustedDay)

    const projectsConfigurations = this.$.configurations.filter(
      (c) => c.properties.type === 'eigen-da',
    ) as Configuration<
      Extract<TimestampDaIndexedConfig, { type: 'eigen-da' }>
    >[]

    const records: DataAvailabilityRecord[] = []
    for (const d of data) {
      if (
        d.datetime < startOfLastDay ||
        d.datetime >= startOfLastDay + UnixTime.DAY
      ) {
        continue
      }

      const configuration = projectsConfigurations.find(
        (c) => c.properties.customerId === d.customer_id,
      )
      if (!configuration) {
        continue
      }
      records.push({
        timestamp: d.datetime,
        totalSize: BigInt(Math.round(d.total_size_mb * 1024 * 1024)),
        projectId: configuration.properties.projectId,
        daLayer: this.daLayer,
        configurationId: configuration.id,
      })
    }
    return records
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
