import type {
  BalanceOfEscrowAmountFormula,
  StarknetTotalSupplyAmountFormula,
  TotalSupplyAmountFormula,
} from '@l2beat/config'
import type {
  BalanceProvider,
  StarknetTotalSupplyProvider,
  TotalSupplyProvider,
} from '@l2beat/shared'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  RemovalConfiguration,
} from '../../../tools/uif/multi/types'
import type { SyncOptimizer } from '../tools/SyncOptimizer'

export type OnchainAmountConfig =
  | BalanceOfEscrowAmountFormula
  | TotalSupplyAmountFormula
  | StarknetTotalSupplyAmountFormula

interface OnchainAmountIndexerDeps
  extends Omit<ManagedMultiIndexerOptions<OnchainAmountConfig>, 'name'> {
  syncOptimizer: SyncOptimizer
  chain: string
  totalSupplyProvider: TotalSupplyProvider
  starknetTotalSupplyProvider: StarknetTotalSupplyProvider
  balanceProvider: BalanceProvider
}

export class OnchainAmountIndexer extends ManagedMultiIndexer<OnchainAmountConfig> {
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
    configurations: Configuration<OnchainAmountConfig>[],
  ) {
    const timestamp = this.$.syncOptimizer.getTimestampToSync(from)
    if (timestamp > to) {
      this.logger.info('Timestamp out of range', {
        from,
        to,
        timestamp,
      })
      return () => Promise.resolve(to)
    }

    const blockNumber = await this.getBlockNumber(timestamp)

    const escrowBalanceRecords = await this.fetchEscrowBalances(
      configurations,
      timestamp,
      blockNumber,
    )

    const totalSupplyRecords = await this.fetchRpcTotalSupplies(
      configurations,
      timestamp,
      blockNumber,
    )

    const starknetTotalSupplyRecords = await this.fetchStarknetTotalSupplies(
      configurations,
      timestamp,
      blockNumber,
    )

    const amounts = [
      ...escrowBalanceRecords,
      ...totalSupplyRecords,
      ...starknetTotalSupplyRecords,
    ]

    return async () => {
      await this.$.db.tvsAmount.insertMany(amounts)
      this.logger.info('Saved onchain amounts into DB', {
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

    this.logger.info('Found block number for timestamp', {
      timestamp,
      blockNumber,
    })
    return blockNumber
  }

  private async fetchEscrowBalances(
    configurations: Configuration<OnchainAmountConfig>[],
    timestamp: number,
    blockNumber: number,
  ) {
    const escrows = configurations.filter(
      (c) => c.properties.type === 'balanceOfEscrow',
    ) as Configuration<BalanceOfEscrowAmountFormula>[]

    if (escrows.length === 0) {
      return []
    }

    this.logger.info('Fetching escrow balances', {
      blockNumber,
      balances: escrows.length,
    })

    const balances = await this.$.balanceProvider.getBalances(
      escrows.map((escrow) => ({
        token: escrow.properties.address,
        holder: escrow.properties.escrowAddress,
      })),
      blockNumber,
      this.$.chain,
    )

    this.logger.info('Fetched escrow balances')

    return balances.map((supply, i) => ({
      configurationId: escrows[i].id,
      amount: supply,
      timestamp,
    }))
  }

  private async fetchRpcTotalSupplies(
    configurations: Configuration<OnchainAmountConfig>[],
    timestamp: number,
    blockNumber: number,
  ) {
    const tokens = configurations.filter(
      (c) => c.properties.type === 'totalSupply',
    ) as Configuration<TotalSupplyAmountFormula>[]

    if (tokens.length === 0) {
      return []
    }

    this.logger.info('Fetching rpc total supplies', {
      blockNumber,
      balances: tokens.length,
    })

    const totalSupplies = await this.$.totalSupplyProvider.getTotalSupplies(
      tokens.map((token) => token.properties.address),
      blockNumber,
      this.$.chain,
    )

    this.logger.info('Fetched rpc total supplies')

    return totalSupplies.map((supply, i) => ({
      configurationId: tokens[i].id,
      amount: supply,
      timestamp,
    }))
  }

  private async fetchStarknetTotalSupplies(
    configurations: Configuration<OnchainAmountConfig>[],
    timestamp: number,
    blockNumber: number,
  ) {
    const tokens = configurations.filter(
      (c) => c.properties.type === 'starknetTotalSupply',
    ) as Configuration<StarknetTotalSupplyAmountFormula>[]

    if (tokens.length === 0) {
      return []
    }

    this.logger.info('Fetching starknet total supplies', {
      blockNumber,
      balances: tokens.length,
    })

    const totalSupplies =
      await this.$.starknetTotalSupplyProvider.getTotalSupplies(
        tokens.map((token) => token.properties.address),
        blockNumber,
        this.$.chain,
      )

    this.logger.info('Fetched starknet total supplies')

    return totalSupplies.map((supply, i) => ({
      configurationId: tokens[i].id,
      amount: supply,
      timestamp,
    }))
  }

  override async removeData(configurations: RemovalConfiguration[]) {
    for (const configuration of configurations) {
      const deletedRecords =
        await this.$.db.tvsAmount.deleteByConfigInTimeRange(
          configuration.id,
          UnixTime(configuration.from),
          UnixTime(configuration.to),
        )

      if (deletedRecords) {
        this.logger.info('Deleted records for configuration', {
          id: configuration.id,
          from: configuration.from,
          to: configuration.to,
          deletedRecords,
        })
      }
    }
  }
}
