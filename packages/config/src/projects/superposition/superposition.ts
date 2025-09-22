import {
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL3 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('superposition')

export const superposition: ScalingProject = orbitStackL3({
  capability: 'universal',
  addedAt: UnixTime(1736726400), // 2025-01-13T00:00:00Z
  additionalBadges: [BADGES.L3ParentChain.Arbitrum, BADGES.RaaS.Conduit],
  additionalPurposes: ['Gaming', 'Social'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'Superposition',
    slug: 'superposition',
    description:
      'Superposition is a Layer 3 powered by Arbitrum Orbit AnyTrust. It is a yield centric blockchain that pays users and developers to use it. Superposition offers novel incentive mechanisms such as Utility Mining and Super Assets and a native onchain order book built using Stylus that provides shared liquidity for the ecosystem.',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://superposition.so/'],
      bridges: ['https://bridge.superposition.so/'],
      documentation: ['https://docs.superposition.so/'],
      explorers: ['https://explorer.superposition.so/'],
      socialMedia: [
        'https://x.com/Superpositionso',
        'https://medium.com/@Superpositionso',
      ],
    },
  },
  chainConfig: {
    name: 'superposition',
    chainId: 55244,
    explorerUrl: 'https://explorer.superposition.so',
    sinceTimestamp: UnixTime(1725644465),
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.superposition.so',
        callsPerMinute: 300,
      },
      { type: 'blockscout', url: 'https://explorer.superposition.so/api' },
    ],
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 39,
        version: '3',
      },
    ],
  },
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'arb1:0x62bEd4b862254789825Cd6F2352aa2b76B16145e',
      ), // standardGW
      tokens: '*',
    }),
  ],
  hostChain: 'arbitrum',
  discovery,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  customDa: AnytrustDAC({ discovery, hostChain: 'arbitrum' }),
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://x.com/Superpositionso/status/1878789316018926027',
      date: '2025-01-13T00:00:00Z',
      description: 'Superposition launches its Mainnet.',
      type: 'general',
    },
  ],
})
