import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('worldchain')

export const world: Layer2 = opStackL2({
  badges: [Badge.RaaS.Alchemy], // not superchain
  additionalPurposes: ['Identity'],
  display: {
    redWarning:
      'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
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
      documentation: [
        'https://world-id-docs-git-world-chain-docs-main-worldcoin.vercel.app/world-chain/quick-start',
      ], // non-prod
      explorers: ['https://worldchain-mainnet.explorer.alchemy.com/'],
      repositories: ['https://github.com/worldcoin'],
      socialMedia: [
        'https://x.com/worldcoin',
        'https://discord.com/invite/worldcoin',
        'https://t.me/worldcoin',
        'https://linkedin.com/company/worldcoinproject/',
        'https://youtube.com/@worldcoinofficial',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  discovery,
  genesisTimestamp: new UnixTime(1719432935), // OptiPortal deployed
  usesBlobs: true,
  rpcUrl: 'https://worldchain-mainnet.g.alchemy.com/public',
  isNodeAvailable: 'UnderReview',
  associatedTokens: ['WLD'],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0x153A69e4bb6fEDBbAaF463CB982416316c84B2dB'),
      name: 'External USDC Vault',
      description: 'Custom external escrow for USDC bridged to Worldchain.',
      tokens: ['USDC'],
    }),
  ],
  discoveryDrivenData: true,
  milestones: [
    {
      name: 'World Chain Launch',
      link: 'https://worldcoin.org/blog/announcements/introducing-world-chain', // TO UPDATE
      date: '2024-10-17T00:00:00Z', // TO UPDATE
      description: 'World Chain Mainnet is officially live.',
      type: 'general',
    },
  ],
})
