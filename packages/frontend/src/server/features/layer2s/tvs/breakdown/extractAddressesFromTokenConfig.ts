import type { TvsToken } from '@l2beat/config'
import { getAmountFormulas } from '@l2beat/config/build/utils/tvsFormulas'
import uniqBy from 'lodash/uniqBy'

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
