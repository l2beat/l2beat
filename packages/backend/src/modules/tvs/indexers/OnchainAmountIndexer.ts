import { INDEXER_NAMES } from '@l2beat/backend-shared'
import type { Database } from '@l2beat/database'
import type { TvsAmountRecord } from '@l2beat/database/dist/tvs/amount/entity'
import type { BalanceProvider, TotalSupplyProvider } from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  RemovalConfiguration,
} from '../../../tools/uif/multi/types'
import type { SyncOptimizer } from '../../tvl/utils/SyncOptimizer'
import type {
  BalanceOfEscrowAmountFormula,
  TotalSupplyAmountFormula,
} from '../types'

type AmountConfig = (
  | BalanceOfEscrowAmountFormula
  | TotalSupplyAmountFormula
) & { project: string }

interface OnchainAmountIndexerDeps
  extends Omit<ManagedMultiIndexerOptions<AmountConfig>, 'name'> {
  db: Database
  syncOptimizer: SyncOptimizer
  chain: string
  totalSupplyProvider: TotalSupplyProvider
  balanceProvider: BalanceProvider
}

export class OnchainAmountIndexer extends ManagedMultiIndexer<AmountConfig> {
  constructor(private readonly $: OnchainAmountIndexerDeps) {
    super({
      ...$,
      name: INDEXER_NAMES.TVS_CHAIN_AMOUNT,
      tags: {
        tag: $.chain,
        chain: $.chain,
      },
      updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
    })
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<AmountConfig>[],
  ) {
    const timestamp = this.$.syncOptimizer.getTimestampToSync(from)
    if (timestamp > to) {
      this.logger.info('Skipping update due to sync optimization', {
        from,
        to,
        optimizedTimestamp: timestamp,
      })
      return () => Promise.resolve(to)
    }

    const blockNumber = await this.getBlockNumber(timestamp)

    const escrows = configurations.filter(
      (c) => c.properties.type === 'balanceOfEscrow',
    ) as Configuration<BalanceOfEscrowAmountFormula & { project: string }>[]

    const balances = await this.$.balanceProvider.getBalances(
      escrows.map((ee) => ({
        token: ee.properties.address,
        holder: ee.properties.escrowAddress,
      })),
      blockNumber,
      this.$.chain,
    )

    this.logger.info('Fetched balances', {
      timestamp: timestamp,
      blockNumber,
      balances: balances.length,
    })

    const tokens = configurations.filter(
      (c) => c.properties.type === 'totalSupply',
    ) as Configuration<TotalSupplyAmountFormula & { project: string }>[]

    const totalSupplies = await this.$.totalSupplyProvider.getTotalSupplies(
      tokens.map((ee) => ee.properties.address),
      blockNumber,
      this.$.chain,
    )

    this.logger.info('Fetched totalSupplies', {
      timestamp: timestamp,
      blockNumber,
      balances: totalSupplies.length,
    })

    const amounts: TvsAmountRecord[] = [
      ...balances.map((supply, i) => ({
        configId: escrows[i].id,
        amount: supply,
        timestamp,
        project: escrows[i].properties.project,
      })),
      ...totalSupplies.map((supply, i) => ({
        configId: tokens[i].id,
        amount: supply,
        timestamp,
        project: tokens[i].properties.project,
      })),
    ]

    return async () => {
      await this.$.db.amount.insertMany(amounts)
      this.logger.info('Saved amounts for timestamp into DB', {
        timestamp: timestamp,
        amounts: amounts.length,
      })

      return timestamp
    }
  }

  private async getBlockNumber(timestamp: UnixTime) {
    const blockNumber =
      await this.$.db.tvsBlockTimestamp.findBlockNumberByChainAndTimestamp(
        this.$.chain,
        timestamp,
      )
    assert(blockNumber, `Block number not found for timestamp: ${timestamp}`)
    return blockNumber
  }

  override async removeData(configurations: RemovalConfiguration[]) {
    for (const configuration of configurations) {
      const deletedRecords =
        await this.$.db.tvsAmount.deleteByConfigInTimeRange(
          configuration.id,
          UnixTime(configuration.from),
          UnixTime(configuration.to),
        )

      if (deletedRecords > 0) {
        this.logger.info('Deleted amounts for configuration', {
          id: configuration.id,
          from: configuration.from,
          to: configuration.to,
          deletedRecords,
        })
      }
    }
  }
}
