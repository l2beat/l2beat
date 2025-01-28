import type { Logger } from '@l2beat/backend-tools'
import type { BlockProvider } from '@l2beat/shared'
import { assert, type UnixTime } from '@l2beat/shared-pure'
import type { DataStorage } from './DataStorage'
import type { BalanceProvider } from './providers/BalanceProvider'
import type { CirculatingSupplyProvider } from './providers/CirculatingSupplyProvider'
import type { PriceProvider } from './providers/PriceProvider'
import type { TotalSupplyProvider } from './providers/TotalSupplyProvider'
import type {
  AmountConfig,
  BalanceOfEscrowAmountFormula,
  CirculatingSupplyAmountConfig,
  PriceConfig,
  TotalSupplyAmountConfig,
} from './types'

export class DataFormulaExecutor {
  constructor(
    private storage: DataStorage,
    private priceProvider: PriceProvider,
    private circulatingSupplyProvider: CirculatingSupplyProvider,
    private blockProviders: Map<string, BlockProvider>,
    private totalSupplyProvider: TotalSupplyProvider,
    private balanceProvider: BalanceProvider,
    private logger: Logger,
  ) {}

  /** Fetches data from APIs. Writes result to LocalStorage */
  async execute(
    prices: PriceConfig[],
    amounts: AmountConfig[],
    timestamps: UnixTime[],
  ) {
    for (const timestamp of timestamps) {
      /** Optimization to fetch block for timestamp only once per chain */
      // TODO: save it in storage
      const blockNumbers = await this.getBlockNumbers(amounts, timestamp)

      for (const index in amounts) {
        this.logger.info(
          `Processing amount ${Number(index) + 1} of ${amounts.length}`,
        )
        const amount = amounts[index]

        const cachedValue = await this.storage.getAmount(amount.id, timestamp)
        if (cachedValue !== undefined) {
          this.logger.info(`Cached value found for ${amount.id}`)
          continue
        }

        switch (amount.type) {
          case 'circulatingSupply': {
            const v = await this.fetchCirculatingSupply(amount, timestamp)
            await this.storage.writeAmount(amount.id, timestamp, v)
            break
          }
          case 'totalSupply': {
            const b = blockNumbers.get(amount.chain)
            assert(b)
            const v = await this.fetchTotalSupply(amount, b)
            await this.storage.writeAmount(amount.id, timestamp, v)
            break
          }
          case 'balanceOfEscrow': {
            const b = blockNumbers.get(amount.chain)
            assert(b)
            const v = await this.fetchEscrowBalance(amount, b)
            await this.storage.writeAmount(amount.id, timestamp, v)
            break
          }
        }
      }

      for (const index in prices) {
        this.logger.info(
          `Processing price ${Number(index) + 1} of ${prices.length}`,
        )
        const price = prices[index]

        const cachedValue = await this.storage.getPrice(price.id, timestamp)
        if (cachedValue !== undefined) {
          this.logger.info(`Cached value found for ${price.id}`)
          continue
        }

        const v = await this.fetchPrice(price, timestamp)
        await this.storage.writePrice(price.id, timestamp, v)
      }
    }
  }

  async fetchCirculatingSupply(
    config: CirculatingSupplyAmountConfig,
    timestamp: UnixTime,
  ): Promise<number> {
    this.logger.info(`Fetching circulating supply for ${config.ticker}`)

    try {
      return await this.circulatingSupplyProvider.getCirculatingSupply(
        config.ticker,
        timestamp,
      )
    } catch {
      // TODO temporary workaround for issues with UMAMI
      this.logger.error(
        `Error fetching circulating supply for ${config.ticker}. Assuming 0`,
      )
      return 0
    }
  }

  async fetchTotalSupply(
    config: TotalSupplyAmountConfig,
    blockNumber: number,
  ): Promise<number> {
    this.logger.info(
      `Fetching total supply for ${config.address} on ${config.chain}`,
    )
    return await this.totalSupplyProvider.getTotalSupply(
      config.chain,
      config.address,
      config.decimals,
      blockNumber,
    )
  }

  async fetchEscrowBalance(
    config: BalanceOfEscrowAmountFormula,
    blockNumber: number,
  ): Promise<number> {
    this.logger.info(
      `Fetching balance of ${config.address} token for escrow ${config.escrowAddress} on ${config.chain}`,
    )
    const escrowBalance =
      config.address === 'native'
        ? await this.balanceProvider.getNativeAssetBalance(
            config.chain,
            config.escrowAddress,
            config.decimals,
            blockNumber,
          )
        : await this.balanceProvider.getTokenBalance(
            config.chain,
            config.address,
            config.escrowAddress,
            config.decimals,
            blockNumber,
          )

    return escrowBalance
  }

  async fetchPrice(config: PriceConfig, timestamp: UnixTime): Promise<number> {
    try {
      // TODO think about getting prices from STAGING DB
      this.logger.info(`Fetching price for ${config.ticker}`)
      return await this.priceProvider.getPrice(config.ticker, timestamp)
    } catch {
      // TODO temporary workaround for issues with rhinofi
      this.logger.error(`Error fetching price for ${config.ticker}. Assuming 0`)
      return 0
    }
  }

  async getBlockNumbers(amounts: AmountConfig[], timestamp: UnixTime) {
    const uniqueChains = [
      ...new Set(
        amounts
          .filter(
            (x) => x.type === 'balanceOfEscrow' || x.type === 'totalSupply',
          )
          .map((x) => x.chain),
      ).values(),
    ]

    return await this.getTimestampToBlockNumbersMapping(uniqueChains, timestamp)
  }

  async getTimestampToBlockNumbersMapping(
    chains: string[],
    timestamp: UnixTime,
  ) {
    const result = new Map<string, number>()

    for (const chain of chains) {
      const block = this.blockProviders.get(chain)
      assert(block, `${chain}: No BlockProvider configured`)
      this.logger.info(
        `Getting block number for timestamp ${timestamp.toNumber()} on ${chain}`,
      )
      const blockNumber = await block.getBlockNumberAtOrBefore(timestamp)
      result.set(chain, blockNumber)
    }

    return result
  }
}
