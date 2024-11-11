import { useMemo } from 'react'
import { AssetEntry, TokenEntry, tokens } from '../schema'

interface Balance {
  chain: string
  address: string
  balance: number
}

const chainToPrefix: Record<string, string> = {
  arbitrum: 'arb1',
  optimism: 'oeth',
  ethereum: 'eth',
  base: 'base',
}

const countSeverities = (
  token: AssetEntry,
  low: number = 0,
  medium: number = 0,
  high: number = 0,
) => {
  if (token.child) {
    switch (token.child.bridgeSeverity) {
      case 'low':
        low++
        break
      case 'medium':
        medium++
        break
      case 'high':
        high++
        break
    }
  }
  const child = token.child
    ? tokens.find((token) => token.address === token.child?.address)
    : undefined
  if (child?.child) return countSeverities(child, low, medium, high)

  return { low, medium, high }
}

export function useTokens(tokenBalances: Balance[]): TokenEntry[] {
  const tokensToDisplay = useMemo(() => {
    return tokenBalances.map((tokenBalance) => {
      const address = `${chainToPrefix[tokenBalance.chain]}:${tokenBalance.address}`
      const token = tokens.find((token) => token.address === address)
      if (!token) return

      const balanceUnits = tokenBalance.balance / 10 ** token.decimals
      const balanceUsd = balanceUnits * token.priceUsd

      const childEntry = token.child
        ? tokens.find((token) => token.address === token.child?.address)
        : undefined

      const { low, medium, high } = countSeverities(token)

      return {
        ...token,
        address,
        balanceUnits,
        balanceUsd,
        severity: { low, medium, high },
        child:
          childEntry && token.child
            ? {
                ...token.child,
                entry: childEntry,
              }
            : undefined,
      }
    })
  }, [tokenBalances])

  return tokensToDisplay.filter(notUndefined)
}

function notUndefined<T>(value: T | undefined): value is T {
  return value !== undefined
}
