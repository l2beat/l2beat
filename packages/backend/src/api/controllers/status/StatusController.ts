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
import { ReportStatusRepository } from '../../../peripherals/database/ReportStatusRepository'
import { renderBalancesPage } from './view/BalancesPage'
import { renderPricesPage } from './view/PricesPage'
import { renderReportsPage } from './view/ReportsPage'

export class StatusController {
  constructor(
    private priceRepository: PriceRepository,
    private balanceStatusRepository: BalanceStatusRepository,
    private reportStatusRepository: ReportStatusRepository,
    private tokens: Token[],
    private projects: ProjectInfo[],
    private clock: Clock,
  ) {}
  //TODO
  // rewrite reports
  // add tests to repositories
  // remove unused code from repositories
  // remove unused code
  // fix formatting
  // readme

  //TODO
  // check if there are prices for every timestamp <from,to>
  async getPricesStatus(from: UnixTime, to: UnixTime): Promise<string> {
    const lastHour = this.clock.getLastHour()
    const syncTimestamp = to.gte(lastHour) ? lastHour : to.toStartOf('hour')

    const pricesByToken = await this.priceRepository.getLatestByTokenFromTo(
      from,
      to,
    )

    const prices = this.tokens
      .map((token) => {
        const latest = pricesByToken.get(token.id)

        return {
          assetId: token.id,
          priceUsd: latest?.priceUsd,
          timestamp: latest?.timestamp,
          isSynced: latest?.timestamp.toString() === syncTimestamp.toString(),
        }
      })
      .sort(notSyncedFirst)

    return renderPricesPage({ prices })
  }

  async getBalancesStatus(from: UnixTime, to: UnixTime): Promise<string> {
    const lastHour = this.clock.getLastHour()
    const syncTimestamp = to.gte(lastHour) ? lastHour : to.toStartOf('hour')
    const timestamps = getTimestamps(from, syncTimestamp, 'hourly').reverse()

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

  async getReportsStatus(from: UnixTime, to: UnixTime) {
    const lastHour = this.clock.getLastHour()
    const syncTimestamp = to.gte(lastHour) ? lastHour : to.toStartOf('hour')
    const timestamps = getTimestamps(from, syncTimestamp, 'hourly').reverse()

    const statuses = await this.reportStatusRepository.getFromTo(from, to)
    const configHash = getConfigHash(this.projects)

    const reports = timestamps
      .map((timestamp) => ({
        timestamp,
        isSynced: isSynced(statuses, timestamp, configHash),
      }))
      .sort(notSyncedFirst)

    return renderReportsPage({ reports })
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
