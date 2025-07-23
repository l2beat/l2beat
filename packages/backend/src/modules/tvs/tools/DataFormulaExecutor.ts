import type { Logger } from '@l2beat/backend-tools'
import type {
  BalanceProvider,
  BlockProvider,
  BlockTimestampProvider,
  CirculatingSupplyProvider,
  PriceProvider,
  StarknetTotalSupplyProvider,
  TotalSupplyProvider,
} from '@l2beat/shared'
import { assert, CoingeckoId, type UnixTime } from '@l2beat/shared-pure'
import {
  type AmountConfig,
  type CirculatingSupplyAmountConfig,
  isOnchainAmountConfig,
  type OnchainAmountConfig,
  type PriceConfig,
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
    private starknetTotalSupplyProvider: StarknetTotalSupplyProvider,
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

    // Block number need to be fetched before onchain amounts.
    // They are needed to fetch at certain block number.
    const blockNumbersToFetch = await this.processBlockNumbers(
      amounts,
      timestamp,
      isLatestMode,
    )
    if (blockNumbersToFetch.length > 0) {
      this.logger.info(
        `Fetching block numbers from host chains(${blockNumbersToFetch.length})...`,
      )
      const chainNames = blockNumbersToFetch
        .map((chain) => chain.name)
        .join(', ')

      this.logger.debug(`\t${chainNames}`)
      const startTime = Date.now()
      await Promise.all(blockNumbersToFetch.map((chain) => chain.promise))
      const duration = (Date.now() - startTime) / 1000
      this.logger.info(`Block numbers fetched in ${duration.toFixed(2)}s`)
    }

    const onchainToFetch = await this.processOnchainAmounts(amounts, timestamp)

    if (onchainToFetch.length > 0) {
      const totalOnchainCount = onchainToFetch.reduce(
        (sum, item) => sum + item.valuesCount,
        0,
      )
      this.logger.info(`Fetching onchain amounts (${totalOnchainCount})...`)

      const chainCounts = new Map<string, number>()
      for (const item of onchainToFetch) {
        const currentCount = chainCounts.get(item.chain) || 0
        chainCounts.set(item.chain, currentCount + item.valuesCount)
      }

      for (const [chain, count] of chainCounts.entries()) {
        this.logger.debug(`\t ${chain}: ${count}`)
      }

      const startTime = Date.now()
      await Promise.all(onchainToFetch.map((o) => o.promise))
      const duration = (Date.now() - startTime) / 1000
      this.logger.info(`Onchain amounts fetched in ${duration.toFixed(2)}s`)
    }

    const pricesToFetch = await this.processPrices(
      prices,
      timestamp,
      isLatestMode,
    )

    const circulatingToFetch = await this.processCirculatingSupplies(
      amounts,
      timestamp,
      isLatestMode,
    )

    if (pricesToFetch.length > 0 || circulatingToFetch.length > 0) {
      this.logger.info('Fetching prices and circulating supplies...')
      this.logger.info(`\t prices (${pricesToFetch.length})`)
      this.logger.info(`\t circulating supplies (${circulatingToFetch.length})`)

      const startTime = Date.now()
      await Promise.all([...pricesToFetch, ...circulatingToFetch])
      const duration = (Date.now() - startTime) / 1000
      this.logger.info(
        `Prices and circulating supplies fetched in ${duration.toFixed(2)}s`,
      )
    }
  }

  private async preloadDataFromDB(
    prices: PriceConfig[],
    timestamp: number,
    amounts: AmountConfig[],
  ) {
    assert(this.dbStorage)
    this.logger.info('Preloading prices and amounts from DB')

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
          const cachedValue = await this.localStorage.getBlockNumber(
            chain,
            timestamp,
          )

          if (cachedValue !== undefined) {
            this.logger.debug(`Cached value found for ${chain}`)
            return
          }

          const dbValue = await this.dbStorage?.getTimestamp(chain, timestamp)

          if (dbValue !== undefined) {
            this.logger.debug(`DB value found for ${chain}`)
            await this.localStorage.writeBlockNumber(chain, timestamp, dbValue)
            return
          }

          chainsToFetch.push(chain)
        }
      }),
    )

    return chainsToFetch.map((chain) => ({
      name: chain,
      promise: this.fetchBlockNumber(chain, timestamp, isLatestMode),
    }))
  }

  private async processOnchainAmounts(
    amounts: AmountConfig[],
    timestamp: UnixTime,
  ) {
    const onchainAmounts = amounts
      .filter(isOnchainAmountConfig)
      .filter(
        (a) =>
          timestamp >= a.sinceTimestamp &&
          (!a.untilTimestamp || timestamp < a.untilTimestamp),
      )

    const amountsToFetch = new Map<string, Map<string, OnchainAmountConfig[]>>()

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
            new Map<string, OnchainAmountConfig[]>(),
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

    const fetchPromises: {
      promise: Promise<void>
      valuesCount: number
      chain: string
    }[] = []

    for (const [chain, typeMap] of amountsToFetch.entries()) {
      const block = await this.localStorage.getBlockNumber(chain, timestamp)
      assert(block, `Block number not found for chain ${chain}`)

      for (const [type, configs] of typeMap.entries()) {
        fetchPromises.push({
          promise: (async () => {
            switch (type) {
              case 'totalSupply': {
                assert(configs.every((c) => c.type === 'totalSupply'))
                const values = await this.totalSupplyProvider.getTotalSupplies(
                  configs.map((c) => c.address),
                  block,
                  chain,
                )
                await this.localStorage.writeAmounts(
                  timestamp,
                  Array.from(values.values()).map((value, i) => ({
                    id: configs[i].id,
                    amount: value,
                  })),
                )
                break
              }
              case 'starknetTotalSupply': {
                assert(configs.every((c) => c.type === 'starknetTotalSupply'))
                const values =
                  await this.starknetTotalSupplyProvider.getTotalSupplies(
                    configs.map((c) => c.address),
                    block,
                    chain,
                  )
                await this.localStorage.writeAmounts(
                  timestamp,
                  Array.from(values.values()).map((value, i) => ({
                    id: configs[i].id,
                    amount: value,
                  })),
                )
                break
              }
              case 'balanceOfEscrow': {
                assert(configs.every((c) => c.type === 'balanceOfEscrow'))
                const values = await this.balanceProvider.getBalances(
                  configs.map((c) => ({
                    token: c.address,
                    holder: c.escrowAddress,
                  })),
                  block,
                  chain,
                )

                await this.localStorage.writeAmounts(
                  timestamp,
                  Array.from(values.values()).map((value, i) => ({
                    id: configs[i].id,
                    amount: value,
                  })),
                )
                break
              }
            }
          })(),
          valuesCount: configs.length,
          chain,
        })
      }
    }

    return fetchPromises
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
    }
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
    }
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

  private async fetchBlockNumber(
    chain: string,
    timestamp: UnixTime,
    isLatestMode: boolean,
  ): Promise<void> {
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
  }

  async fetchPrice(config: PriceConfig, timestamp: UnixTime): Promise<number> {
    try {
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
}

function extractUniqueChains(amounts: AmountConfig[]) {
  return [
    ...new Set(
      amounts.filter(isOnchainAmountConfig).map((x) => x.chain),
    ).values(),
  ]
}
