import { asNumber } from './asNumber'
import { TokenStats } from './getTokenStats'

export function getTokenTVL(stats: TokenStats[]) {
  return Object.fromEntries(
    stats.map(({ token, balance, value }) => [
      token.symbol,
      {
        balance: asNumber(balance, token.decimals, 6),
        usd: asNumber(value, 18, 2),
      },
    ])
  )
}
