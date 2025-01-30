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
    isLatestMode: boolean,
  ) {
    const chains = extractUniqueChains(amounts)

    /** Optimization to fetch block for timestamp only once per chain */
    const blockNumbersToTimestamps = await this.getBlockNumbers(
      chains,
      timestamps,
      isLatestMode,
    )

    const promises: Promise<void>[] = []

    for (const timestamp of timestamps) {
      const blockNumbers = blockNumbersToTimestamps.get(timestamp.toNumber())
      assert(blockNumbers)

      promises.push(
        ...this.processTotalSuppliesAndEscrows(
          amounts,
          timestamp,
          blockNumbers,
        ),
      )

      promises.push(
        ...this.processCirculatingSupplies(amounts, timestamp, isLatestMode),
      )

      promises.push(...this.processPrices(prices, timestamp, isLatestMode))

      this.logger.info(`Fetching data...`)
      console.time('Data fetched')
      await Promise.all(promises)
      console.timeEnd('Data fetched')
    }
  }

  private processTotalSuppliesAndEscrows(
    amounts: AmountConfig[],
    timestamp: UnixTime,
    blockNumbers: Map<string, number>,
  ) {
    return amounts
      .filter((a) => a.type !== 'circulatingSupply')
      .map(async (amount) => {
        const cachedValue = await this.storage.getAmount(amount.id, timestamp)
        if (cachedValue !== undefined) {
          this.logger.debug(`Cached value found for ${amount.id}`)
          return
        }

        const block = blockNumbers.get(amount.chain)
        assert(block, `Block number not found for chain ${amount.chain}`)

        switch (amount.type) {
          case 'totalSupply': {
            const value = await this.fetchTotalSupply(amount, block)
            await this.storage.writeAmount(amount.id, timestamp, value)
            break
          }
          case 'balanceOfEscrow': {
            const value = await this.fetchEscrowBalance(amount, block)
            await this.storage.writeAmount(amount.id, timestamp, value)
            break
          }
        }
      })
  }

  private processCirculatingSupplies(
    amounts: AmountConfig[],
    timestamp: UnixTime,
    isLatestMode: boolean,
  ) {
    if (isLatestMode) {
      return [
        (async () => {
          const circulatingSupplies = amounts.filter(
            (a) => a.type === 'circulatingSupply',
          )
          const latestCirculatingSupplies =
            await this.circulatingSupplyProvider.getLatestCirculatingSupplies(
              circulatingSupplies.map((p) => p.ticker),
            )

          for (const c of circulatingSupplies) {
            const latest = latestCirculatingSupplies.get(c.ticker)
            assert(
              latest !== undefined,
              `${c.ticker}: No latest circulating supply found`,
            )

            await this.storage.writeAmount(c.id, timestamp, latest)
          }
        })(),
      ]
    } else {
      return amounts
        .filter((a) => a.type === 'circulatingSupply')
        .map(async (amount) => {
          const cachedValue = await this.storage.getAmount(amount.id, timestamp)
          if (cachedValue !== undefined) {
            this.logger.debug(`Cached value found for ${amount.id}`)
            return
          }

          const value = await this.fetchCirculatingSupply(amount, timestamp)
          await this.storage.writeAmount(amount.id, timestamp, value)
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
            prices.map((p) => p.ticker),
          )

          for (const price of prices) {
            const latest = latestPrices.get(price.ticker)
            assert(
              latest !== undefined,
              `${price.ticker}: No latest price found`,
            )

            await this.storage.writePrice(price.ticker, timestamp, latest)
          }
        })(),
      ]
    } else {
      return prices.map(async (price) => {
        const cachedValue = await this.storage.getPrice(price.ticker, timestamp)
        if (cachedValue !== undefined) {
          this.logger.debug(`Cached value found for ${price.ticker}`)
          return
        }
        const v = await this.fetchPrice(price, timestamp)
        await this.storage.writePrice(price.ticker, timestamp, v)
      })
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
      this.logger.error(`Error fetching price for ${config.ticker}. Assuming 0`)
      return 0
    }
  }

  async getLatestBlockNumbers(chains: string[], timestamp: UnixTime) {
    const result = new Map<string, number>()

    for (const chain of chains) {
      const block = this.blockProviders.get(chain)
      assert(block, `${chain}: No BlockProvider configured`)
      this.logger.debug(
        `Fetching latest block number for timestamp ${timestamp.toNumber()} on ${chain}`,
      )
      const latestBlock = await block.getLatestBlockNumber()
      result.set(chain, latestBlock)
    }

    return new Map([[timestamp.toNumber(), result]])
  }

  async getBlockNumbersForTimestamps(chains: string[], timestamps: UnixTime[]) {
    const result = new Map<number, Map<string, number>>()

    for (const timestamp of timestamps) {
      result.set(
        timestamp.toNumber(),
        await this.getTimestampToBlockNumbersMapping(chains, timestamp),
      )
    }

    return result
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

  async getBlockNumbers(
    chains: string[],
    timestamps: UnixTime[],
    isLatestMode: boolean,
  ) {
    let blockNumbersToTimestamps: Map<number, Map<string, number>> | undefined

    if (isLatestMode) {
      blockNumbersToTimestamps = await this.getLatestBlockNumbers(
        chains,
        timestamps[0],
      )
    } else {
      blockNumbersToTimestamps = await this.getBlockNumbersForTimestamps(
        chains,
        timestamps,
      )
    }
    assert(blockNumbersToTimestamps)
    return blockNumbersToTimestamps
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
