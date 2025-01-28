import type { Logger } from '@l2beat/backend-tools'
import type { BlockProvider } from '@l2beat/shared'
import { assert, type UnixTime, assertUnreachable } from '@l2beat/shared-pure'
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
      const blockNumbers = await this.getBlockNumbers(amounts, timestamp)

      const promises = amounts.map(async (amount) => {
        const cachedValue = await this.storage.getAmount(amount.id, timestamp)
        if (cachedValue !== undefined) {
          this.logger.debug(`Cached value found for ${amount.id}`)
          return
        }

        let value: number

        switch (amount.type) {
          case 'circulatingSupply': {
            value = await this.fetchCirculatingSupply(amount, timestamp)
            break
          }
          case 'totalSupply': {
            const b = blockNumbers.get(amount.chain)
            assert(b, `Block number not found for chain ${amount.chain}`)
            value = await this.fetchTotalSupply(amount, b)
            break
          }
          case 'balanceOfEscrow': {
            const b = blockNumbers.get(amount.chain)
            assert(b, `Block number not found for chain ${amount.chain}`)
            value = await this.fetchEscrowBalance(amount, b)
            break
          }
          default: {
            assertUnreachable(amount)
          }
        }

        await this.storage.writeAmount(amount.id, timestamp, value)
      })

      promises.concat(
        prices.map(async (price, index) => {
          this.logger.debug(`Processing price ${index} of ${prices.length}`)

          const cachedValue = await this.storage.getPrice(
            price.ticker,
            timestamp,
          )
          if (cachedValue !== undefined) {
            this.logger.debug(`Cached value found for ${price.ticker}`)
            return // Skip further processing for this price
          }

          const value = await this.fetchPrice(price, timestamp)
          await this.storage.writePrice(price.ticker, timestamp, value)
        }),
      )

      this.logger.info(
        `Fetching prices [${prices.length}] and amounts [${amounts.length}]`,
      )
      this.logger.info('This will take a minute ;-)')
      await Promise.all(promises)
      this.logger.info('Data fetched')
    }
  }

  async fetchCirculatingSupply(
    config: CirculatingSupplyAmountConfig,
    timestamp: UnixTime,
  ): Promise<number> {
    this.logger.debug(`Fetching circulating supply for ${config.ticker}`)

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
    this.logger.debug(
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
    this.logger.debug(
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
      this.logger.debug(`Fetching price for ${config.ticker}`)
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
      const cached = await this.storage.getBlockNumber(chain, timestamp)
      if (cached) {
        result.set(chain, cached)
        continue
      }
      const block = this.blockProviders.get(chain)
      assert(block, `${chain}: No BlockProvider configured`)
      this.logger.info(
        `Fetching block number for timestamp ${timestamp.toNumber()} on ${chain}`,
      )
      const blockNumber = await block.getBlockNumberAtOrBefore(timestamp)
      result.set(chain, blockNumber)
      await this.storage.writeBlockNumber(chain, timestamp, blockNumber)
    }

    return result
  }
}
