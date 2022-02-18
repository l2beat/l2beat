import { BigNumber } from 'ethers'

export interface PriceSnapshot {
  // address -> price
  token: Record<string, BigNumber | undefined>
  eth: BigNumber
}
