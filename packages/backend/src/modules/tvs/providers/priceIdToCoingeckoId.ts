import { assert, type Token } from '@l2beat/shared-pure'

export function priceIdToCoingeckoId(priceId: string, legacyTokens: Token[]) {
  switch (priceId) {
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
    .filter((t) => t.name === priceId)
    .map((t) => t.coingeckoId)

  assert(coingeckoIds.length > 0, `${priceId}: No tokens with this name found`)

  const coingeckoId = coingeckoIds[0]
  assert(
    coingeckoIds.every((id) => id === coingeckoId),
    `${priceId}: CoingeckoIds mismatch ${coingeckoIds}`,
  )
  return coingeckoId
}
