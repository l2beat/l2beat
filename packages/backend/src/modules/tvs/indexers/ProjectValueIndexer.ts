import type { TvsToken } from '@l2beat/config'
import type { ProjectValueRecord, TokenValueRecord } from '@l2beat/database'
import {
  assert,
  type ProjectValueType,
  type RemovalConfiguration,
} from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
} from '../../../tools/uif/multi/types'
import type { SyncOptimizer } from '../tools/SyncOptimizer'
import type { ProjectValueConfig } from '../types'

interface ProjectValueIndexerDeps
  extends Omit<ManagedMultiIndexerOptions<ProjectValueConfig>, 'name'> {
  syncOptimizer: SyncOptimizer
  tokens: Map<string, TvsToken>
  maxTimestampsToProcessAtOnce: number
}

export class ProjectValueIndexer extends ManagedMultiIndexer<ProjectValueConfig> {
  constructor(private readonly $: ProjectValueIndexerDeps) {
    assert(
      $.configurations.length === 1,
      'This indexer should take only one configuration',
    )
    super({
      ...$,
      name: INDEXER_NAMES.TVS_PROJECT_VALUE,
      tags: {
        tag: $.configurations[0].properties.project,
        project: $.configurations[0].properties.project,
      },
      updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<ProjectValueConfig>[],
  ) {
    const configuration = configurations[0]
    const timestamps = this.$.syncOptimizer.getTimestampsToSync(
      from,
      to,
      this.$.maxTimestampsToProcessAtOnce,
    )

    if (timestamps.length === 0) {
      this.logger.info('Timestamp out of range', {
        from,
        to,
      })
      return () => Promise.resolve(to)
    }

    const tokens = await this.$.db.tvsTokenValue.getByProject(
      configuration.properties.project,
      timestamps[0],
      timestamps[timestamps.length - 1],
    )

    const records: ProjectValueRecord[] = []

    for (const timestamp of timestamps) {
      const tokensForTimestamp = tokens.filter((t) => t.timestamp === timestamp)
      const project = configuration.properties.project

      records.push(
        ...this.aggregateForTimestamp(project, timestamp, tokensForTimestamp),
      )
    }

    return async () => {
      const syncedUntil = timestamps[timestamps.length - 1]
      await this.$.db.transaction(async () => {
        await this.$.db.tvsProjectValue.upsertMany(records)
        await this.$.db.syncMetadata.updateSyncedUntil(
          'tvs',
          [configuration.properties.project],
          syncedUntil,
        )
      })
      this.logger.info('Saved project values into DB', {
        timestamps: timestamps.length,
        records: records.length,
        tokens: tokens.length,
      })

      return syncedUntil
    }
  }

  aggregateForTimestamp(
    project: string,
    timestamp: number,
    tokensForTimestamp: TokenValueRecord[],
  ) {
    const createBaseRecord = (type: ProjectValueType) => ({
      timestamp,
      project,
      type,
      value: 0,
      canonical: 0,
      external: 0,
      native: 0,
      ether: 0,
      stablecoin: 0,
      btc: 0,
      rwaRestricted: 0,
      rwaPublic: 0,
      other: 0,
      associated: 0,
    })

    const summaryRecord = createBaseRecord('SUMMARY')
    const summaryWaRecord = createBaseRecord('SUMMARY_WA')
    const projectRecord = createBaseRecord('PROJECT')
    const projectWaRecord = createBaseRecord('PROJECT_WA')

    for (const token of tokensForTimestamp) {
      const config = this.$.tokens.get(token.tokenId)
      assert(config)

      summaryRecord.value += token.valueForSummary
      projectRecord.value += token.valueForProject
      if (config.isAssociated === false) {
        // only add if not associated
        summaryWaRecord.value += token.valueForSummary
        projectWaRecord.value += token.valueForProject
      }

      const source = config.source // canonical, external, or native
      summaryRecord[source] += token.valueForSummary
      projectRecord[source] += token.valueForProject
      if (config.isAssociated === false) {
        // only add if not associated
        summaryWaRecord[source] += token.valueForSummary
        projectWaRecord[source] += token.valueForProject
      }

      const category = config.category // ether, stablecoin, or other
      summaryRecord[category] += token.valueForSummary
      projectRecord[category] += token.valueForProject
      if (config.isAssociated === false) {
        // only add if not associated
        summaryWaRecord[category] += token.valueForSummary
        projectWaRecord[category] += token.valueForProject
      }

      if (config.isAssociated) {
        summaryRecord.associated += token.valueForSummary
        summaryWaRecord.associated += token.valueForSummary
        projectRecord.associated += token.valueForProject
        projectWaRecord.associated += token.valueForProject
      }
    }
    return [summaryRecord, summaryWaRecord, projectRecord, projectWaRecord]
  }

  /**
   * This indexer does not delete data when invalidated after configuration change,
   * which in this case will happen every time someone changes token list - the id will change,
   * effectively creating a new configuration, which will trigger wiping of fata.
   * But data cannot be deleted because it is needed at any time for frontend.
   * Instead, the indexer invalidates and starts re-processing records from the beginning.
   * This can potentially lead to frontend displaying not fully re-processed data.
   * The only situation in which we want to delete is to when project's range changes,
   * so minHeight or maxHeight changes. Unfortunately in current UIF implementation it is impossible
   * to differentiate those two actions, so we naively trim every time.
   */
  override async removeData(configurations: RemovalConfiguration[]) {
    assert(configurations.length === 1)

    const deletedRecords = await this.$.db.tvsProjectValue.trimProject(
      this.$.configurations[0].properties.project,
      this.$.configurations[0].minHeight,
      this.$.configurations[0].maxHeight,
    )

    if (deletedRecords > 0) {
      this.logger.info('Trimmed project values for project', {
        project: this.$.configurations[0].properties.project,
        deletedRecords,
      })
    }
  }
}
