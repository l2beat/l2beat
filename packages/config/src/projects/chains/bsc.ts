import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const bsc: BaseProject = {
  id: ProjectId('bsc'),
  slug: 'bsc',
  name: 'Binance Smart Chain',
  shortName: 'BSC',
  addedAt: UnixTime.fromDate(new Date('2023-01-01')),
  chainConfig: {
    name: 'bsc',
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
  },
}
