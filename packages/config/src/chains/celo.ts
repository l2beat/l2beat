import { EthereumAddress } from '@l2beat/shared-pure'

import type { ChainConfig } from '../common/ChainConfig'

export const celo: ChainConfig = {
  name: 'celo',
  chainId: 42220,
  explorerUrl: 'https://celoscan.io',
  explorerApi: {
    url: 'https://api.celoscan.io/api',
    type: 'etherscan',
    missingFeatures: {
      getContractCreation: true,
    },
  },
  multicallContracts: [
    {
      address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
      batchSize: 150,
      sinceBlock: 13112599,
      version: '3',
    },
  ],
}
