import { EthereumAddress } from '@l2beat/shared-pure'

import { ChainConfig } from '../common/ChainConfig'

export const bsc: ChainConfig = {
  devId: 'bsc',
  chainId: 56,
  explorerUrl: 'https://bscscan.com',
  explorerApi: {
    url: 'https://api.bscscan.com/api',
    type: 'etherscan',
  },
  multicallContracts: [
    {
      address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
      batchSize: 150,
      sinceBlock: 15921452,
      version: '3',
    },
  ],
}
