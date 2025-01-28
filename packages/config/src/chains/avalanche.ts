import { EthereumAddress } from '@l2beat/shared-pure'

import type { ChainConfig } from '../types'

export const avalanche: ChainConfig = {
  name: 'avalanche',
  chainId: 43114,
  explorerUrl: 'https://snowtrace.io',
  multicallContracts: [
    {
      address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
      batchSize: 150,
      sinceBlock: 11907934,
      version: '3',
    },
  ],
}
