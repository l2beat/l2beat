import { UnixTime } from '@l2beat/shared-pure'

import { DERIVATION, REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('metal')

export const metal: ScalingProject = opStackL2({
  addedAt: UnixTime(1711670400), // 2024-03-29T00:00:00Z
  discovery,
  associatedTokens: ['MTL'],
  additionalBadges: [BADGES.RaaS.Conduit],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'Metal',
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
        callsPerMinute: 1500,
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
