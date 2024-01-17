import { EthereumAddress } from '@l2beat/shared-pure'

import { ChainConfig } from '../common/ChainConfig'

export const celo: ChainConfig = {
  devId: 'celo',
  chainId: 42220,
  explorerUrl: 'https://celoscan.io',
  multicallContracts: [
    {
      address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
      batchSize: 150,
      sinceBlock: 13112599,
      version: '3',
    },
  ],
}
