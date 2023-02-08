import { getTimestamps, Hash256, UnixTime } from '@l2beat/shared'

import { getBalanceConfigHash } from '../../../core/balances/getBalanceConfigHash'
import { Clock } from '../../../core/Clock'
import { getReportConfigHash } from '../../../core/reports/getReportConfigHash'
import { Project } from '../../../model'
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
    private readonly priceRepository: PriceRepository,
    private readonly balanceStatusRepository: BalanceStatusRepository,
    private readonly reportStatusRepository: ReportStatusRepository,
    private readonly clock: Clock,
    private readonly tokens: Token[],
    private readonly projects: Project[],
  ) {}

  async getPricesStatus(
    from: UnixTime | undefined,
    to: UnixTime | undefined,
  ): Promise<string> {
    const firstHour = this.getFirstHour(from)
    const lastHour = to ? to : this.clock.getLastHour()

    const pricesByToken = await this.priceRepository.findLatestByTokenBetween(
      firstHour,
      lastHour,
    )

    const prices = this.tokens.map((token) => {
      const latest = pricesByToken.get(token.id)

      return {
        assetId: token.id,
        timestamp: latest,
        isSynced: latest?.toString() === lastHour.toString(),
      }
    })

    return renderPricesPage({ prices })
  }

  async getBalancesStatus(
    from: UnixTime | undefined,
    to: UnixTime | undefined,
  ): Promise<string> {
    const firstHour = this.getFirstHour(from)
    const lastHour = to ? to : this.clock.getLastHour()

    const timestamps = getTimestamps(firstHour, lastHour, 'hourly').reverse()

    const statuses = await this.balanceStatusRepository.getBetween(
      firstHour,
      lastHour,
    )
    const configHash = getBalanceConfigHash(this.projects)

    const balances = timestamps.map((timestamp) => ({
      timestamp,
      isSynced: isSynced(statuses, timestamp, configHash),
    }))

    return renderBalancesPage({ balances })
  }

  async getReportsStatus(from: UnixTime | undefined, to: UnixTime | undefined) {
    const firstHour = this.getFirstHour(from)
    const lastHour = to ? to : this.clock.getLastHour()

    const timestamps = getTimestamps(firstHour, lastHour, 'hourly').reverse()

    const statuses = await this.reportStatusRepository.getBetween(
      firstHour,
      lastHour,
    )
    const configHash = getReportConfigHash(this.projects)

    const reports = timestamps.map((timestamp) => ({
      timestamp,
      isSynced: isSynced(statuses, timestamp, configHash),
    }))

    return renderReportsPage({ reports })
  }

  private getFirstHour(from: UnixTime | undefined) {
    if (from) {
      return from
    } else {
      const firstHour = this.clock.getFirstHour()
      const lastHour = this.clock.getLastHour()
      if (firstHour.gt(lastHour.add(-90, 'days'))) {
        return firstHour
      } else {
        return lastHour.add(-90, 'days')
      }
    }
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
