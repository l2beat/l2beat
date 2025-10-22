import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { CONTRACTS, REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { AnytrustDAC } from '../../templates/anytrust-template'
import { orbitStackL3 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('ethereal')

export const ethereal: ScalingProject = orbitStackL3({
  capability: 'universal',
  addedAt: UnixTime(1753781100),
  hostChain: ProjectId('arbitrum'),
  overridingPurposes: ['Exchange'],
  additionalBadges: [BADGES.L3ParentChain.Arbitrum, BADGES.RaaS.Conduit],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.CLOSED_PROOFS,
    REASON_FOR_BEING_OTHER.SMALL_DAC,
  ],
  display: {
    architectureImage: 'ethereal',
    name: 'Ethereal',
    slug: 'ethereal',
    description:
      'Ethereal is a decentralized exchange offering institutional-grade performance (sub-20 ms latency, ~1M orders per second) with DeFi-enabled self-custody and security guarantees.',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://ethereal.trade'],
      explorers: ['https://explorer.ethereal.trade/'],
      documentation: ['https://docs.ethereal.trade/'],
      socialMedia: [
        'https://discord.com/invite/etherealdex',
        'https://x.com/etherealdex',
        'https://mirror.xyz/0x71331A0991C312fcCF766c3Ca8F7a11c4f5F756B',
      ],
    },
  },
  chainConfig: {
    name: 'ethereal',
    chainId: 5064014,
    explorerUrl: 'https://explorer.ethereal.trade',
    sinceTimestamp: UnixTime(1758570902),
    apis: [
      { type: 'blockscout', url: 'https://explorer.ethereal.trade/api' },
      { type: 'rpc', url: 'https://rpc.ethereal.trade', callsPerMinute: 300 },
    ],
    gasTokens: ['USDe'],
  },
  discovery,
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  nonTemplateContractRisks: [
    {
      category: 'Funds can be stolen if',
      text: 'the custom whitelisted Outbox or its destination Multisig is compromised.',
      isCritical: true,
    },
    CONTRACTS.UPGRADE_NO_DELAY_RISK,
  ],
  customDa: AnytrustDAC({ discovery, hostChain: 'arbitrum' }),
  milestones: [
    {
      title: 'Mainnet Alpha Launch',
      url: 'https://x.com/etherealdex/status/1980687756633448814',
      date: '2025-10-21T00:00:00Z',
      description: 'Ethereal launches its public Mainnet Alpha.',
      type: 'general',
    },
  ],
})
