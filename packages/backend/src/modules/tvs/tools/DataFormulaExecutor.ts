import type { Logger } from '@l2beat/backend-tools'
import type { BalanceOfEscrowAmountFormula } from '@l2beat/config'
import type {
  BlockProvider,
  BlockTimestampProvider,
  CirculatingSupplyProvider,
  PriceProvider,
} from '@l2beat/shared'
import {
  assert,
  CoingeckoId,
  type UnixTime,
  assertUnreachable,
} from '@l2beat/shared-pure'
import type { BalanceProvider } from '../providers/BalanceProvider'
import type { TotalSupplyProvider } from '../providers/TotalSupplyProvider'
import type {
  AmountConfig,
  CirculatingSupplyAmountConfig,
  PriceConfig,
  TotalSupplyAmountConfig,
} from '../types'
import type { DBStorage } from './DBStorage'
import type { LocalStorage } from './LocalStorage'

export class DataFormulaExecutor {
  constructor(
    private localStorage: LocalStorage,
    private dbStorage: DBStorage | undefined,
    private priceProvider: PriceProvider,
    private circulatingSupplyProvider: CirculatingSupplyProvider,
    private blockProviders: Map<string, BlockProvider>,
    private blockTimestampProvider: BlockTimestampProvider,
    private totalSupplyProvider: TotalSupplyProvider,
    private balanceProvider: BalanceProvider,
    private logger: Logger,
  ) {}

  /** Fetches data from APIs. Writes result to LocalStorage */
  async execute(
    prices: PriceConfig[],
    amounts: AmountConfig[],
    timestamp: UnixTime,
    isLatestMode: boolean,
  ) {
    const chains = extractUniqueChains(amounts)
    /** Optimization to fetch block for timestamp only once per chain */
    const blockNumbers = await this.getBlockNumbers(
      chains,
      timestamp,
      isLatestMode,
    )

    if (this.dbStorage) {
      this.logger.info(`Preloading prices and amounts from DB`)

      const storedPrices = await Promise.all(
        prices.map((price) => this.localStorage.getPrice(price.id, timestamp)),
      )

      await this.dbStorage.preloadPrices(
        prices
          .map((price) => price.id)
          .filter((_, index) => storedPrices[index] === undefined),
        [timestamp],
      )

      const storedAmounts = await Promise.all(
        amounts.map((amount) =>
          this.localStorage.getAmount(amount.id, timestamp),
        ),
      )

      await this.dbStorage.preloadAmounts(
        amounts
          .map((amount) => amount.id)
          .filter((_, index) => storedAmounts[index] === undefined),
        [timestamp],
      )
    }

    const promises: Promise<void>[] = []

    promises.push(
      ...this.processOnchainAmounts(amounts, timestamp, blockNumbers),
    )

    promises.push(
      ...this.processCirculatingSupplies(amounts, timestamp, isLatestMode),
    )

    promises.push(...this.processPrices(prices, timestamp, isLatestMode))

    this.logger.info(`Fetching data...`)
    await Promise.all(promises)
  }

  private processOnchainAmounts(
    amounts: AmountConfig[],
    timestamp: UnixTime,
    blockNumbers: Map<string, number>,
  ) {
    return amounts
      .filter((a) => a.type !== 'circulatingSupply' && a.type !== 'const')
      .filter(
        (a) =>
          timestamp >= a.sinceTimestamp &&
          (!a.untilTimestamp || timestamp < a.untilTimestamp),
      )
      .map(async (amount) => {
        const cachedValue = await this.localStorage.getAmount(
          amount.id,
          timestamp,
        )

        if (cachedValue !== undefined) {
          this.logger.debug(`Cached value found for ${amount.id}`)
          return
        }

        const dbValue = await this.dbStorage?.getAmount(amount.id, timestamp)

        if (dbValue !== undefined) {
          this.logger.debug(`DB value found for ${amount.id}`)
          await this.localStorage.writeAmount(amount.id, timestamp, dbValue)
          return
        }

        const block = blockNumbers.get(amount.chain)
        assert(block, `Block number not found for chain ${amount.chain}`)

        switch (amount.type) {
          case 'totalSupply': {
            const value = await this.fetchTotalSupply(amount, block)
            await this.localStorage.writeAmount(amount.id, timestamp, value)
            break
          }
          case 'balanceOfEscrow': {
            const value = await this.fetchEscrowBalance(amount, block)
            await this.localStorage.writeAmount(amount.id, timestamp, value)
            break
          }
          default:
            assertUnreachable(amount)
        }
      })
  }

  private processCirculatingSupplies(
    amounts: AmountConfig[],
    timestamp: UnixTime,
    isLatestMode: boolean,
  ) {
    const circulatingAmounts = amounts
      .filter((a) => a.type === 'circulatingSupply')
      .filter(
        (a) =>
          timestamp >= a.sinceTimestamp &&
          (!a.untilTimestamp || timestamp < a.untilTimestamp),
      )

    if (isLatestMode) {
      return [
        (async () => {
          const latestCirculatingSupplies =
            await this.circulatingSupplyProvider.getLatestCirculatingSupplies(
              circulatingAmounts.map((p) => CoingeckoId(p.apiId)),
            )

          for (const c of circulatingAmounts) {
            const latestValue = latestCirculatingSupplies.get(c.apiId)
            assert(
              latestValue !== undefined,
              `${c.apiId}: No latest circulating supply found`,
            )

            await this.localStorage.writeAmount(
              c.id,
              timestamp,
              BigInt(latestValue * 10 ** c.decimals),
            )
          }
        })(),
      ]
    } else {
      return circulatingAmounts.map(async (amount) => {
        const cachedValue = await this.localStorage.getAmount(
          amount.id,
          timestamp,
        )
        if (cachedValue !== undefined) {
          this.logger.debug(`Cached value found for ${amount.id}`)
          return
        }

        const dbValue = await this.dbStorage?.getAmount(amount.id, timestamp)

        if (dbValue !== undefined) {
          this.logger.debug(`DB value found for ${amount.id}`)
          await this.localStorage.writeAmount(amount.id, timestamp, dbValue)
          return
        }

        const value = await this.fetchCirculatingSupply(amount, timestamp)
        await this.localStorage.writeAmount(amount.id, timestamp, value)
      })
    }
  }

