import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const gnosis: BaseProject = {
  id: ProjectId('gnosis'),
  slug: 'gnosis',
  name: 'Gnosis Chain',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2023-01-01')),
  chainConfig: {
    name: 'gnosis',
    chainId: 100,
    explorerUrl: 'https://gnosisscan.io',
    explorerApi: {
      url: 'https://api.gnosisscan.io/api',
      type: 'etherscan',
      missingFeatures: {
        getContractCreation: true,
      },
    },
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 21022491,
        version: '3',
      },
    ],
  },
}
