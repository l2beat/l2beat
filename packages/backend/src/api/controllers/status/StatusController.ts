import { getTimestamps, Hash256, UnixTime } from '@l2beat/common'

import { Clock } from '../../../core/Clock'
import { getConfigHash } from '../../../core/getConfigHash'
import { ProjectInfo } from '../../../model'
import { Token } from '../../../model/Token'
import {
  BalanceStatusRecord,
  BalanceStatusRepository,
} from '../../../peripherals/database/BalanceStatusRepository'
import { PriceRepository } from '../../../peripherals/database/PriceRepository'
import { ReportRepository } from '../../../peripherals/database/ReportRepository'
import { renderBalancesPage } from './view/BalancesPage'
import { renderPricesPage } from './view/PricesPage'

export class StatusController {
  constructor(
    private priceRepository: PriceRepository,
    private balanceStatusRepository: BalanceStatusRepository,
    private reportsRepository: ReportRepository,
    private tokens: Token[],
    private projects: ProjectInfo[],
    private clock: Clock
  ) {}
  //TODO
  // pagination on prices
  // remove unused code from repositories
  // add test to BalanceStatusRepository
  // rewrite reports
  // remove unused code
  // fix formatting
  

  async getPricesStatus(): Promise<string> {
    const current = this.clock.getLastHour()

    const latestByToken = await this.priceRepository.getLatestByToken()

    const prices = this.tokens
      .map((token) => {
        const latest = latestByToken.get(token.id)

        return {
          assetId: token.id,
          priceUsd: latest?.priceUsd,
          timestamp: latest?.timestamp,
          isSynced: latest?.timestamp.toString() === current.toString(),
        }
      })
      .sort(notSyncedFirst)

    return renderPricesPage({ prices })
  }

  async getBalancesStatus(from: UnixTime, to: UnixTime): Promise<string> {
    const timestamps = getTimestamps(from, to, 'hourly').reverse()
    const statuses = await this.balanceStatusRepository.getFromTo(from, to)
    const configHash = getConfigHash(this.projects)

    const balances = timestamps
      .map((timestamp) => ({
        timestamp,
        isSynced: isSynced(statuses, timestamp, configHash),
      }))
      .sort(notSyncedFirst)

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
          status: getSyncStatus(latest.timestamp),
        })) ?? [],
    }))
  }
}

function isSynced(
  statuses: BalanceStatusRecord[],
  timestamp: UnixTime,
  configHash: Hash256,
): boolean {
  return (
    statuses.find((s) => s.timestamp.toString() === timestamp.toString())
      ?.configHash === configHash
  )
}

function notSyncedFirst(a: { isSynced: boolean }, b: { isSynced: boolean }) {
  return +a.isSynced - +b.isSynced
}
