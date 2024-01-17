import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

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
  multicallContracts: [
    {
      address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
      batchSize: 150,
      sinceBlock: 14353601,
      version: 3,
    },
  ],
}
