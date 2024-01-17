import { UnixTime } from '@l2beat/shared-pure'

import { ChainConfig } from '../common/ChainConfig'

export const ethereum: ChainConfig = {
  devId: 'ethereum',
  chainId: 1,
  explorerUrl: 'https://etherscan.io',
  explorerApi: {
    url: 'https://api.etherscan.io/api',
    type: 'etherscan',
  },
  // Deployment of the first L2
  minTimestampForTvl: UnixTime.fromDate(new Date('2019-11-14T00:00:00Z')),
}
