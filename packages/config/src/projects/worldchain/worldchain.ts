import { UnixTime } from '@l2beat/shared-pure'
import { DERIVATION, REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('worldchain')
const genesisTimestamp = UnixTime(1719335639)

export const worldchain = opStackL2({
  addedAt: UnixTime(1729123200), // 2024-10-17T00:00:00Z
  genesisTimestamp,
  discovery,
  additionalBadges: [BADGES.RaaS.Alchemy],
  additionalPurposes: ['Identity'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'World Chain',
    slug: 'world',
    description:
      'World Chain is an OP Stack Rollup built to scale Proof of Personhood, aiming to offer priority blockspace for users with a World ID.',
    links: {
      websites: ['https://worldcoin.org/world-chain'],
      bridges: [
        'https://worldchain-mainnet.bridge.alchemy.com/',
        'https://worldcoin.org/download-app',
      ],
      documentation: ['https://docs.world.org/world-chain/'],
      explorers: [
        'https://worldscan.org',
        'https://worldchain-mainnet.explorer.alchemy.com/',
      ],
      repositories: ['https://github.com/worldcoin'],
      socialMedia: [
        'https://x.com/worldcoin',
        'https://discord.com/invite/worldcoin',
        'https://t.me/worldcoin',
        'https://linkedin.com/company/worldcoinproject/',
        'https://youtube.com/@worldcoinofficial',
      ],
    },
  },
  associatedTokens: ['WLD'],
  chainConfig: {
    name: 'worldchain',
    coingeckoPlatform: 'world-chain',
    sinceTimestamp: genesisTimestamp,
    chainId: 480,
    apis: [
      {
        type: 'rpc',
        url: 'https://worldchain-mainnet.g.alchemy.com/public',
        callsPerMinute: 1500,
      },
    ],
  },
  stateDerivation: DERIVATION.OPSTACK('WORLD'),
  isNodeAvailable: 'UnderReview',
  milestones: [
    {
      title: 'World Chain Launch',
      url: 'https://world.org/blog/announcements/world-chain-now-open-every-human', // TO UPDATE
      date: '2024-10-17T00:00:00Z',
      description: 'World Chain Mainnet is officially live.',
      type: 'general',
    },
  ],
  hasProperSecurityCouncil: false,
})
