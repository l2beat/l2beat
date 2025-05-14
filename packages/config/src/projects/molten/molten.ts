import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { orbitStackL3 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('molten', 'arbitrum')

export const molten: ScalingProject = orbitStackL3({
  addedAt: UnixTime(1711843200), // 2024-03-31
  discovery,
  additionalBadges: [BADGES.L3ParentChain.Arbitrum, BADGES.RaaS.Caldera],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'Molten Network',
    shortName: 'Molten',
    slug: 'molten',
    description:
      'Molten is an Orbit stack L3 on Arbitrum with AnyTrust DA, created by the UniDex team.',
    links: {
      websites: ['https://moltennetwork.com/'],
      apps: [
        'https://molten.calderabridge.xyz/',
        'https://leverage.unidex.exchange/',
      ],
      documentation: ['https://docs.unidex.exchange/appchain/markdown'],
      explorers: ['https://molten.calderaexplorer.xyz'],
      socialMedia: [
        'https://x.com/moltenl3',
        'https://discord.gg/moltennetwork',
        'https://mirror.xyz/unidexexchange.eth',
        'https://t.me/unidexfinance',
      ],
    },
  },
  isNodeAvailable: true,
  celestiaDa: {
    sinceBlock: 5305699,
    namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAMod4SpNR57blEA=',
  },
  associatedTokens: ['MOLTEN'],
  chainConfig: {
    name: 'molten',
    chainId: 360,
    apis: [
      {
        type: 'rpc',
        url: 'https://molten.calderachain.xyz/http',
        callsPerMinute: 1500,
      },
    ],
    gasTokens: ['MOLTEN'],
  },
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      includeInTotal: false,
      address: EthereumAddress('0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80'),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
    }),
  ],
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://x.com/MoltenL3/status/1774485708742205545',
      date: '2024-03-31T00:00:00Z',
      description: 'Molten launches its Mainnet.',
      type: 'general',
    },
  ],
})