  private processPrices(
    prices: PriceConfig[],
    timestamp: UnixTime,
    isLatestMode: boolean,
  ) {
    if (isLatestMode) {
      return [
        (async () => {
          const latestPrices = await this.priceProvider.getLatestPrices(
            prices.map((p) => CoingeckoId(p.priceId)),
          )

          for (const price of prices) {
            const latestPrice = latestPrices.get(price.priceId)
            assert(
              latestPrice !== undefined,
              `${price.priceId}: No latest price found`,
            )

            await this.localStorage.writePrice(price.id, timestamp, latestPrice)
          }
        })(),
      ]
    } else {
      return prices.map(async (price) => {
        const cachedValue = await this.localStorage.getPrice(
          price.id,
          timestamp,
        )
        if (cachedValue !== undefined) {
          this.logger.debug(`Cached value found for ${price.priceId}`)
          return
        }

        const dbValue = await this.dbStorage?.getPrice(price.id, timestamp)

        if (dbValue !== undefined) {
          this.logger.debug(`DB value found for ${price.priceId}`)
          await this.localStorage.writePrice(price.id, timestamp, dbValue)
          return
        }

        const v = await this.fetchPrice(price, timestamp)
        await this.localStorage.writePrice(price.id, timestamp, v)
      })
    }
  }

  async fetchCirculatingSupply(
    config: CirculatingSupplyAmountConfig,
    timestamp: UnixTime,
  ): Promise<bigint> {
    this.logger.debug(`Fetching circulating supply for ${config.apiId}`)

    try {
      const circulating =
        await this.circulatingSupplyProvider.getCirculatingSupplies(
          CoingeckoId(config.apiId),
          { from: timestamp, to: timestamp },
        )
      assert(
        circulating.length === 1,
        `${config.apiId}: Too many supplies fetched ${JSON.stringify(circulating)}`,
      )
      return BigInt(circulating[0].value * 10 ** config.decimals)
    } catch {
      this.logger.warn(
        `Couldn't fetch circulating supply for ${config.apiId}. Assuming 0`,
      )
      return 0n
    }
  }

  async fetchTotalSupply(
    config: TotalSupplyAmountConfig,
    blockNumber: number,
  ): Promise<bigint> {
    this.logger.debug(
      `Fetching total supply for ${config.address} on ${config.chain}`,
    )
    return await this.totalSupplyProvider.getTotalSupply(
      config.chain,
      config.address,
      blockNumber,
    )
  }

  async fetchEscrowBalance(
    config: BalanceOfEscrowAmountFormula,
    blockNumber: number,
  ): Promise<bigint> {
    this.logger.debug(
      `Fetching balance of ${config.address} token for escrow ${config.escrowAddress} on ${config.chain}`,
    )
    const escrowBalance =
      config.address === 'native'
        ? await this.balanceProvider.getNativeAssetBalance(
            config.chain,
            config.escrowAddress,
            blockNumber,
          )
        : await this.balanceProvider.getTokenBalance(
            config.chain,
            config.address,
            config.escrowAddress,
            blockNumber,
          )

    return escrowBalance
  }

  async fetchPrice(config: PriceConfig, timestamp: UnixTime): Promise<number> {
    try {
      if (
        timestamp < config.sinceTimestamp ||
        (config.untilTimestamp && timestamp > config.untilTimestamp)
      ) {
        return 0
      }

      this.logger.debug(`Fetching price for ${config.priceId}`)
      const response = await this.priceProvider.getUsdPriceHistoryHourly(
        CoingeckoId(config.priceId),
        timestamp,
        timestamp,
      )
      assert(
        response.length === 1,
        `${config.priceId}: Too many prices fetched ${JSON.stringify(response)}`,
      )
      return response[0].value
    } catch {
      this.logger.warn(`Couldn't fetch price for ${config.priceId}. Assuming 0`)
      return 0
    }
  }

  async getBlockNumbers(
    chains: string[],
    timestamp: UnixTime,
    isLatestMode: boolean,
  ) {
    const result = new Map<string, number>()

    for (const chain of chains) {
      if (isLatestMode) {
        const block = this.blockProviders.get(chain)
        assert(block, `${chain}: No BlockProvider configured`)
        this.logger.info(`Fetching latest block number on ${chain}`)
        const latestBlock = await block.getLatestBlockNumber()
        result.set(chain, latestBlock)
      } else {
        const cached = await this.localStorage.getBlockNumber(chain, timestamp)
        if (cached) {
          result.set(chain, cached)
          continue
        }

        this.logger.info(
          `Fetching block number for timestamp ${timestamp} on ${chain}`,
        )
        const blockNumber =
          await this.blockTimestampProvider.getBlockNumberAtOrBefore(
            timestamp,
            chain,
          )
        result.set(chain, blockNumber)
        await this.localStorage.writeBlockNumber(chain, timestamp, blockNumber)
      }
    }

    return result
  }
}

function extractUniqueChains(amounts: AmountConfig[]) {
  return [
    ...new Set(
      amounts
        .filter((x) => x.type === 'balanceOfEscrow' || x.type === 'totalSupply')
        .map((x) => x.chain),
    ).values(),
  ]
}
