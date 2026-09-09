import { ProjectId, UnixTime } from '@l2beat/shared-pure'

import { DERIVATION, REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getOpStackDaTracking, opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('metal')

export const metal: ScalingProject = opStackL2({
  ecosystemInfo: {
    id: ProjectId('superchain'),
    isPartOfSuperchain: true,
  },
  addedAt: UnixTime(1711670400), // 2024-03-29T00:00:00Z
  discovery,
  daTracking: [getOpStackDaTracking(discovery, { sinceBlock: 19527368 })],
  associatedTokens: ['MTL'],
  additionalBadges: [BADGES.RaaS.Conduit],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Metal',
    warning:
      'The fault proof system is deployed but is not functional. The permissioned dispute game commits to a placeholder absolute prestate (0xdead…) set by OP Stack Upgrade 19, so no dispute can be resolved by execution. Security relies entirely on the permissioned proposer and challenger.',
    slug: 'metal',
    description:
      'Metal L2 is a general-purpose OP stack rollup by Metallicus focused on banking and compliance.',
    links: {
      websites: ['https://metall2.com/'],
      bridges: [
        'https://bridge.metall2.com/',
        'https://dollar.metalx.com/',
        'https://metalpay.com/',
      ],
      documentation: ['https://docs.metall2.com'],
      explorers: ['https://explorer.metall2.com'],
      repositories: ['https://github.com/MetalPay'],
      socialMedia: [
        'https://twitter.com/metalpaysme',
        'https://reddit.com/r/metalpay/',
        'https://facebook.com/metalpaysme',
        'https://t.me/metalpaysme',
        'https://linkedin.com/company/metallicus',
      ],
    },
  },
  hasSuperchainScUpgrades: true,
  chainConfig: {
    name: 'metal',
    chainId: 1750,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.metall2.com',
        callsPerMinute: 300,
      },
    ],
  },
  genesisTimestamp: UnixTime(1711567115),
  isNodeAvailable: true,
  stateDerivation: DERIVATION.OPSTACK('METAL'),
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://x.com/MarshallHayner/status/1773873542373028121',
      date: '2024-03-29T00:00:00Z',
      description: 'Metal Mainnet is now live.',
      type: 'general',
    },
  ],
})
