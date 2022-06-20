import { AssetId, Logger, UnixTime } from '@l2beat/common'

import { Token } from '../model'
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
  private tokenByAssetId = new Map<AssetId, Token>()
  private lastProcessed = new UnixTime(0)

  constructor(
    private priceRepository: PriceRepository,
    private balanceRepository: BalanceRepository,
    private reportRepository: ReportRepository,
    private tokens: Token[],
    private logger: Logger,
  ) {
    this.logger = this.logger.for(this)
    for (const token of this.tokens) {
      this.tokenByAssetId.set(token.id, token)
    }
  }

  async update(dataPoints: { timestamp: UnixTime; blockNumber: bigint }[]) {
    dataPoints = dataPoints.filter((x) => x.timestamp.gt(this.lastProcessed))
    this.logger.info('Update started', { dataPoints: dataPoints.length })
    for (const { timestamp, blockNumber } of dataPoints) {
      const [prices, balances] = await Promise.all([
        this.priceRepository.getByTimestamp(timestamp),
        this.balanceRepository.getByBlock(blockNumber),
      ])
      const reports = this.createReports(prices, balances)
      await this.reportRepository.addOrUpdateMany(reports)
      this.lastProcessed = timestamp
      this.logger.info('Report updated', { timestamp: timestamp.toNumber() })
    }
    this.logger.info('Update completed', { dataPoints: dataPoints.length })
  }

  createReports(
    prices: PriceRecord[],
    balances: BalanceRecord[],
  ): ReportRecord[] {
    const priceMap = new Map(prices.map((p) => [p.assetId, p]))
    const ethPrice = priceMap.get(AssetId.ETH)?.priceUsd

    if (!ethPrice) {
      return []
    }

    const reports: ReportRecord[] = []
    for (const balance of balances) {
      const token = this.tokenByAssetId.get(balance.assetId)
      if (!token) {
        continue
      }
      const price = priceMap.get(token.id)
      if (!price) {
        continue
      }
      reports.push(createReport(price, token.decimals, balance, ethPrice))
    }
    return reports
  }
}

const ETH_PRECISION = 6n
const USD_PRECISION = 2n

export function createReport(
  price: PriceRecord,
  decimals: number,
  balance: BalanceRecord,
  ethPrice: number,
): ReportRecord {
  const { balanceUsd, balanceEth } = convertBalance(
    price.priceUsd,
    decimals,
    balance.balance,
    ethPrice,
  )
  return {
    blockNumber: balance.blockNumber,
    timestamp: price.timestamp,
    bridge: balance.holderAddress,
    asset: balance.assetId,
    balance: balance.balance,
    balanceUsd,
    balanceEth,
  }
}

export function convertBalance(
  priceUsd: number,
  decimals: number,
  balance: bigint,
  ethPrice: number,
) {
  const bigintPrice = getBigIntPrice(priceUsd, decimals)
  const usdBalance = (balance * bigintPrice) / 10n ** 18n
  const balanceUsd = usdBalance / 10n ** (18n - USD_PRECISION)

  const etherBigInt = getBigIntPrice(ethPrice, 18)
  const etherBalance = (usdBalance * 10n ** 18n) / etherBigInt
  const balanceEth = etherBalance / 10n ** (18n - ETH_PRECISION)
  return { balanceUsd, balanceEth }
}

export function getBigIntPrice(price: number, decimals: number) {
  const integerPart = BigInt(Math.floor(price)) * 10n ** 8n
  const fractionPart = BigInt(Math.floor((price % 1) * 100_000_000))
  const fixedPrice = integerPart + fractionPart
  return fixedPrice * 10n ** (18n * 2n - 8n - BigInt(decimals))
}
