import { ProjectId } from '@l2beat/shared'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const zkex: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('zkex'),
  display: {
    name: 'ZKEX',
    slug: 'zkex',
    description:
      'ZKEX: Multi-chain order book DEX, secured with zero-knowledge proofs.',
    purpose: 'Exchange',
    links: {
      websites: ['https://zkex.com/'],
      apps: ['https://testnet.app.zkex.com/'],
      documentation: ['https://docs.zkex.com/'],
      explorers: ['https://scan.zk.link'],
      repositories: [
        'https://github.com/zkLinkProtocol/zklink-contracts',
        'https://github.com/ZKEX',
      ],
      socialMedia: [
        'https://link3.to/zkex',
        'https://twitter.com/ZKEX_Official',
        'https://t.me/ZKEX_Official',
        'https://discord.com/invite/ctDAYrrNTH',
        'https://zkex.medium.com/',
        'https://zkex.substack.com/',
      ],
    },
  },
  config: {
    escrows: [],
  },
  riskView: UPCOMING_RISK_VIEW,
  technology: {
    ...TECHNOLOGY.UPCOMING,
    provider: 'zkLink',
    category: 'ZK Rollup',
  },
  contracts: CONTRACTS.EMPTY,
}
