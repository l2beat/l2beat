import { INDEXER_NAMES } from '@l2beat/backend-shared'
import type { TokenValueRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  RemovalConfiguration,
} from '../../../tools/uif/multi/types'
import type { SyncOptimizer } from '../../tvl/utils/SyncOptimizer'
import type { ValueService } from '../services/ValueService'
import type { DBStorage } from '../tools/DBStorage'
import {
  extractPricesAndAmounts,
  generateConfigurationId,
} from '../tools/extractPricesAndAmounts'
import type { Token } from '../types'

interface TokenValueIndexerDeps
  extends Omit<ManagedMultiIndexerOptions<Token>, 'name'> {
  syncOptimizer: SyncOptimizer
  dbStorage: DBStorage
  valueService: ValueService
  project: string
  maxTimestampsToProcessAtOnce: number
}

export class TokenValueIndexer extends ManagedMultiIndexer<Token> {
  constructor(private readonly $: TokenValueIndexerDeps) {
    super({
      ...$,
      name: INDEXER_NAMES.TVS_TOKEN_VALUE,
      tags: {
        tag: $.project,
        project: $.project,
      },
      updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<Token>[],
  ) {
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

    const { prices, amounts } = extractPricesAndAmounts({
      projectId: this.$.project,
      tokens: configurations.map((c) => c.properties),
    })

    await this.$.dbStorage.preloadPrices(
      prices.map((p) => p.id),
      timestamps,
    )
    await this.$.dbStorage.preloadAmounts(
      amounts.map((a) => a.id),
      timestamps,
    )

    const tvs = await this.$.valueService.calculate(
      {
        projectId: this.$.project,
        tokens: configurations.map((c) => c.properties),
      },
      timestamps,
    )

    const records: TokenValueRecord[] = tvs.map((t) => ({
      ...t,
      configurationId: TokenValueIndexer.idToConfigurationId(t.tokenId),
    }))

    return async () => {
      await this.$.db.tvsTokenValue.insertMany(records)
      this.logger.info('Saved token values into DB', {
        timestamps: timestamps.length,
        tokens: records.length,
      })

      return timestamps[timestamps.length - 1]
    }
  }

  override async removeData(configurations: RemovalConfiguration[]) {
    for (const configuration of configurations) {
      const deletedRecords =
        await this.$.db.tvsTokenValue.deleteByConfigInTimeRange(
          configuration.id,
          UnixTime(configuration.from),
          UnixTime(configuration.to),
        )

      if (deletedRecords > 0) {
        this.logger.info('Deleted records for configuration', {
          id: configuration.id,
          from: configuration.from,
          to: configuration.to,
          deletedRecords,
        })
      }
    }
  }

  static idToConfigurationId = (tokenId: string) => {
    return generateConfigurationId([tokenId])
  }
}
