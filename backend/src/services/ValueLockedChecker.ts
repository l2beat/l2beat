import { BlockInfo } from './BlockInfo'
import { SimpleDate } from './SimpleDate'
import { TokenBalanceChecker } from './TokenBalanceChecker'

export class ValueLockedChecker {
  constructor(
    private blockInfo: BlockInfo,
    private tokenBalanceChecker: TokenBalanceChecker
  ) {}

  async getTVL(account: string, sinceBlock: number, tokens: string[]) {
    const startDate = await this.blockInfo.getBlockDate(sinceBlock)
    const dates = dateRange(startDate, SimpleDate.today())
    const promises = tokens.map(async (token) => {
      const balances = await this.tokenBalanceChecker.getBalances(
        account,
        token,
        dates
      )
      return { [token]: balances }
    })
    const results = await Promise.all(promises)
    return results.reduce((all, x) => ({ ...all, ...x }), {})
  }
}

function dateRange(start: SimpleDate, end: SimpleDate) {
  let current = start
  const result = []
  while (current.isBefore(end)) {
    result.push(current)
    current = current.addDays(1)
  }
  return result
}
