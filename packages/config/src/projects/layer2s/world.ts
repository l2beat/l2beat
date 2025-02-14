import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { DERIVATION, ESCROW, REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'

const discovery = new ProjectDiscovery('worldchain')
const genesisTimestamp = new UnixTime(1719335639)

export const world = opStackL2({
  addedAt: new UnixTime(1729586060), // 2024-10-22T08:34:20Z
  genesisTimestamp,
  discovery,
  additionalBadges: [Badge.RaaS.Alchemy],
  additionalPurposes: ['Identity'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'World Chain',
    slug: 'world',
    description:
      'World Chain is an OP Stack Rollup built to scale Proof of Personhood, aiming to offer priority blockspace for users with a World ID.',
    links: {
      websites: ['https://worldcoin.org/world-chain'],
      apps: [
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
  rpcUrl: 'https://worldchain-mainnet.g.alchemy.com/public',
  finality: {
    type: 'OPStack',
    minTimestamp: genesisTimestamp,
    genesisTimestamp: genesisTimestamp,
    l2BlockTimeSeconds: 2,
    lag: 0,
    stateUpdate: 'disabled',
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
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0x153A69e4bb6fEDBbAaF463CB982416316c84B2dB'),
      name: 'External USDC Vault',
      ...ESCROW.CANONICAL_EXTERNAL,
      description: 'Custom external escrow for USDC bridged to Worldchain.',
      tokens: ['USDC'],
    }),
  ],
})
