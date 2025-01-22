import { assert, type Token } from '@l2beat/shared-pure'

export function tickerToCoingeckoId(ticker: string, legacyTokens: Token[]) {
  switch (ticker) {
    case 'Ether':
      return 'ethereum'
    case 'mETH':
      return 'manta-meth'
    case 'Tether USD':
      return 'tether'
    case 'USD Coin':
      return 'usd-coin'
    case 'Wrapped BTC':
      return 'wrapped-bitcoin'
    case 'Wrapped Ether':
      return 'weth'
    case 'Wrapped SOL':
      return 'solana'
    case 'TIA':
      return 'celestia'
    case 'USDC':
      return 'usd-coin'
  }

  const coingeckoIds = legacyTokens
    .filter((t) => t.name === ticker)
    .map((t) => t.coingeckoId)

  assert(coingeckoIds.length > 0, `${ticker}: No tokens with this name found`)

  const coingeckoId = coingeckoIds[0]
  assert(
    coingeckoIds.every((id) => id === coingeckoId),
    `${ticker}: CoingeckoIds mismatch ${coingeckoIds}`,
  )
  return coingeckoId
}
