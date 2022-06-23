import { UnixTime } from '@l2beat/common'

import { ProjectInfo } from '../../../model'
import { Token } from '../../../model/Token'
import { BalanceRepository } from '../../../peripherals/database/BalanceRepository'
import { PriceRepository } from '../../../peripherals/database/PriceRepository'
import { ReportRepository } from '../../../peripherals/database/ReportRepository'
import { asNumber } from '../report/asNumber'
import { fromTimestamp, Status } from './Status'
import { renderBalancesPage } from './view/BalancesPage'
import { renderPricesPage } from './view/PricesPage'
import { renderReportsPage } from './view/ReportsPage'

export class StatusController {
  private tokenDecimals: Map<AssetId, number>

  constructor(
    private priceRepository: PriceRepository,
    private balanceRepository: BalanceRepository,
    private reportsRepository: ReportRepository,
    private tokens: Token[],
    private projects: ProjectInfo[],
  ) {
    this.tokenDecimals = this.toTokenDecimals(projects)
  }

  async getPricesStatus(): Promise<string> {
    const latestByToken = await this.priceRepository.getLatestByToken()

    const prices = this.tokens
      .map((token) => {
        const latest = latestByToken.get(token.id)

        return {
          coingeckoId: token.coingeckoId,
          priceUsd: latest?.priceUsd,
          status: fromTimestamp(latest?.timestamp),
        }
      })
      .sort(this.isSyncedDesc)

    return renderPricesPage({ prices })
  }

  async getBalancesStatus(): Promise<string> {
    const holderLatest = await this.balanceRepository.getLatestPerHolder()
    const balances = this.projects.flatMap(({ bridges, name }) =>
      bridges.map(({ address, tokens }) => ({
        projectName: name,
        holderAddress: address,
        tokens:
          holderLatest.get(address)?.map((latest) => ({
            assetId: latest.assetId,
            balance: latest.balance.toString(),
            timestamp: unixTimeToString(latest.timestamp),
            syncStatus: getSyncStatus(latest.timestamp),
          })) ?? [],
      })),
    )
    return renderBalancesPage({ balances })
  }

  async getReportsStatus() {
    const projectLatest = await this.reportsRepository.getLatestPerProject()
    return this.projects.map(({ projectId }) => ({
      projectId,
      tokens:
        projectLatest.get(projectId)?.map((latest) => ({
          assetId: latest.asset,
          balance: latest.balance.toString(),
          usd: latest.balanceUsd.toString(),
          eth: latest.balanceEth.toString(),
          timestamp: unixTimeToString(latest.timestamp),
          syncStatus: getSyncStatus(latest.timestamp),
        })) ?? [],
    }))
  }
}

function isSynced(timestamp: UnixTime | undefined) {
  const now = UnixTime.now().add(-1, 'hours').toStartOf('hour')
  return !!timestamp && now.equals(timestamp)
}

const unixTimeToString = (date: UnixTime) => {
  return date.toDate().toString().slice(4, 21)
}

const SECONDS_PER_HOUR = 60 * 60
const getSyncStatus = (
  date: UnixTime,
): {
  isSynced: boolean
  message: string
} => {
  const now = UnixTime.now().add(-1, 'hours').toStartOf('hour')

  const diff = now.toNumber() - date.toNumber()

  if (diff === 0) {
    return { isSynced: true, message: '✔' }
  }

  private toTokenDecimals(projects: ProjectInfo[]) {
    const tokenDecimals = new Map<AssetId, number>()
    for (const project of projects) {
      for (const bridge of project.bridges) {
        for (const token of bridge.tokens) {
          tokenDecimals.set(token.id, token.decimals)
        }
      }
    }
    return tokenDecimals
  }

  private getDecimals(assetId: AssetId): number {
    return this.tokenDecimals.get(assetId) ?? 0
  }

  private getBalance(
    balance: bigint | undefined,
    assetId: AssetId | undefined,
  ) {
    if (balance === undefined || assetId === undefined) {
      return undefined
    }
    return asNumber(balance, this.getDecimals(assetId))
  }
}
