import { SimpleDate } from '../services/SimpleDate'
import { TokenPriceChecker } from '../services/TokenPriceChecker'
import { ProjectTVL } from './getProjectTVLs'

export interface PriceFunction {
  (symbol: string, date: SimpleDate): number
}

export async function getTokenPrices(
  results: ProjectTVL[],
  tokenPriceChecker: TokenPriceChecker
): Promise<PriceFunction> {
  const promises: Promise<unknown>[] = []
  const prices = new Map<string, Map<string, number>>()
  for (const project of results) {
    for (const bridge of project.bridges) {
      for (const [symbol, entries] of Object.entries(bridge.balances)) {
        if (!prices.has(symbol)) {
          prices.set(symbol, new Map())
        }
        for (const entry of entries) {
          const promise = tokenPriceChecker
            .getPrice(symbol, entry.date)
            .then((x) => prices.get(symbol)?.set(entry.date.toString(), x.usd))
          promises.push(promise)
        }
      }
    }
  }
  await Promise.all(promises)
  return function getTokenPrice(symbol: string, date: SimpleDate) {
    const price = prices.get(symbol)?.get(date.toString())
    if (price === undefined) {
      throw new Error('Unknown symbol or date')
    }
    return price
  }
}
