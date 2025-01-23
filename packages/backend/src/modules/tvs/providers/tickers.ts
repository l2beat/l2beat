import { assert, type Token } from '@l2beat/shared-pure'

export function tickerToCoingeckoId(ticker: string, legacyTokens: Token[]) {
  switch (ticker) {
    case 'GAME-COIN':
      return 'gamestarter'
    case 'GAME-VIRTUALS':
      return 'game-by-virtuals'
    case 'METH-MANTLE-STAKED':
      return 'mantle-staked-ether'
    case 'METH-MANTA':
      return 'manta-meth'
    case 'MOONFLOW':
      return 'moonflow'
    case 'MOONS':
      return 'moon'
    case 'USDT':
      return 'tether'
    case 'USDC':
    case 'USDC.e':
      return 'usd-coin'
    case 'WETH':
      return 'weth'
    case 'SOL':
      return 'solana'
    case 'wBTC':
      return 'wrapped-bitcoin'
  }

  const coingeckoIds = legacyTokens
    .filter((t) => t.symbol === ticker)
    .map((t) => t.coingeckoId)

  assert(coingeckoIds.length > 0, `${ticker}: No tokens with this symbol found`)

  const coingeckoId = coingeckoIds[0]
  assert(
    coingeckoIds.every((id) => id === coingeckoId),
    `${ticker}: CoingeckoIds mismatch ${coingeckoIds}`,
  )
  return coingeckoId
}

export function tokenToTicker(token: Token) {
  switch (token.symbol) {
    case 'GAME': {
      switch (token.name) {
        case 'Game Coin':
          return 'GAME-COIN'
        case 'GAME by Virtuals':
          return 'GAME-VIRTUALS'
      }
      break
    }

    case 'mETH': {
      switch (token.address) {
        case '0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa':
        case '0xcDA86A272531e8640cD7F1a92c01839911B90bb0':
          return 'METH-MANTLE-STAKED'
        case '0x8CdF550C04Bc9B9F10938368349C9c8051A772b6':
        case '0xACCBC418a994a27a75644d8d591afC22FaBA594e':
          return 'METH-MANTA'
      }

      break
    }

    case 'MOON': {
      switch (token.name) {
        case 'Moonflow':
          return 'MOONFLOW'
        case 'Moons':
          return 'MOONS'
      }
      break
    }
  }

  return token.symbol
}
