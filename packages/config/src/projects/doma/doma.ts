import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('doma')

export const doma: ScalingProject = opStackL2({
  ecosystemInfo: {
    id: ProjectId('superchain'),
    isPartOfSuperchain: false,
  },
  addedAt: UnixTime(1793361600), // 2026-10-30T12:00:00Z
  discovery,
  genesisTimestamp: UnixTime(1757968751),
  additionalBadges: [BADGES.RaaS.Conduit],
  reasonsForBeingOther: [
    REASON_FOR_BEING_OTHER.NO_PROOFS,
    REASON_FOR_BEING_OTHER.NO_DA_ORACLE,
  ],
  display: {
    name: 'Doma',
    warning:
      'The fault proof system is deployed but is not functional. The dispute game commits to an op-program release that predates the Jovian hardfork active on the chain, so it cannot derive current blocks and no dispute can be resolved correctly by execution. Security relies entirely on the permissioned proposer and challengers.',
    slug: 'doma',
    description:
      'Doma is an OP Stack Optimium on Ethereum using Celestia for data availability. It tokenizes DNS domains into tradable onchain assets.',
    links: {
      websites: ['https://doma.xyz/'],
      bridges: ['https://app.doma.xyz/'],
      documentation: ['https://docs.doma.xyz/'],
      explorers: ['https://explorer.doma.xyz'],
      repositories: ['https://github.com/d3-inc'],
      socialMedia: ['https://x.com/domaprotocol'],
    },
  },
  chainConfig: {
    name: 'doma',
    chainId: 97477,
    explorerUrl: 'https://explorer.doma.xyz',
    sinceTimestamp: UnixTime(1757968751),
    gasTokens: ['ETH'],
    apis: [
      {
        type: 'blockscout',
        url: 'https://explorer.doma.xyz/api',
      },
      {
        type: 'rpc',
        url: 'https://rpc.doma.xyz',
        callsPerMinute: 300,
      },
    ],
  },
  isNodeAvailable: 'UnderReview',
})
