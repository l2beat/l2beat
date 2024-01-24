import { EthereumAddress } from '@l2beat/shared-pure'

import { ChainConfig } from '../common/ChainConfig'

export const polygonpos: ChainConfig = {
  name: 'polygonpos',
  chainId: 137,
  explorerUrl: 'https://polygonscan.com',
  explorerApi: {
    url: 'https://api.polygonscan.com/api',
    type: 'etherscan',
  },
  multicallContracts: [
    {
      address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
      batchSize: 150,
      sinceBlock: 25770160,
      version: '3',
    },
  ],
}
