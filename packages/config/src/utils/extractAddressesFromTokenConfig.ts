import uniqBy from 'lodash/uniqBy'
import type { TvsToken, TvsTokenAddress } from '../types'
import { getAmountFormulas } from './tvsFormulas'

export type Address = TvsTokenAddress

/** Token contract addresses referenced by the token's amount formula. */
export function extractAddressesFromTokenConfig(token: TvsToken): Address[] {
  const addresses = getAmountFormulas(token.amount).flatMap((amount) =>
    amount.type === 'const' || amount.address === 'native'
      ? []
      : [{ address: amount.address, chain: amount.chain }],
  )
  return uniqBy(addresses, (a) => `${a.chain}:${a.address}`)
}

/** `BaseProject.tvsTokenAddresses` for a project's TVS config. */
export function getTvsTokenAddresses(
  tokens: TvsToken[] | undefined,
): Record<string, Address[]> | undefined {
  if (!tokens) {
    return undefined
  }
  const result: Record<string, Address[]> = {}
  for (const token of tokens) {
    const addresses = extractAddressesFromTokenConfig(token)
    if (addresses.length > 0) {
      result[token.id] = addresses
    }
  }
  return result
}
