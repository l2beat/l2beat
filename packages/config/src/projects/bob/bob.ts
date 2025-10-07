import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ESCROW } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('bob')

export const bob: ScalingProject = opStackL2({
  ecosystemInfo: {
    id: ProjectId('superchain'),
    isPartOfSuperchain: true,
  },
  addedAt: UnixTime(1714521600), // 2024-05-01T00:00:00Z
  discovery,
  additionalBadges: [BADGES.RaaS.Conduit, BADGES.Stack.OPKailua],
  additionalPurposes: ['Bitcoin DApps'],
  isPartOfSuperchain: true,
  display: {
    name: 'BOB',
    slug: 'bob',
    description:
      "BOB (Build on Bitcoin) is an OP Stack rollup that aims to natively support the Bitcoin stack. The current implementation supports a variety of canonical and external bridging for BTC-related assets and a tBTC-v2 LightRelay smart contract for verifying Bitcoin transaction proofs through their blocks' headers on the L2.",
    links: {
      websites: ['https://gobob.xyz'],
      bridges: ['https://app.gobob.xyz'],
      documentation: ['https://docs.gobob.xyz'],
      explorers: ['https://explorer.gobob.xyz?'],
      repositories: ['https://github.com/bob-collective'],
      socialMedia: ['https://twitter.com/build_on_bob'],
    },
  },
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x091dF5E1284E49fA682407096aD34cfD42B95B72',
      ),
      tokens: ['wstETH'],
      ...ESCROW.CANONICAL_EXTERNAL,
    }),
  ],
  genesisTimestamp: UnixTime(1712861989),
  nonTemplateExcludedTokens: ['SolvBTC', 'SolvBTC.BBN'],
  isNodeAvailable: 'UnderReview',
  milestones: [
    {
      title: 'Proof System Intervention',
      url: 'https://app.blocksec.com/explorer/tx/eth/0xa065f636adfc7cdf08007ee81303028fa4daf291279a75a5ae1d3a975acce806?line=7',
      date: '2025-07-24T00:00:00Z',
      description:
        'A state root proposal is manually resolved after changing the finalization config.',
      type: 'incident',
    },
    {
      title: 'OP Kailua Upgrade',
      url: 'https://x.com/build_on_bob/status/1948369793796689925',
      date: '2025-07-17T00:00:00Z',
      description:
        'BOB returns to the rollup section by using a hybrid zk fault proof system.',
      type: 'general',
    },
    {
      title: 'Phase 1: Optimistic BOB',
      url: 'https://x.com/build_on_bob/status/1763642185101004914',
      date: '2024-05-01T00:00:00Z',
      description: 'BOB bootstrapping as an Optimistic Rollup on Ethereum.',
      type: 'general',
    },
  ],
  nonTemplateProofSystem: {
    type: 'Optimistic',
    name: 'OP Kailua',
    zkCatalogId: ProjectId('risc0'),
    challengeProtocol: 'Single-step',
  },
  chainConfig: {
    name: 'bob',
    chainId: 60808,
    coingeckoPlatform: 'bob-network',
    explorerUrl: 'https://explorer.gobob.xyz',
    sinceTimestamp: UnixTime(1712861989),
    apis: [
      { type: 'rpc', url: 'https://rpc.gobob.xyz/', callsPerMinute: 300 },
      { type: 'blockscout', url: 'https://explorer.gobob.xyz/api' },
    ],
  },
})
