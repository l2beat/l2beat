import { EthereumAddress } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { underReview } from './templates/underReview'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('parallel')

export const parallel: Layer2 = underReview({
  id: 'parallel',
  display: {
    name: 'Parallel',
    slug: 'parallel',
    headerWarning: '',
    description:
      'Parallel will launch an Ethereum L2 solution utilizing Arbitrum Nitro technology. More information coming soon.',
    purpose: ['Universal', 'DeFi'],
    category: 'Optimistic Rollup',
    provider: 'Arbitrum',
    links: {
      websites: ['https://parallel.fi'],
      apps: ['https://parallel.fi/airdrop'],
      documentation: ['https://docs.parallel.fi/parallel-chain/overview'],
      explorers: [
        'https://explorerl2new-surprised-harlequin-bonobo-fvcy2k9oqh.t.conduit.xyz/',
      ],
      repositories: [],
      socialMedia: [
        'https://twitter.com/ParallelFi',
        'https://discord.gg/rdjVz8zavF',
        'https://t.me/parallelfi_community',
      ],
    },
  },
  escrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0x5a961c7D162195a9Dc5a357Cc168b0694283382E'),
      tokens: ['ETH'],
      description:
        'Contract managing Inboxes and Outboxes. It escrows ETH sent to L2.',
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d'),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0xa1c86E2362dba0525075622af6d5f739B1304D45'),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens that require minting custom token on L2.',
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d'),
      tokens: ['WETH'],
      description: 'Escrow for WETH sent to L2.',
    }),
  ],
})
