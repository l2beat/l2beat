import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { REASON_FOR_BEING_OTHER } from '../../common'
import { ESCROW } from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { Layer2 } from '../../types'
import { Badge } from '../badges'
import { opStackL2 } from './templates/opStack'

const discovery = new ProjectDiscovery('bob')

export const bob: Layer2 = opStackL2({
  addedAt: new UnixTime(1704267653), // 2024-01-03T07:40:53Z
  discovery,
  additionalBadges: [Badge.RaaS.Conduit],
  additionalPurposes: ['Bitcoin DApps'],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'BOB',
    slug: 'bob',
    tvlWarning: {
      value:
        'The total TVS doublecounts underlying assets for solvBTC.BBN, solvBTC and uniBTC since they are locked on BOB. We are working on a fix.',
      sentiment: 'warning',
    },
    description:
      "BOB (Build on Bitcoin) is an OP Stack rollup that aims to natively support the Bitcoin stack. The current implementation supports a variety of canonical and external bridging for BTC-related assets and a tBTC-v2 LightRelay smart contract for verifying Bitcoin transaction proofs through their blocks' headers on the L2.",
    links: {
      websites: ['https://gobob.xyz'],
      apps: ['https://app.gobob.xyz'],
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
    discovery.getEscrowDetails({
      address: EthereumAddress('0x450D55a4B4136805B0e5A6BB59377c71FC4FaCBb'),
      tokens: ['USDC'],
      ...ESCROW.CANONICAL_EXTERNAL,
    }),
  ],
  genesisTimestamp: new UnixTime(1712861989),
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
  rpcUrl: 'https://rpc.gobob.xyz/',
  chainConfig: {
    name: 'bob',
    chainId: 60808,
    coingeckoPlatform: 'bob-network',
    explorerUrl: 'https://explorer.gobob.xyz',
    explorerApi: {
      url: 'https://explorer.gobob.xyz/api',
      type: 'blockscout',
    },
    minTimestampForTvl: new UnixTime(1712861989),
  },
})
