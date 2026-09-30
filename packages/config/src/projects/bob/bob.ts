import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { DERIVATION, REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getOpStackDaTracking, opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('bob')
const chainStart = UnixTime(1712861989)

export const bob: ScalingProject = opStackL2({
  ecosystemInfo: {
    id: ProjectId('superchain'),
    isPartOfSuperchain: true,
  },
  addedAt: UnixTime(1714521600), // 2024-05-01T00:00:00Z
  discovery,
  daTracking: [getOpStackDaTracking(discovery, { sinceBlock: 19634330 })],
  additionalBadges: [BADGES.RaaS.Conduit],
  additionalPurposes: ['Bitcoin DApps'],
  isPartOfSuperchain: true,
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'BOB',
    warning:
      'The fault proof system is deployed but is not functional. The dispute game commits to an op-program release that predates the Jovian hardfork active on the chain, so it cannot derive current blocks and no dispute can be resolved correctly by execution. Security relies entirely on the permissioned proposer and challengers.',
    aliases: ['Build on Bitcoin'],
    slug: 'bob',
    description:
      "BOB (Build on Bitcoin) is an OP Stack rollup that aims to natively support the Bitcoin stack. The current implementation supports a variety of canonical and external bridging for BTC-related assets and a tBTC-v2 LightRelay smart contract for verifying Bitcoin transaction proofs through their blocks' headers on the L2.",
    links: {
      websites: ['https://gobob.xyz'],
      bridges: ['https://app.gobob.xyz'],
      documentation: ['https://docs.gobob.xyz'],
      explorers: ['https://explorer.gobob.xyz?'],
      repositories: ['https://github.com/bob-collective'],
      socialMedia: [
        'https://twitter.com/build_on_bob',
        'https://discord.com/invite/gobob',
        'https://t.me/gobobxyz',
        'https://youtube.com/@BuildOnBitcoin',
      ],
    },
  },
  nonTemplateEscrows: [
    discovery.getEscrowDetails({
      address: ChainSpecificAddress(
        'eth:0x091dF5E1284E49fA682407096aD34cfD42B95B72',
      ),
      tokens: ['wstETH'],
    }),
  ],
  genesisTimestamp: UnixTime(1712861989),
  nonTemplateExcludedTokens: ['SolvBTC', 'SolvBTC.BBN'],
  isNodeAvailable: true,
  nodeSourceLink:
    'https://github.com/ethereum-optimism/optimism/tree/develop/op-node',
  stateDerivation: DERIVATION.OPSTACK('BOB'),
  milestones: [
    {
      title: 'Withdrawals fall back to the permissioned game',
      url: 'https://etherscan.io/tx/0x6f54452af0caf09baf9e3c24b167cc850901088082dff2a244a5c39b1dee3bc7',
      date: '2026-09-16T00:00:00.00Z',
      description:
        'Guardian moves the respected game type back to the PermissionedDisputeGame; Kailua proposals stop.',
      type: 'general',
    },
    {
      title: 'Kona derivation bug',
      url: 'https://github.com/op-rs/kona/issues/3108',
      date: '2025-12-05T00:00:00Z',
      description:
        'To fix a bug in the Kona derivation, the proof system is updated and a state root manually resolved.',
      type: 'incident',
    },
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
  associatedTokens: ['BOB'],
  chainConfig: {
    name: 'bob',
    chainId: 60808,
    coingeckoPlatform: 'bob-network',
    explorerUrl: 'https://explorer.gobob.xyz',
    sinceTimestamp: chainStart,
    apis: [
      { type: 'rpc', url: 'https://rpc.gobob.xyz/', callsPerMinute: 300 },
      { type: 'blockscout', url: 'https://explorer.gobob.xyz/api' },
    ],
  },
  ossification: discovery.getOssification(chainStart),
})
