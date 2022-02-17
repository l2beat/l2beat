import { SimpleDate } from '@l2beat/common'
import { TokenInfo } from '@l2beat/config'

import { ProjectInfo } from '../../model'
import { ArbitrumStatChecker, ArbitrumStats } from './ArbitrumStatChecker'
import { BalanceChecker } from './balances'
import { TVLAnalysis } from './balances/model'
import { FlowChecker, Flows } from './FlowChecker'
import { PriceService } from './prices'
import { ProjectDates } from './ProjectDates'

export interface Stats {
  tvlEntries: TVLAnalysis[]
  flows: Flows
  arbitrum: ArbitrumStats
}

export class StatCollector {
  constructor(
    private projectDates: ProjectDates,
    private balanceChecker: BalanceChecker,
    private priceService: PriceService,
    private flowChecker: FlowChecker,
    private arbitrumStatChecker: ArbitrumStatChecker
  ) {}

  async collectStats(
    projects: ProjectInfo[],
    tokenList: TokenInfo[],
    endDate: SimpleDate
  ): Promise<Stats> {
    const dates = await this.projectDates.getDateRanges(projects, endDate)
    const prices = await this.priceService.getPrices(tokenList, dates)

    const tvlEntries = await Promise.all(
      dates.map(async (date) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.balanceChecker.getStatsForDate(projects, prices.get(date)!, date)
      )
    )
    const flows = await this.flowChecker.getFlows(projects, tvlEntries)
    const arbitrum = await this.arbitrumStatChecker.getStats(
      tvlEntries[tvlEntries.length - 8].blockNumber + 1,
      tvlEntries[tvlEntries.length - 1].blockNumber
    )
    return { tvlEntries, flows, arbitrum }
  }
}
