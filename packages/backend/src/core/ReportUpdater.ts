import { AssetId, UnixTime } from '@l2beat/common'
import { getTokenByAssetId, getTokenByCoingeckoId } from '@l2beat/config'

import {
  BalanceRecord,
  BalanceRepository,
} from '../peripherals/database/BalanceRepository'
import {
  PriceRecord,
  PriceRepository,
} from '../peripherals/database/PriceRepository'
import {
  ReportRecord,
  ReportRepository,
} from '../peripherals/database/ReportRepository'

export class ReportUpdater {
  constructor(
    private priceRepository: PriceRepository,
    private balanceRepository: BalanceRepository,
    private reportRepository: ReportRepository
  ) {}

  private lastProcessed = new UnixTime(0)

  async update(dataPoints: { timestamp: UnixTime; blockNumber: bigint }[]) {
    dataPoints = dataPoints.filter((x) => x.timestamp.gt(this.lastProcessed))
    for (const { timestamp, blockNumber } of dataPoints) {
      const [prices, balances] = await Promise.all([
        this.priceRepository.getByTimestamp(timestamp),
        this.balanceRepository.getByBlock(blockNumber),
      ])
      const tvlEntries = this.calculateTvls(prices, balances)
      this.reportRepository.addOrUpdate(tvlEntries)
      this.lastProcessed = timestamp
    }
  }
  calculateTvls(
    prices: PriceRecord[],
    balances: BalanceRecord[]
  ): ReportRecord[] {
    const tvls: ReportRecord[] = []

    //should we add AssetId to prices table?
    const priceMap = new Map(
      prices.map((p) => [getTokenByCoingeckoId(p.coingeckoId).id, p])
    )

    const ethPrice = priceMap.get(AssetId.ETH)?.priceUsd

    if (ethPrice) {
      for (const balance of balances) {
        const price = priceMap.get(balance.assetId)
        const token = getTokenByAssetId(balance.assetId)

        if (price) {
          tvls.push(calculateTVL(price, token.decimals, balance, ethPrice))
        }
      }
    }
    return tvls
  }
}

export function calculateTVL(
  price: PriceRecord,
  decimals: number,
  balance: BalanceRecord,
  ethPrice: number
): ReportRecord {
  const bigintPrice = getBigIntPrice(price.priceUsd, decimals)

  const usdBalance = (balance.balance * bigintPrice) / BigInt(Math.pow(10, 18))

  const etherBigInt = getBigIntPrice(ethPrice, 18)

  const etherBalance = (usdBalance * BigInt(Math.pow(10, 18))) / etherBigInt

  const usdTVL = BigInt(
    usdBalance.toString().slice(0, usdBalance.toString().length - 18 + 2)
  )

  const ethTVL = BigInt(
    etherBalance.toString().slice(0, usdBalance.toString().length - 18 + 6)
  )

  return {
    blockNumber: balance.blockNumber,
    timestamp: price.timestamp,
    bridge: balance.holderAddress,
    asset: balance.assetId,
    usdTVL,
    ethTVL,
  }
}

export function getBigIntPrice(price: number, decimals: number) {
  const priceTwoDecimals = `${(price * 100).toFixed()}`
  const zeroes = '0'.repeat(18 * 2 - decimals - 2)
  return BigInt(`${priceTwoDecimals}${zeroes}`)
}
