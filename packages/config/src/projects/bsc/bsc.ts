import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

const chainId = 56

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
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description: 'EVM-compatible Layer 1.',
    links: {},
    badges: [],
  },
  chainConfig: {
    name: 'bsc',
    chainId,
    explorerUrl: 'https://bscscan.com',
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 15921452,
        version: '3',
      },
    ],
    apis: [{ type: 'etherscan', chainId }],
  },
}
