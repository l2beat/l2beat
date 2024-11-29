import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { Badge } from '../badges'
import { orbitStackL2 } from './templates/orbitStack'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('alienx')

export const alienx: Layer2 = orbitStackL2({
  createdAt: new UnixTime(1719847684), // 2024-07-01T15:28:04Z
  additionalPurposes: ['Gaming', 'AI', 'NFT'],
  badges: [Badge.RaaS.Caldera, Badge.DA.DAC],
  display: {
    name: 'AlienX',
    slug: 'alienx',
    description:
      'AlienX is an Orbit stack Optimium on Ethereum focused on Gaming, AI and NFTs.',
    links: {
      websites: ['https://alienxchain.io/'],
      apps: ['https://bridge.alienxchain.io/', 'https://alienswap.xyz/'],
      documentation: ['https://docs.alienxchain.io'],
      explorers: ['https://explorer.alienxchain.io'],
      repositories: [],
      socialMedia: [
        'https://x.com/ALIENXchain',
        'https://discord.gg/alienxchain',
        'https://medium.com/@ALIENXchain',
        'https://t.me/alienx_ainode',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D'),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
    }),
  ],
  rpcUrl: 'https://rpc.alienxchain.io/http',
  discovery,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  discoveryDrivenData: true,
  milestones: [
    {
      name: 'Mainnet launch',
      link: 'https://medium.com/@ALIENXchain/alienx-mainnet-launch-join-the-genesis-voyage-and-claim-your-passcard-for-aix-airdrop-9bdf6a2a0472',
      date: '2024-06-24T00:00:00Z',
      description: 'AlienX launches their public mainnet.',
      type: 'general',
    },
  ],
})
