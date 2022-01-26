import { BigNumber } from 'ethers'

export interface FetchedPrices {
  // address -> price
  token: Record<string, BigNumber | undefined>
  eth: BigNumber
}
