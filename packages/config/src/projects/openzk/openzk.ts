import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const openzk: ScalingProject = underReviewL2({
  id: 'openzk',
  capability: 'universal',
  addedAt: UnixTime(1742310729), //18.03.2025 15:12:09
  badges: [
    BADGES.Infra.ElasticChain,
    BADGES.DA.EthereumBlobs,
    BADGES.Stack.ZKStack,
    BADGES.VM.EVM,
    BADGES.RaaS.Caldera,
  ],
  dataAvailability: undefined,
  display: {
    name: 'OpenZK',
    slug: 'openzk',
    description:
      'OpenZK is a ZK rollup that unites native ETH staking, liquid restaking, and stablecoin staking in one seamless platform.',
    purposes: ['Universal'],
    stacks: ['ZK Stack'],
    links: {
      websites: ['https://openzk.net/'],
      bridges: [
        'https://portal.openzk.net/bridge',
        'https://openzk-mainnet-bridge.vercel.app/bridge',
      ],
      documentation: ['https://docs.openzk.net/'],
      explorers: ['https://openzk.calderaexplorer.xyz/'],
      repositories: [],
      socialMedia: [
        'https://x.com/OpenZkNetwork',
        'https://linkedin.com/company/openzk',
        'https://t.me/OpenZkNetwork',
      ],
    },
  },
  proofSystem: {
    type: 'Validity',
  },
  ecosystemInfo: {
    id: ProjectId('the-elastic-network'),
  },
  chainConfig: {
    name: 'openzk',
    chainId: 1345,
    apis: [
      {
        type: 'rpc',
        url: 'https://openzk.calderachain.xyz/http',
        callsPerMinute: 300,
      },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
  },
})
