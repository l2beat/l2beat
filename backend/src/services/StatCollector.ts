import { TokenInfo } from '@l2beat/config'

import { ProjectInfo, SimpleDate } from '../model'
import { BalanceChecker } from './balances'
import { TVLAnalysis } from './balances/model'
import { ExchangeAddresses } from './ExchangeAddresses'
import { FlowChecker, Flows } from './FlowChecker'
import { ProjectDates } from './ProjectDates'

export interface Stats {
  tvlEntries: TVLAnalysis[]
  flows: Flows
}

export class StatCollector {
  constructor(
    private exchangeAddresses: ExchangeAddresses,
    private projectDates: ProjectDates,
    private balanceChecker: BalanceChecker,
    private flowChecker: FlowChecker
  ) {}

  async collectStats(
    projects: ProjectInfo[],
    tokens: TokenInfo[],
    endDate: SimpleDate
  ): Promise<Stats> {
    const exchanges = await this.exchangeAddresses.getExchanges(tokens)
    const dates = await this.projectDates.getDateRanges(projects, endDate)
    const tvlEntries = await Promise.all(
      dates.map(async (date) =>
        this.balanceChecker.getStatsForDate(projects, exchanges, date)
      )
    )
    const flows = await this.flowChecker.getFlows(projects, tvlEntries)
    return { tvlEntries, flows }
  }
}
