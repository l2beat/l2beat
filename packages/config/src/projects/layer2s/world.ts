import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { Layer2 } from './types'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { opStackL2 } from './templates/opStack'
import { Badge } from '../badges'

const discovery = new ProjectDiscovery('worldchain')

export const world: Layer2 = opStackL2({
  badges: [Badge.RaaS.Alchemy], // not superchain
  display: {
    redWarning: 'Critical contracts can be upgraded by an EOA which could result in the loss of all funds.',
    name: 'World Chain',
    slug: 'world',
    description: "World Chain is an OP Stack Rollup used to scale World ID's Proof of Personhood.",
    purposes: ['Identity', 'Universal'],
    links: {
      websites: ['https://worldcoin.org/world-chain'],
      apps: ['https://worldchain-mainnet.bridge.alchemy.com/','https://worldcoin.org/download-app'],
      documentation: ['https://world-id-docs-git-world-chain-docs-main-worldcoin.vercel.app/world-chain/quick-start'], // non-prod
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
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0x153A69e4bb6fEDBbAaF463CB982416316c84B2dB'),
      name: 'External USDC Vault',
      description:
        'Custom external escrow for USDC bridged to Worldchain.',
      tokens: ['USDC'],
    }),
  ],
  discoveryDrivenData: true,
})
