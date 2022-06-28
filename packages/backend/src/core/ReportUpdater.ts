import {
  AssetId,
  EthereumAddress,
  Logger,
  ProjectId,
  UnixTime,
} from '@l2beat/common'

import { ProjectInfo, Token } from '../model'
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

interface BalancePerProject extends Pick<BalanceRecord, 'assetId' | 'balance'> {
  projectId: ProjectId
}

export class ReportUpdater {
  private projectDetailsById = new Map<
    ProjectId,
    { bridges: EthereumAddress[]; assetIds: AssetId[] }
  >()
  private tokenByAssetId = new Map<AssetId, Token>()
  private lastProcessed = new UnixTime(0)

  constructor(
    private priceRepository: PriceRepository,
    private balanceRepository: BalanceRepository,
    private reportRepository: ReportRepository,
    private projects: ProjectInfo[],
    private tokens: Token[],
    private logger: Logger,
  ) {
    this.logger = this.logger.for(this)
    for (const token of this.tokens) {
      this.tokenByAssetId.set(token.id, token)
    }

    for (const { projectId, bridges } of projects) {
      this.projectDetailsById.set(projectId, {
        bridges: bridges.map((b) => EthereumAddress.unsafe(b.address)),
        assetIds: [
          // Set used to deduplicate AssetIds
          ...new Set(bridges.flatMap((b) => b.tokens.map((t) => t.id))),
        ],
      })
    }
  }

  async update(timestamps: UnixTime[]) {
    timestamps = timestamps.filter((x) => x.gt(this.lastProcessed))
    this.logger.info('Update started', { timestamps: timestamps.length })
    for (const timestamp of timestamps) {
      const [prices, balances] = await Promise.all([
        this.priceRepository.getByTimestamp(timestamp),
        this.balanceRepository.getByTimestamp(timestamp),
      ])
      const reports = this.createReports(prices, balances)
      await this.reportRepository.addOrUpdateMany(reports)
      this.lastProcessed = timestamp
      this.logger.info('Report updated', { timestamp: timestamp.toString() })
    }
    this.logger.info('Update completed', { timestamps: timestamps.length })
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

    const balancesPerProject = this.aggregateBalancesPerProject(
      this.projects,
      balances,
    )

    const reports: ReportRecord[] = []
    for (const balance of balancesPerProject) {
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

  private aggregateBalancesPerProject(
    projects: ProjectInfo[],
    balances: BalanceRecord[],
  ): BalancePerProject[] {
    const balancesPerProject = []
    for (const { projectId } of projects) {
      const project = this.projectDetailsById.get(projectId)
      if (!project) {
        continue
      }
      const projectBalances = balances.filter((balance) =>
        project.bridges.some((bridge) => bridge === balance.holderAddress),
      )

      for (const assetId of project.assetIds) {
        const assetBalances = projectBalances.filter(
          (balance) => balance.assetId === assetId,
        )

        balancesPerProject.push({
          projectId: projectId,
          balance: assetBalances.reduce(
            (acc, { balance }) => acc + balance,
            0n,
          ),
          assetId: assetId,
        })
      }
    }
    return balancesPerProject
  }
}

const ETH_PRECISION = 6n
const USD_PRECISION = 2n

export function createReport(
  price: PriceRecord,
  decimals: number,
  balance: BalancePerProject,
  ethPrice: number,
): ReportRecord {
  const { balanceUsd, balanceEth } = convertBalance(
    price.priceUsd,
    decimals,
    balance.balance,
    ethPrice,
  )

  return {
    timestamp: price.timestamp,
    projectId: balance.projectId,
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
