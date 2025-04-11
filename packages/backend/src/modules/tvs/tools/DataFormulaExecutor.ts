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
    if (this.dbStorage) {
      await this.preloadDataFromDB(prices, timestamp, amounts)
    }

    // Block number need to be fetched before rest of the data.
    // They are needed for onchain amounts fetching
    const blockNumbersToFetch = await this.processBlockNumbers(
      amounts,
      timestamp,
      isLatestMode,
    )
    if (blockNumbersToFetch.length > 0) {
      this.logger.info(
        `Fetching block numbers (${blockNumbersToFetch.length})...`,
      )
      await Promise.all(blockNumbersToFetch)
      this.logger.info(`Block numbers fetched`)
    }

    const promises: Promise<void>[] = []

    const pricesToFetch = await this.processPrices(
      prices,
      timestamp,
      isLatestMode,
    )
    promises.push(...pricesToFetch)

    const circulatingToFetch = await this.processCirculatingSupplies(
      amounts,
      timestamp,
      isLatestMode,
    )
    promises.push(...circulatingToFetch)

    const onchainToFetch = await this.processOnchainAmounts(amounts, timestamp)
    promises.push(...onchainToFetch)

    if (promises.length > 0) {
      this.logger.info(`Fetching data, this will take longer time...`)
      this.logger.info(`\t prices (${pricesToFetch.length})...`)
      this.logger.info(
        `\t circulating supplies (${circulatingToFetch.length})...`,
      )
      this.logger.info(`\t onchain amount (${onchainToFetch.length})...`)

      await Promise.all(promises)
    }
  }

  private async preloadDataFromDB(
    prices: PriceConfig[],
    timestamp: number,
    amounts: AmountConfig[],
  ) {
    assert(this.dbStorage)
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

  private async processBlockNumbers(
    amounts: AmountConfig[],
    timestamp: UnixTime,
    isLatestMode: boolean,
  ) {
    const chains = extractUniqueChains(amounts)

    const chainsToFetch: string[] = []

    await Promise.all(
      chains.map(async (chain) => {
        if (isLatestMode) {
          chainsToFetch.push(chain)
        } else {
          const cached = await this.localStorage.getBlockNumber(
            chain,
            timestamp,
          )
          if (cached) {
            return
          }

          // TODO: add DB preload

          chainsToFetch.push(chain)
        }
      }),
    )

    return chainsToFetch.map(async (chain) => {
      if (isLatestMode) {
        const block = this.blockProviders.get(chain)
        assert(block, `${chain}: No BlockProvider configured`)
        const latestBlock = await block.getLatestBlockNumber()
        await this.localStorage.writeBlockNumber(chain, timestamp, latestBlock)
      } else {
        const blockNumber =
          await this.blockTimestampProvider.getBlockNumberAtOrBefore(
            timestamp,
            chain,
          )
        await this.localStorage.writeBlockNumber(chain, timestamp, blockNumber)
      }
    })
  }

  private async processPrices(
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
      const pricesToFetch: PriceConfig[] = []

      await Promise.all(
        prices.map(async (price) => {
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

          pricesToFetch.push(price)
        }),
      )

      return pricesToFetch.map(async (price) => {
        const v = await this.fetchPrice(price, timestamp)
        await this.localStorage.writePrice(price.id, timestamp, v)
      })
    }
  }

  private async processCirculatingSupplies(
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
      const amountsToFetch: AmountConfig[] = []

      await Promise.all(
        circulatingAmounts.map(async (amount) => {
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

          amountsToFetch.push(amount)
        }),
      )

      return amountsToFetch.map(async (amount) => {
        assert(amount.type === 'circulatingSupply')
        const value = await this.fetchCirculatingSupply(amount, timestamp)
        await this.localStorage.writeAmount(amount.id, timestamp, value)
      })
    }
  }

  private async processOnchainAmounts(
    amounts: AmountConfig[],
    timestamp: UnixTime,
  ) {
    const onchainAmounts = amounts
      .filter((a) => a.type === 'balanceOfEscrow' || a.type === 'totalSupply')
      .filter(
        (a) =>
          timestamp >= a.sinceTimestamp &&
          (!a.untilTimestamp || timestamp < a.untilTimestamp),
      )

    const amountsToFetch = new Map<
      string,
      Map<'balanceOfEscrow' | 'totalSupply', AmountConfig[]>
    >()

    await Promise.all(
      onchainAmounts.map(async (amount) => {
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

        if (!amountsToFetch.has(amount.chain)) {
          amountsToFetch.set(
            amount.chain,
            new Map<'balanceOfEscrow' | 'totalSupply', AmountConfig[]>(),
          )
        }

        const chainMap = amountsToFetch.get(amount.chain)
        assert(chainMap)

        if (!chainMap.has(amount.type)) {
          chainMap.set(amount.type, [])
        }

        const typeMap = chainMap.get(amount.type)
        assert(typeMap)
        typeMap.push(amount)
      }),
    )

    const fetchPromises: Promise<void>[] = []

    for (const [chain, typeMap] of amountsToFetch.entries()) {
      const block = await this.localStorage.getBlockNumber(chain, timestamp)
      assert(block, `Block number not found for chain ${chain}`)

      for (const [type, configs] of typeMap.entries()) {
        for (const amount of configs) {
          fetchPromises.push(
            (async () => {
              let value: bigint
              switch (type) {
                case 'totalSupply': {
                  assert(amount.type === 'totalSupply')
                  value = await this.fetchTotalSupply(amount, block)
                  break
                }
                case 'balanceOfEscrow': {
                  assert(amount.type === 'balanceOfEscrow')
                  value = await this.fetchEscrowBalance(amount, block)
                  break
                }
                default:
                  assertUnreachable(type)
              }

              await this.localStorage.writeAmount(amount.id, timestamp, value)
            })(),
          )
        }
      }
    }

    return fetchPromises
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
