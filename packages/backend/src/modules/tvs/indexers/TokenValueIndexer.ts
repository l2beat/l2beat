import type { TvsToken } from '@l2beat/config'
import type { TokenValueRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  RemovalConfiguration,
} from '../../../tools/uif/multi/types'
import type { ValueService } from '../services/ValueService'
import type { DBStorage } from '../tools/DBStorage'
import {
  createAmountConfig,
  createPriceConfigId,
  extractPricesAndAmounts,
  generateConfigurationId,
} from '../tools/extractPricesAndAmounts'
import type { SyncOptimizer } from '../tools/SyncOptimizer'

interface TokenValueIndexerDeps
  extends Omit<ManagedMultiIndexerOptions<TvsToken>, 'name'> {
  syncOptimizer: SyncOptimizer
  dbStorage: DBStorage
  valueService: ValueService
  project: string
  maxTimestampsToProcessAtOnce: number
}

export class TokenValueIndexer extends ManagedMultiIndexer<TvsToken> {
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
    configurations: Configuration<TvsToken>[],
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

    const { prices, amounts } = extractPricesAndAmounts(
      configurations.map((c) => c.properties),
    )

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

    const records: TokenValueRecord[] = tvs.map((t) => {
      const token = configurations.find((c) => c.properties.id === t.tokenId)
      assert(token, `${t.tokenId}: no token found`)
      return {
        ...t,
        configurationId: TokenValueIndexer.idToConfigurationId(
          token.properties,
        ),
      }
    })

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

  static idToConfigurationId = (token: TvsToken) => {
    const { amounts, prices } = extractPricesAndAmounts([token])

    return generateConfigurationId([
      token.id,
      token.source,
      token.category,
      String(token.isAssociated),
      ...amounts.map((a) => createAmountConfig(a).id),
      ...prices.map((p) => createPriceConfigId(p.id)),
    ])
  }
}
