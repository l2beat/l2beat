import uniqBy from 'lodash/uniqBy'
import type { TvsToken } from '../types'
import { getAmountFormulas } from './tvsFormulas'

export type Address = {
  address: string
  chain: string
}

/** Token contract addresses referenced by the token's amount formula. */
export function extractAddressesFromTokenConfig(token: TvsToken): Address[] {
  const addresses = getAmountFormulas(token.amount).flatMap((amount) =>
    amount.type === 'const' || amount.address === 'native'
      ? []
      : [{ address: amount.address, chain: amount.chain }],
  )
  return uniqBy(addresses, 'address')
}
