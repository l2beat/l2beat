import { UnixTime } from '../types'

export const minTimestamps = {
  // Deployment of the first L2
  ethereum: UnixTime.fromDate(new Date('2019-11-14T00:00:00Z')),
  // ~ Timestamp of block number 0 on Arbitrum
  arbitrum: UnixTime.fromDate(new Date('2021-05-28T22:15:00Z')),
}
