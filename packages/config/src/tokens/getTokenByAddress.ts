import generated from './generated.json'
import { GeneratedToken } from './types'

interface TokenInfo {
  symbol: string
  decimals: number
  coingeckoId: string
  address?: string
  chainId: number
}

const TOKEN_BY_ADDRESS = new Map<string, TokenInfo>()
const TOKENS_BY_SYMBOL = new Map<string, TokenInfo[]>()

for (const raw of generated.tokens) {
  const parsed = GeneratedToken.parse(raw)
  const token: TokenInfo = {
    symbol: parsed.symbol,
    decimals: parsed.decimals,
    coingeckoId: parsed.coingeckoId.toString(),
    address: parsed.address?.toString(),
    chainId: Number(parsed.chainId),
  }

  if (token.address) {
    TOKEN_BY_ADDRESS.set(token.address.toLowerCase(), token)
  }

  const existing = TOKENS_BY_SYMBOL.get(token.symbol) ?? []
  existing.push(token)
  TOKENS_BY_SYMBOL.set(token.symbol, existing)
}

const ETH_SENTINEL = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

export function getTokenByAddress(
  address: string,
  chainId = 1,
): TokenInfo | undefined {
  if (address.toLowerCase() === ETH_SENTINEL) {
    return { symbol: 'ETH', decimals: 18, coingeckoId: 'ethereum', chainId }
  }
  const token = TOKEN_BY_ADDRESS.get(address.toLowerCase())
  if (!token || token.chainId !== chainId) return undefined
  return token
}

export function getTokenBySymbol(
  symbol: string,
  chainId = 1,
): TokenInfo | undefined {
  const tokens = TOKENS_BY_SYMBOL.get(symbol)
  if (!tokens) return undefined
  return tokens.find((t) => t.chainId === chainId)
}
