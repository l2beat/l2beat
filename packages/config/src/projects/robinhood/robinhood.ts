import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  REASON_FOR_BEING_OTHER,
  TECHNOLOGY,
  UNDER_REVIEW_RISK_VIEW,
} from '../../common'
import type { ScalingProject } from '../../internalTypes'

export const robinhood: ScalingProject = {
  type: 'layer2',
  id: ProjectId('robinhood'),
  capability: 'universal',
  addedAt: UnixTime(1782864000), // 2026-07-01T00:00:00Z
  // Under review: banner + stage and risk rosette shown as "under review" while
  // the full assessment is finalized. Only TVS and activity are tracked for now.
  reviewStatus: 'inReview',
  proofSystem: undefined,
  // validator whitelist is enabled on-chain (validatorWhitelistDisabled: false),
  // so the fraud proof system is permissioned -> classified as Other, not Rollup
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.CLOSED_PROOFS],
  display: {
    name: 'Robinhood Chain',
    slug: 'robinhood',
    purposes: ['Universal', 'RWA'],
    description:
      "Robinhood Chain is an Arbitrum Orbit Layer 2 operated by Robinhood, focused on tokenized real-world assets (such as stocks and ETFs) and onchain financial services including 24/7 trading, lending, and borrowing.\n\nRobinhood Chain is part of Robinhood's broader mission to democratize access to global financial markets and to empower users and developers with modern blockchain tools.",
    links: {
      websites: ['https://robinhood.com/chain/'],
      documentation: ['https://docs.robinhood.com/chain'],
      explorers: ['https://robinhoodchain.blockscout.com'],
      socialMedia: ['https://x.com/RobinhoodApp'],
    },
  },
  config: {
    escrows: [],
    activityConfig: {
      type: 'block',
      startBlock: 1,
      adjustCount: { type: 'SubtractOne' },
    },
  },
  chainConfig: {
    name: 'robinhood',
    chainId: 4663,
    explorerUrl: 'https://robinhoodchain.blockscout.com',
    // L2 genesis (block 1); tokens/escrows tracked from chain launch.
    sinceTimestamp: UnixTime(1777567931),
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.mainnet.chain.robinhood.com',
        callsPerMinute: 600,
      },
      { type: 'blockscout', url: 'https://robinhoodchain.blockscout.com/api' },
    ],
  },
  dataAvailability: undefined,
  riskView: UNDER_REVIEW_RISK_VIEW,
  stage: { stage: 'UnderReview' },
  technology: TECHNOLOGY.UNDER_REVIEW,
  discoveryInfo: {
    isDiscoDriven: false,
    permissionsDiscoDriven: false,
    contractsDiscoDriven: false,
    baseTimestamp: undefined,
    hasDiscoUi: false,
  },
  milestones: [
    {
      // L1 contracts were deployed earlier (2026-04-30) while the chain was
      // private behind a transaction-access whitelist; this marks the public
      // launch (whitelist removed) on 2026-07-01. Pinned to T00:00:00Z because
      // the milestone date must be a full day.
      title: 'Mainnet launch',
      url: 'https://robinhood.com/chain/',
      date: '2026-07-01T00:00:00Z',
      description:
        'Robinhood Chain opens to the public, removing the transaction-access whitelist.',
      type: 'general',
    },
    {
      title: 'Public testnet launch',
      url: 'https://robinhood.com/us/en/newsroom/robinhood-chain-launches-public-testnet/',
      date: '2026-02-10T00:00:00Z',
      description: 'Robinhood Chain opens its public testnet.',
      type: 'general',
    },
  ],
}
