import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const bsc: BaseProject = {
  id: ProjectId('bsc'),
  slug: 'bsc',
  name: 'Binance Smart Chain',
  shortName: 'BSC',
  addedAt: UnixTime.fromDate(new Date('2023-01-01')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    isUnderReview: false,
    isUnverified: false,
  },
  display: {
    description: 'EVM-compatible Layer 1.',
    links: {},
    badges: [],
  },
  chainConfig: {
    name: 'bsc',
    chainId: 56,
    explorerUrl: 'https://bscscan.com',
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 15921452,
        version: '3',
      },
    ],
    apis: [{ type: 'etherscan', url: 'https://api.bscscan.com/api' }],
  },
}
