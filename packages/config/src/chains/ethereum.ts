import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import type { ChainConfig } from '../types'

export const ethereum: ChainConfig = {
  name: 'ethereum',
  chainId: 1,
  explorerUrl: 'https://etherscan.io',
  explorerApi: {
    url: 'https://api.etherscan.io/api',
    type: 'etherscan',
  },
  blockscoutV2ApiUrl: 'https://eth.blockscout.com/api/v2',
  // Deployment of the first L2
  minTimestampForTvl: UnixTime.fromDate(new Date('2019-11-14T00:00:00Z')),
  multicallContracts: [
    {
      address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
      batchSize: 150,
      sinceBlock: 14353601,
      version: '3',
    },
    {
      sinceBlock: 12336033,
      batchSize: 150,
      address: EthereumAddress('0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696'),
      version: '2',
    },
    {
      sinceBlock: 7929876,
      batchSize: 150,
      address: EthereumAddress('0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441'),
      version: '1',
    },
  ],
  coingeckoPlatform: 'ethereum',
}
