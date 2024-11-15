import { AssetEntry, ConnectedEntry, TokenEntry, tokens } from '../schema'
import { Balance } from './Balance'

const countSeverities = (
  token: AssetEntry,
  low: number = 0,
  medium: number = 0,
  high: number = 0,
) => {
  switch (token.tokenSeverity) {
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
    ? tokens.find((t) => t.address === token.child?.address)
    : undefined
  if (child?.child) return countSeverities(child, low, medium, high)

  return { low, medium, high }
}

const createChildren = (childEntry: AssetEntry): ConnectedEntry => {
  const child = tokens.find(
    (token) => token.address === childEntry.child?.address,
  )

  return {
    ...childEntry,
    child:
      childEntry.child && child
        ? { ...childEntry.child, entry: createChildren(child) }
        : undefined,
  }
}

export function toTokenEntry(tokenBalance: Balance): TokenEntry | undefined {
  const address = `${tokenBalance.chain}:${tokenBalance.address}`
  const token = tokens.find((token) => token.address === address)
  if (!token) return

  const balanceUnits = Number(tokenBalance.balance) / 10 ** token.decimals
  const balanceUsd = balanceUnits * token.priceUsd

  const childEntry = token.child
    ? tokens.find((t) => t.address === token.child?.address)
    : undefined

  const { low, medium, high } = countSeverities(token)

  return {
    ...token,
    address,
    balanceUnits,
    balanceUsd,
    severity: { low, medium, high },
    child:
      token.child && childEntry
        ? { ...token.child, entry: createChildren(childEntry) }
        : undefined,
  }
}
