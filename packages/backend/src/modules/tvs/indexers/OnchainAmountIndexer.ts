import type { Logger } from '@l2beat/backend-tools'
import type {
  BalanceOfEscrowAmountFormula,
  BalanceOfEscrowsAmountFormula,
  StarknetBalanceOfAmountFormula,
  StarknetTotalSupplyAmountFormula,
  TotalSupplyAmountFormula,
} from '@l2beat/config'
import type {
  BalanceProvider,
  StarknetBalanceProvider,
  StarknetTotalSupplyProvider,
  TotalSupplyProvider,
} from '@l2beat/shared'
import { assert, type UnixTime } from '@l2beat/shared-pure'
import { Indexer } from '@l2beat/uif'
import { withCoreFeatureRpcMetricsContext } from '../../../tools/coreFeatureRpcMetrics'
import { INDEXER_NAMES } from '../../../tools/uif/indexerIdentity'
import { ManagedMultiIndexer } from '../../../tools/uif/multi/ManagedMultiIndexer'
import type {
  Configuration,
  ManagedMultiIndexerOptions,
  TrimRemovalConfiguration,
  WipeRemovalConfiguration,
} from '../../../tools/uif/multi/types'
import type { SyncOptimizer } from '../tools/SyncOptimizer'

export type OnchainAmountConfig =
  | BalanceOfEscrowAmountFormula
  | BalanceOfEscrowsAmountFormula
  | TotalSupplyAmountFormula
  | StarknetTotalSupplyAmountFormula
  | StarknetBalanceOfAmountFormula

interface OnchainAmountIndexerDeps
  extends Omit<
    ManagedMultiIndexerOptions<OnchainAmountConfig>,
    'name' | 'logger'
  > {
  syncOptimizer: SyncOptimizer
  chain: string
  totalSupplyProvider: TotalSupplyProvider
  starknetTotalSupplyProvider: StarknetTotalSupplyProvider
  starknetBalanceProvider: StarknetBalanceProvider
  balanceProvider: BalanceProvider
}

export class OnchainAmountIndexer extends ManagedMultiIndexer<OnchainAmountConfig> {
  constructor(
    private readonly $: OnchainAmountIndexerDeps,
    logger: Logger,
  ) {
    super(
      {
        ...$,
        name: INDEXER_NAMES.TVS_CHAIN_AMOUNT,
        tags: {
          tag: $.chain,
          chain: $.chain,
        },
        updateRetryStrategy: Indexer.getInfiniteRetryStrategy(),
      },
      logger,
    )
  }

  override async multiUpdate(
    from: number,
    to: number,
    configurations: Configuration<OnchainAmountConfig>[],
  ) {
    return await withCoreFeatureRpcMetricsContext(
      'tvs.amount',
      { chain: this.$.chain },
      async () => {
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

        const starknetTotalSupplyRecords =
          await this.fetchStarknetTotalSupplies(
            configurations,
            timestamp,
            blockNumber,
          )

        const starknetBalanceRecords = await this.fetchStarknetBalances(
          configurations,
          timestamp,
          blockNumber,
        )

        const amounts = [
          ...escrowBalanceRecords,
          ...totalSupplyRecords,
          ...starknetTotalSupplyRecords,
          ...starknetBalanceRecords,
        ]

        return async () => {
          await this.$.db.tvsAmount.upsertMany(amounts)
          this.logger.info('Saved onchain amounts into DB', {
            timestamp: timestamp,
            amounts: amounts.length,
          })

          return timestamp
        }
      },
    )
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
      (c) =>
        c.properties.type === 'balanceOfEscrow' ||
        c.properties.type === 'balanceOfEscrows',
    ) as Configuration<
      BalanceOfEscrowAmountFormula | BalanceOfEscrowsAmountFormula
    >[]

    if (escrows.length === 0) {
      return []
    }

    const queries = escrows.flatMap((escrow) => {
      const holders =
        escrow.properties.type === 'balanceOfEscrow'
          ? [escrow.properties.escrowAddress]
          : escrow.properties.escrowAddresses

      return holders.map((holder) => ({
        token: escrow.properties.address,
        holder,
      }))
    })

    this.logger.info('Fetching escrow balances', {
      blockNumber,
      balances: queries.length,
    })

    const balances = await this.$.balanceProvider.getBalances(
      queries,
      blockNumber,
      this.$.chain,
    )

    this.logger.info('Fetched escrow balances')

    let offset = 0
    return escrows.map((escrow) => {
      const count =
        escrow.properties.type === 'balanceOfEscrow'
          ? 1
          : escrow.properties.escrowAddresses.length
      const amount = balances
        .slice(offset, offset + count)
        .reduce((sum, balance) => sum + balance, 0n)
      offset += count

      return {
        configurationId: escrow.id,
        amount,
        timestamp,
      }
    })
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
      supplies: tokens.length,
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

  private async fetchStarknetBalances(
    configurations: Configuration<OnchainAmountConfig>[],
    timestamp: number,
    blockNumber: number,
  ) {
    const balances = configurations.filter(
      (c) => c.properties.type === 'starknetBalanceOf',
    ) as Configuration<StarknetBalanceOfAmountFormula>[]

    if (balances.length === 0) {
      return []
    }

    this.logger.info('Fetching starknet balances', {
      blockNumber,
      balances: balances.length,
    })

    const amounts = await this.$.starknetBalanceProvider.getBalances(
      balances.map((balance) => ({
        token: balance.properties.address,
        holder: balance.properties.escrowAddress,
      })),
      blockNumber,
      this.$.chain,
    )

    this.logger.info('Fetched starknet balances')

    return amounts.map((amount, i) => ({
      configurationId: balances[i].id,
      amount,
      timestamp,
    }))
  }

  override async wipeData(configurations: WipeRemovalConfiguration[]) {
    const deletedRecords = await this.$.db.tvsAmount.deleteByConfigIds(
      configurations.map((c) => c.id),
    )
    if (deletedRecords > 0) {
      this.logger.info('Wiped records for configurations', {
        configurations: configurations.length,
        deletedRecords,
      })
    }
  }

  override async trimData(configurations: TrimRemovalConfiguration[]) {
    const configs = configurations.map((c) => ({
      configurationId: c.id,
      fromInclusive: c.range[0],
      toInclusive: c.range[1],
    }))
    const deletedRecords = await this.$.db.tvsAmount.deleteByConfigs(configs)
    if (deletedRecords > 0) {
      this.logger.info('Trimmed records for configurations', {
        configurations: configurations.length,
        deletedRecords,
      })
    }
  }
}
