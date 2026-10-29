import type { Logger } from '@l2beat/backend-tools'
import type { TvsToken } from '@l2beat/config'
import type { TokenValueRecord, TvsEscrowValueRecord } from '@l2beat/database'
import { assert } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  TrimRemovalConfiguration,
  WipeRemovalConfiguration,
} from '../../../tools/uif/multi/types'
import type { ValueService } from '../services/ValueService'
import type { DBStorage } from '../tools/DBStorage'
import {
  createAmountConfig,
  createPriceConfigId,
  extractPricesAndAmounts,
  generateConfigurationId,
} from '../tools/extractPricesAndAmounts'
import { getSummedEscrowBalances } from '../tools/getSummedEscrowBalances'
import type { SyncOptimizer } from '../tools/SyncOptimizer'

interface TokenValueIndexerDeps
  extends Omit<ManagedMultiIndexerOptions<TvsToken>, 'name'> {
  syncOptimizer: SyncOptimizer
  dbStorage: DBStorage
  valueService: ValueService
  project: string
  /** Also store the value of each escrow balance a token sums. */
  storeEscrowValues: boolean
  maxTimestampsToProcessAtOnce: number
}

export class TokenValueIndexer extends ManagedMultiIndexer<TvsToken> {
  constructor(
    private readonly $: TokenValueIndexerDeps,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: INDEXER_NAMES.TVS_TOKEN_VALUE,
        tags: {
          tag: $.project,
          project: $.project,
        },
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<TvsToken>[],
  ) {
    const tokenIds = configurations.map((c) => c.properties.id)
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

    const configurationIds = new Map<string, string>(
      configurations.map((c) => [
        c.properties.id,
        TokenValueIndexer.idToConfigurationId(
          c.properties,
          this.$.storeEscrowValues,
        ),
      ]),
    )
    const toConfigurationId = (tokenId: string) => {
      const configurationId = configurationIds.get(tokenId)
      assert(configurationId, `${tokenId}: no token found`)
      return configurationId
    }

    const records: TokenValueRecord[] = tvs.map((t) => ({
      ...t,
      configurationId: toConfigurationId(t.tokenId),
    }))

    const escrowRecords: TvsEscrowValueRecord[] = this.$.storeEscrowValues
      ? (
          await this.$.valueService.calculateEscrowValues(
            {
              projectId: this.$.project,
              tokens: configurations.map((c) => c.properties),
            },
            timestamps,
          )
        ).map((e) => ({ ...e, configurationId: toConfigurationId(e.tokenId) }))
      : []

    return async () => {
      const syncedUntil = timestamps[timestamps.length - 1]
      await this.$.db.transaction(async () => {
        await this.$.db.syncMetadata.updateSyncedUntil(
          'tvs',
          tokenIds,
          syncedUntil,
        )
        await this.$.db.tvsTokenValue.upsertMany(records)
        await this.$.db.tvsEscrowValue.upsertMany(escrowRecords)
      })
      this.logger.info('Saved token values into DB', {
        timestamps: timestamps.length,
        tokens: records.length,
      })

      return syncedUntil
    }
  }

  override async wipeData(configurations: WipeRemovalConfiguration[]) {
    const ids = configurations.map((c) => c.id)
    const deletedRecords = await this.$.db.tvsTokenValue.deleteByConfigIds(ids)
    await this.$.db.tvsEscrowValue.deleteByConfigIds(ids)
    if (deletedRecords > 0) {
      this.logger.info('Wiped records for configurations', {
        configurations: configurations.length,
        deletedRecords,
      })
    }
  }

  override async trimData(configurations: TrimRemovalConfiguration[]) {
    for (const configuration of configurations) {
      const [from, to] = configuration.range
      const deletedRecords =
        await this.$.db.tvsTokenValue.deleteByConfigInTimeRange(
          configuration.id,
          from,
          to,
        )
      await this.$.db.tvsEscrowValue.deleteByConfigInTimeRange(
        configuration.id,
        from,
        to,
      )

      if (deletedRecords > 0) {
        this.logger.info('Trimmed records for configuration', {
          id: configuration.id,
          from,
          to,
          deletedRecords,
        })
      }
    }
  }

  /**
   * Opting a token into escrow values changes its id, so the indexer wipes
   * and recomputes its history from stored amounts and prices, filling the
   * escrow values on the way.
   */
  static idToConfigurationId = (
    token: TvsToken,
    storeEscrowValues: boolean,
  ) => {
    const { amounts, prices } = extractPricesAndAmounts([token])
    const hasEscrowValues =
      storeEscrowValues && getSummedEscrowBalances(token).length > 0

    return generateConfigurationId([
      token.id,
      token.source,
      token.category,
      String(token.isAssociated),
      ...amounts.map((a) => createAmountConfig(a).id),
      ...prices.map((p) => createPriceConfigId(p.id)),
      ...(hasEscrowValues ? ['escrowValues'] : []),
    ])
  }
}
