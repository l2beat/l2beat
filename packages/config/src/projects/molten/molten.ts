import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ESPRESSO } from '../../common/sequencing'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { orbitStackL3 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('molten')

export const molten: ScalingProject = orbitStackL3({
  addedAt: UnixTime(1711843200), // 2024-03-31
  hostChain: 'arbitrum',
  discovery,
  additionalBadges: [BADGES.L3ParentChain.Arbitrum, BADGES.RaaS.Caldera],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'Molten Network',
    shortName: 'Molten',
    slug: 'molten',
    description:
      'Molten is an Orbit stack L3 on Arbitrum with Celestia DA, created by the UniDex team.',
    links: {
      websites: ['https://moltennetwork.com/'],
      bridges: [
        'https://molten.calderabridge.xyz/',
        'https://leverage.unidex.exchange/',
      ],
      documentation: ['https://docs.unidex.exchange/appchain/markdown'],
      explorers: ['https://molten.calderaexplorer.xyz'],
      socialMedia: [
        'https://x.com/moltenl3',
        'https://discord.com/invite/YACsZnuqC9',
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
        callsPerMinute: 300,
      },
    ],
    gasTokens: ['MOLTEN'],
  },
  nonTemplateTechnology: {
    sequencing: ESPRESSO,
  },
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      includeInTotal: false,
      address: ChainSpecificAddress(
        'arb1:0x5a6f8ea5e1028C80CB98Fd8916afBBC4E6b23D80',
      ),
      tokens: '*',
      description:
        'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
    }),
  ],
  milestones: [
    {
      title: 'Molten integrates Espresso sequencer',
      url: 'https://x.com/EspressoSys/status/1929531777686630866',
      date: '2025-01-30T00:00:00.00Z',
      description:
        'Molten adds the Espresso TEE sequencer to their Celestia DA with Blobstream.',
      type: 'general',
    },
    {
      title: 'Mainnet Launch',
      url: 'https://x.com/MoltenL3/status/1774485708742205545',
      date: '2024-03-31T00:00:00Z',
      description: 'Molten launches its Mainnet.',
      type: 'general',
    },
  ],
})
