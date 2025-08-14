import {
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { orbitStackL2 } from '../../templates/orbitStack'

const discovery = new ProjectDiscovery('plumenetwork')

export const plumenetwork: ScalingProject = orbitStackL2({
  addedAt: UnixTime(1719224239), // 2024-06-24T10:17:19Z
  additionalBadges: [BADGES.RaaS.Conduit],
  discovery,
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'Plume Network',
    slug: 'plumenetwork',
    description:
      'Plume is a modular L2 blockchain for real-world assets (RWAs) that integrates asset tokenization and compliance providers directly into the chain.',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://plume.org/'],
      bridges: ['https://portal.plume.org'],
      documentation: ['https://docs.plume.org/plume'],
      explorers: ['https://explorer.plume.org'],
      repositories: ['https://github.com/plumenetwork'],
      socialMedia: [
        'https://twitter.com/plumenetwork',
        'https://discord.gg/plume',
        'https://t.me/plumenetwork_community',
      ],
    },
  },
  additionalPurposes: ['RWA'],
  bridge: discovery.getContract('Bridge'),
  rollupProxy: discovery.getContract('RollupProxy'),
  sequencerInbox: discovery.getContract('SequencerInbox'),
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0xE2C902BC61296531e556962ffC81A082b82f5F28',
      ),
      name: 'ERC20Gateway',
      description:
        'Escrows deposited ERC-20 assets for the canonical Bridge. Upon depositing, a generic token representation will be minted at the destination. Withdrawals are initiated by the Outbox contract.',
      tokens: '*',
    }),
  ],
  associatedTokens: ['PLUME'],
  isNodeAvailable: true,
  activityConfig: {
    type: 'block',
    adjustCount: { type: 'SubtractOne' },
    startBlock: 1,
  },
  celestiaDa: {
    sinceBlock: 5757261,
    namespace: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAADQSAB6M6v+s=',
  },
  chainConfig: {
    name: 'plumenetwork',
    coingeckoPlatform: 'plume-network',
    gasTokens: ['PLUME'],
    chainId: 98866,
    explorerUrl: 'https://explorer.plume.org',
    sinceTimestamp: UnixTime(1740047951),
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.plume.org',
        callsPerMinute: 1500,
      },
    ],
    multicallContracts: [
      {
        sinceBlock: 39679,
        batchSize: 150,
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        version: '3',
      },
    ],
  },
})
