import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { CONTRACTS, REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL3 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('degen')

export const degen: ScalingProject = orbitStackL3({
  addedAt: UnixTime(1711584000), // 2024-03-28T00:00:00Z
  hostChain: 'base',
  discovery,
  additionalBadges: [BADGES.L3ParentChain.Base, BADGES.RaaS.Alchemy],
  additionalPurposes: ['Social'],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    name: 'Degen Chain',
    slug: 'degen',
    description:
      'Degen Chain is an ultra-low-cost L3 for the Degen community built with Arbitrum Orbit, Base for settlement, and AnyTrust for data availability. DEGEN is the native gas token.',
    links: {
      websites: ['https://syndicate.io/blog/degen-chain'],
      bridges: ['https://bridge.degen.tips/', 'https://degen.tips/'],
      documentation: [
        'https://docs.syndicate.io/docs/core/get-started/introduction',
      ],
      explorers: ['https://explorer.degen.tips/'],
      socialMedia: [
        'https://twitter.com/degentokenbase',
        'https://warpcast.com/~/channel/degen',
      ],
    },
  },
  blockNumberOpcodeTimeSeconds: 2, // block.number opcode on Base (Degen host chain) counts Base L2 block numbers that have 2 seconds block time (different to OP stack host chains that count the L1 blocks)
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  chainConfig: {
    name: 'degen',
    chainId: 666666666,
    explorerUrl: 'https://explorer.degen.tips',
    sinceTimestamp: UnixTime(1710087539),
    multicallContracts: [
      {
        address: EthereumAddress('0x79035Dc4436bA9C95016D3bF6304e5bA78B1066A'),
        batchSize: 150,
        sinceBlock: 2279171,
        version: '3',
      },
    ],
    gasTokens: ['DEGEN'],
    apis: [
      { type: 'rpc', url: 'https://rpc.degen.tips', callsPerMinute: 5000 },
      { type: 'blockscout', url: 'https://explorer.degen.tips/api' },
    ],
  },
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  nonTemplateContractRisks: [
    {
      category: 'Funds can be stolen if',
      text: 'the security stack of the whitelisted LayerZero adapter changes or is compromised.',
      isCritical: true,
    },
    CONTRACTS.UPGRADE_NO_DELAY_RISK,
  ],
  associatedTokens: ['DEGEN'],
  milestones: [
    {
      title: 'Degen Chain halts for two days',
      date: '2024-05-13T00:00:00Z',
      url: 'https://x.com/degentokenbase/status/1789944238731297188',
      description:
        'Degen Chain halts for two days due to a chain misconfiguration.',
      type: 'incident',
    },
    {
      title: 'Degen Chain launches Mainnet',
      date: '2024-03-28T00:00:00Z',
      url: 'https://x.com/syndicateio/status/1773351144858750990',
      description: 'Degen Chain launches its mainnet.',
      type: 'general',
    },
  ],
  customDa: AnytrustDAC({ discovery, hostChain: 'base' }),
})
