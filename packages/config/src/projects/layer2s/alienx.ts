import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { AnytrustDAC } from '../da-beat/templates/anytrust-template'
import { orbitStackL2 } from './templates/orbitStack'

const discovery = new ProjectDiscovery('alienx')

export const alienx: Layer2 = orbitStackL2({
  addedAt: new UnixTime(1719847684), // 2024-07-01T15:28:04Z
  additionalPurposes: ['Gaming', 'AI', 'NFT'],
  additionalBadges: [Badge.RaaS.Caldera, Badge.DA.DAC],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
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
      socialMedia: [
        'https://x.com/ALIENXchain',
        'https://discord.gg/alienxchain',
        'https://medium.com/@ALIENXchain',
        'https://t.me/alienx_ainode',
      ],
    },
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
  milestones: [
    {
      title: 'Mainnet launch',
      url: 'https://medium.com/@ALIENXchain/alienx-mainnet-launch-join-the-genesis-voyage-and-claim-your-passcard-for-aix-airdrop-9bdf6a2a0472',
      date: '2024-06-24T00:00:00Z',
      description: 'AlienX launches their public mainnet.',
      type: 'general',
    },
  ],
  customDa: AnytrustDAC({ discovery }),
})
