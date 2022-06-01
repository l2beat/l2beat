import { SimpleDate } from '@l2beat/common'
import { TokenInfo } from '@l2beat/config'
import { BigNumber } from 'ethers'

import { ProjectInfo } from '../../model'
import { TEN_TO_18 } from '../constants'
import { ArbitrumStatChecker, ArbitrumStats } from './ArbitrumStatChecker'
import { BalanceChecker } from './balances'
import { TVLAnalysis } from './balances/model'
import { FlowChecker, Flows } from './FlowChecker'
import { PriceService } from './prices'
import { PriceSnapshot } from './prices/model'
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
    const priceDates = dates.map((x) => x.addDays(1))

    const prices = await this.priceService.getPrices(tokenList, priceDates)

    const tvlEntries: TVLAnalysis[] = []
    for (const [i, date] of dates.entries()) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const fetchedPrices = prices.get(priceDates[i])!
      const entry = await this.balanceChecker.getStatsForDate(
        projects,
        fetchedPrices,
        date
      )
      const wrapped = wrapEntryWithOptimism(date, fetchedPrices, entry)
      tvlEntries.push(wrapped)
    }

    const flows = await this.flowChecker.getFlows(projects, tvlEntries)
    const arbitrum = await this.arbitrumStatChecker.getStats(
      tvlEntries[tvlEntries.length - 8].blockNumber + 1,
      tvlEntries[tvlEntries.length - 1].blockNumber
    )

    return { tvlEntries, flows, arbitrum }
  }
}

function wrapEntryWithOptimism(
  date: SimpleDate,
  fetchedPrices: PriceSnapshot,
  entry: TVLAnalysis
) {
  if (date.isAfter(SimpleDate.fromString('2022-05-30'))) {
    const opPrice =
      fetchedPrices.token[
        '0x4200000000000000000000000000000000000042'
      ]

    if (opPrice) {
      const opBalance = BigNumber.from(214748364).mul(TEN_TO_18)
      const opUsd = opBalance.mul(opPrice)
      const opEth = opUsd.div(fetchedPrices.eth)



      entry.projects['Optimism'].tokens['OP'] = {
        balance: 214748364,
        usd: opUsd,
      }
      entry.projects['Optimism'].TVL = {
        usd: entry.projects['Optimism'].TVL.usd + opUsd,
        eth: entry.projects['Optimism'].TVL.eth + opUsd / fetchedPrices.eth.toNumber() ,
      }
      entry.TVL = {
        usd: entry.TVL.usd + opUsd,
        eth: entry.TVL.eth,
      }
    }
  }
  return entry
}
