import { TokenInfo } from '@l2beat/config'
import { ProjectInfo, SimpleDate } from '../model'
import { BalanceAnalyzer } from './balances'
import { ExchangeAddresses } from './ExchangeAddresses'
import { ProjectDates } from './ProjectDates'

export class BalanceCollector {
  constructor(
    private exchangeAddresses: ExchangeAddresses,
    private projectDates: ProjectDates,
    private balanceAnalyzer: BalanceAnalyzer
  ) {}

  async collectBalanceInfo(
    projects: ProjectInfo[],
    tokens: TokenInfo[],
    endDate: SimpleDate
  ) {
    const exchanges = await this.exchangeAddresses.getExchanges(tokens)
    const dates = await this.projectDates.getDateRanges(projects, endDate)
    return Promise.all(
      dates.map(async (date) => {
        return {
          date,
          balances: await this.balanceAnalyzer.getTVLByDate(
            projects,
            exchanges,
            date
          ),
        }
      })
    )
  }
}
