import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BaseProject } from '../../types'

export const hyperevm: BaseProject = {
  id: ProjectId('hyperevm'),
  slug: 'hyperevm',
  name: 'HyperEVM',
  shortName: undefined,
  addedAt: UnixTime(1773154357),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'The Hyperliquid blockchain features two key parts: HyperCore and HyperEVM. The HyperEVM is not a separate chain, but rather, secured by the same HyperBFT consensus as HyperCore. This lets the HyperEVM interact directly with parts of HyperCore, such as spot and perp order books.',
    links: {},
    badges: [],
  },
  chainConfig: {
    name: 'hyperevm',
    chainId: 999,
    explorerUrl: 'https://hyperevmscan.io',
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 13051,
        version: '3',
      },
    ],
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.hyperliquid.xyz/evm',
      },
    ],
  },
}
