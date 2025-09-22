import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL2 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('alienx')

export const alienx: ScalingProject = orbitStackL2({
  addedAt: UnixTime(1719187200), // 2024-06-24T00:00:00Z
  additionalPurposes: ['Gaming', 'AI', 'NFT'],
  additionalBadges: [BADGES.RaaS.Caldera],
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
      bridges: ['https://bridge.alienxchain.io/', 'https://alienswap.xyz/'],
      documentation: ['https://docs.alienxchain.io'],
      explorers: ['https://explorer.alienxchain.io'],
      socialMedia: [
        'https://x.com/ALIENXchain',
        'https://discord.com/invite/645GqaWfKZ',
        'https://medium.com/@ALIENXchain',
        'https://t.me/alienx_ainode',
      ],
    },
  },
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D',
      ),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
    }),
  ],
  chainConfig: {
    name: 'alienx',
    chainId: 10241024,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.alienxchain.io/http',
        callsPerMinute: 300,
      },
    ],
  },
  discovery,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://medium.com/@ALIENXchain/alienx-mainnet-launch-join-the-genesis-voyage-and-claim-your-passcard-for-aix-airdrop-9bdf6a2a0472',
      date: '2024-06-24T00:00:00Z',
      description: 'AlienX launches their public mainnet.',
      type: 'general',
    },
  ],
  customDa: AnytrustDAC({ discovery, hostChain: 'ethereum' }),
})
