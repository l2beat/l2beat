import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL3 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('game7')

const L1OrbitERC20Gateway = discovery.getContract('ERC20Gateway')

export const game7: ScalingProject = orbitStackL3({
  addedAt: UnixTime(1738899615),
  hostChain: 'arbitrum',
  discovery,
  additionalBadges: [BADGES.L3ParentChain.Arbitrum, BADGES.RaaS.Conduit],
  additionalPurposes: ['Gaming'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'Game7',
    slug: 'g7',
    description:
      'Game7 is a DAO initiated by BitDAO and Forte to accelerate the adoption of sustainable, web3-native gaming.',
    links: {
      websites: ['https://game7.io/'],
      documentation: ['https://docs.game7.io/'],
      bridges: ['https://build.game7.io/bridge'],
      explorers: ['https://mainnet.game7.io'],
      repositories: ['https://github.com/G7DAO'],
      socialMedia: [
        'https://discord.gg/g7dao',
        'https://x.com/G7_DAO',
        'https://mirror.xyz/0x17D15C35b9c50032eE98f5730934ff85F9c16acA',
        'https://youtube.com/@G7_DAO',
      ],
    },
  },
  chainConfig: {
    name: 'g7',
    chainId: 2187,
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet-rpc.game7.io',
        callsPerMinute: 1500,
      },
    ],
    gasTokens: ['G7'],
  },
  associatedTokens: ['G7'],
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: L1OrbitERC20Gateway.address,
      name: L1OrbitERC20Gateway.name,
      description: L1OrbitERC20Gateway.description,
      tokens: '*',
    }),
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'arb1:0x404922a9B29b4a5205a6074AbA31A7392BD28944',
      ),
      tokens: ['USDC'],
      description: 'Main entry point for users depositing USDC.',
    }),
  ],
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  milestones: [
    {
      title: 'Mainnet Launch',
      url: 'https://x.com/G7_DAO/status/1886897963353694319',
      date: '2025-02-04T00:00:00Z',
      description: 'G7 Network Mainnet is live.',
      type: 'general',
    },
  ],
  customDa: AnytrustDAC({ discovery, hostChain: 'arbitrum' }),
})
