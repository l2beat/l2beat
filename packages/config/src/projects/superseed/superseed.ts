import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { DERIVATION, REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getOpStackDaTracking, opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('superseed')
const genesisTimestamp = UnixTime(1726179683)

export const superseed: ScalingProject = opStackL2({
  ecosystemInfo: {
    id: ProjectId('superchain'),
    isPartOfSuperchain: true,
  },
  capability: 'universal',
  addedAt: UnixTime(1743379200), // 2025-03-31T00:00:00Z
  additionalBadges: [BADGES.RaaS.Conduit],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  isPartOfSuperchain: true,
  display: {
    name: 'Superseed',
    warning:
      'The fault proof system is deployed but is not functional. The dispute game commits to an op-program release that predates the Jovian hardfork active on the chain, so it cannot derive current blocks and no dispute can be resolved correctly by execution. Security relies entirely on the permissioned proposer and challengers.',
    slug: 'superseed',
    headerWarning:
      'Superseed is being deprecated. See the [announcement](https://x.com/superseed/status/2079216129059283250) and make sure to bridge off your funds until August 15, 2026.',
    description:
      'Superseed is an Optimistic Rollup utilizing the OP Stack, aiming to provide a CDP lending platform enshrined in the protocol and redistribution of Layer 2 fees to its users.',
    stacks: ['OP Stack'],
    links: {
      websites: ['https://superseed.xyz/'],
      bridges: ['https://bridge.superseed.xyz/'],
      documentation: ['https://docs.superseed.xyz/'],
      explorers: ['https://explorer.superseed.xyz/'],
      repositories: ['https://github.com/superseed-xyz'],
      socialMedia: [
        'https://x.com/SuperseedXYZ',
        'https://discord.com/invite/vjDDB5S4BN',
        'https://mirror.xyz/superseedxyz.eth',
        'https://t.me/superseedtelegram',
      ],
    },
  },
  associatedTokens: ['SUPR'],
  isNodeAvailable: true,
  nodeSourceLink:
    'https://github.com/ethereum-optimism/optimism/tree/develop/op-node',
  stateDerivation: DERIVATION.OPSTACK('SUPERSEED'),
  chainConfig: {
    name: 'superseed',
    coingeckoPlatform: 'superseed',
    chainId: 5330,
    sinceTimestamp: genesisTimestamp,
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet.superseed.xyz/',
        callsPerMinute: 300,
      },
    ],
  },
  activityConfig: {
    type: 'block',
    adjustCount: { type: 'SubtractOne' },
    startBlock: 1,
  },
  discovery,
  daTracking: [getOpStackDaTracking(discovery, { sinceBlock: 20737483 })],
  genesisTimestamp,
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://x.com/SuperseedXYZ/status/1906710602506195433',
      date: '2025-03-31T00:00:00Z',
      description: 'Superseed Mainnet is now live.',
      type: 'general',
    },
  ],
})
