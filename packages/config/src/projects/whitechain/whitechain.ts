import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { BADGES } from '../../common/badges'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getOpStackDaTracking, opStackL2 } from '../../templates/opStack'

const discovery = new ProjectDiscovery('whitechain')

// L2 genesis is block 50961390, one after the last block of the legacy
// Whitechain PoA chain; balances, contracts and nonces carried over.
const genesisTimestamp = UnixTime(1792983863)

export const whitechain: ScalingProject = opStackL2({
  addedAt: UnixTime(1793145600), // 2026-10-28
  discovery,
  genesisTimestamp,
  additionalBadges: [BADGES.Other.MigratedFromL1],
  associatedTokens: ['WBT'],
  daTracking: [getOpStackDaTracking(discovery, { sinceBlock: 26274467 })],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.NO_PROOFS],
  display: {
    name: 'Whitechain',
    slug: 'whitechain',
    warning:
      'The fault proof system is deployed but is not functional. The respected game type is the super permissioned game, which runs no VM and exposes no challenger, bond or challenge clock, so no dispute can be resolved by execution. Security relies entirely on the permissioned proposer, with the Guardian able to blacklist games and change the respected game type.',
    description:
      'Whitechain is an Optimistic rollup based on the OP Stack, built by the WhiteBIT exchange. It migrated from an independent PoA chain to a Layer 2 in October 2026, keeping WBT as the custom gas token.',
    links: {
      websites: ['https://whitechain.io/'],
      bridges: ['https://bridge.whitechain.io/'],
      documentation: ['https://docs.whitechain.io/'],
      explorers: ['https://explorer.whitechain.io/'],
      repositories: ['https://github.com/whitebit-exchange'],
      socialMedia: [
        'https://x.com/Whitechain_io',
        'https://t.me/Whitechain_io',
        'https://discord.gg/7GwAXYmaW9',
      ],
    },
  },
  chainConfig: {
    name: 'whitechain',
    chainId: 1875,
    explorerUrl: 'https://explorer.whitechain.io',
    sinceTimestamp: genesisTimestamp,
    gasTokens: ['WBT'],
    multicallContracts: [
      {
        address: EthereumAddress('0xcA11bde05977b3631167028862bE2a173976CA11'),
        batchSize: 150,
        sinceBlock: 50961390,
        version: '3',
      },
    ],
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.whitechain.io',
        callsPerMinute: 1500,
      },
      { type: 'blockscout', url: 'https://explorer.whitechain.io/api' },
      { type: 'blockscoutV2', url: 'https://explorer.whitechain.io/api/v2' },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 50961391, // genesis block 50961390 has no transactions
    adjustCount: { type: 'SubtractOne' },
  },
  nonTemplateTechnology: {
    otherConsiderations: [
      {
        name: 'EVM compatible smart contracts are supported',
        description:
          'OP stack chains are pursuing the EVM Equivalence model. No changes to smart contracts are required regardless of the language they are written in, i.e. anything deployed on L1 can be deployed on L2.',
        risks: [],
        references: [
          {
            title: 'Introducing EVM Equivalence',
            url: 'https://medium.com/ethereum-optimism/introducing-evm-equivalence-5c2021deb306',
          },
        ],
      },
      {
        name: 'Migrated gas token and external bridge',
        description:
          'The custom gas token feature is enabled on the SystemConfig, so the OptimismPortal accepts no ETH and WBT has no canonical representation on Ethereum. The WBT balances of the legacy chain were copied into the L2 genesis, together with a reserve held by the NativeAssetLiquidity predeploy. The reserve can only be released through the LiquidityController predeploy, whose owner is the L2 alias of the L1 ProxyAdmin owner. Assets move between Ethereum, Tron and Whitechain mostly through the Portal, a bridge operated by Whitechain in which a single relayer key authorizes every release and an operator multisig can withdraw the pooled liquidity.',
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'the LiquidityController owner releases WBT from the NativeAssetLiquidity reserve without a matching deposit on another chain.',
          },
        ],
        references: [
          {
            title: 'Migration to L2 - Whitechain docs',
            url: 'https://docs.whitechain.io/learn/general/migration',
          },
          {
            title: 'Portal bridge - Whitechain docs',
            url: 'https://docs.whitechain.io/build/bridge/portal-bridge',
          },
        ],
      },
    ],
  },
  isNodeAvailable: 'UnderReview',
  milestones: [
    {
      title: 'Whitechain migrates to an Ethereum L2',
      url: 'https://docs.whitechain.io/learn/network/mainnet',
      date: '2026-10-26T00:00:00Z',
      description:
        'The legacy Whitechain PoA chain becomes an OP Stack rollup, keeping WBT as gas token.',
      type: 'general',
    },
  ],
})
