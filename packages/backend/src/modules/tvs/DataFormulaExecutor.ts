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
    latestMode: boolean,
  ) {
    /** Optimization to fetch block for timestamp only once per chain */
    let blockNumbersToTimestamps: Map<number, Map<string, number>> | undefined

    if (latestMode) {
      blockNumbersToTimestamps = await this.getLatestBlockNumbers(
        amounts,
        timestamps[0],
      )
    } else {
      blockNumbersToTimestamps = await this.getBlockNumbersForTimestamps(
        amounts,
        timestamps,
      )
    }
    assert(blockNumbersToTimestamps)

    for (const timestamp of timestamps) {
      const blockNumbers = blockNumbersToTimestamps.get(timestamp.toNumber())
      assert(blockNumbers)

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

      if (latestMode) {
        const latestPrices = await this.priceProvider.getLatestPrices(
          prices.map((p) => p.ticker),
        )

        for (const price of prices) {
          const latest = latestPrices.get(price.ticker)
          assert(latest, `${price.ticker}: No latest price found`)

          await this.storage.writePrice(price.ticker, timestamp, latest)
        }
      } else {
        for (const price of prices) {
          const cachedValue = await this.storage.getPrice(
            price.ticker,
            timestamp,
          )
          if (cachedValue !== undefined) {
            this.logger.info(`Cached value found for ${price.ticker}`)
            continue
          }

          const v = await this.fetchPrice(price, timestamp)
          await this.storage.writePrice(price.ticker, timestamp, v)
        }
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

  async getLatestBlockNumbers(amounts: AmountConfig[], timestamp: UnixTime) {
    const result = new Map<string, number>()

    const chains = extractUniqueChains(amounts)

    for (const chain of chains) {
      const block = this.blockProviders.get(chain)
      assert(block, `${chain}: No BlockProvider configured`)
      this.logger.info(
        `Fetching latest block number for timestamp ${timestamp.toNumber()} on ${chain}`,
      )
      const latestBlock = await block.getLatestBlockNumber()
      result.set(chain, latestBlock)
    }

    return new Map([[timestamp.toNumber(), result]])
  }

  async getBlockNumbersForTimestamps(
    amounts: AmountConfig[],
    timestamps: UnixTime[],
  ) {
    const uniqueChains = extractUniqueChains(amounts)

    const result = new Map<number, Map<string, number>>()

    for (const timestamp of timestamps) {
      result.set(
        timestamp.toNumber(),
        await this.getTimestampToBlockNumbersMapping(uniqueChains, timestamp),
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
function extractUniqueChains(amounts: AmountConfig[]) {
  return [
    ...new Set(
      amounts
        .filter((x) => x.type === 'balanceOfEscrow' || x.type === 'totalSupply')
        .map((x) => x.chain),
    ).values(),
  ]
}
