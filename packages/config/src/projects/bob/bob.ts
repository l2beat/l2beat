import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { ESCROW, REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('bob')

export const bob: ScalingProject = opStackL2({
  addedAt: UnixTime(1714521600), // 2024-05-01T00:00:00Z
  discovery,
  additionalBadges: [BADGES.RaaS.Conduit],
  additionalPurposes: ['Bitcoin DApps'],
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
      address: EthereumAddress('0x091dF5E1284E49fA682407096aD34cfD42B95B72'),
      tokens: ['wstETH'],
      ...ESCROW.CANONICAL_EXTERNAL,
    }),
  ],
  genesisTimestamp: UnixTime(1712861989),
  nonTemplateExcludedTokens: ['SolvBTC', 'SolvBTC.BBN'],
  isNodeAvailable: 'UnderReview',
  milestones: [
    {
      title: 'Phase 1: Optimistic BOB',
      url: 'https://docs.gobob.xyz/docs/learn/bob-stack/op-stack',
      date: '2024-05-01T00:00:00Z',
      description: 'BOB bootstrapping as an Optimistic Rollup on Ethereum.',
      type: 'general',
    },
  ],
  chainConfig: {
    name: 'bob',
    chainId: 60808,
    coingeckoPlatform: 'bob-network',
    explorerUrl: 'https://explorer.gobob.xyz',
    sinceTimestamp: UnixTime(1712861989),
    apis: [
      { type: 'rpc', url: 'https://rpc.gobob.xyz/', callsPerMinute: 1500 },
      { type: 'blockscout', url: 'https://explorer.gobob.xyz/api' },
    ],
  },
})
