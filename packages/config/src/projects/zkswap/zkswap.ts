import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
  STATE_VALIDATION,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('zkswap')

export const zkswap: ScalingProject = {
  type: 'layer2',
  id: ProjectId('zkswap'),
  capability: 'universal',
  addedAt: UnixTime(1623153328), // 2021-06-08T11:55:28Z
  archivedAt: UnixTime(1677196800), // 2023-02-24T00:00:00.000Z,
  display: {
    name: 'ZKSwap 1.0',
    slug: 'zkswap',
    warning:
      'Version 3 of the protocol called ZkSpace is available and users are encouraged to move their assets there.',
    description:
      'ZKSwap is a fork of ZKsync with added AMM functionality. Based on ZK Rollup technology, ZKSwap aims to execute the full functionality of Uniswap on Layer 2, but increase the TPS, and make transaction processing cheaper.',
    purposes: ['Payments', 'Exchange'],
    stacks: ['ZKsync Lite'],
    category: 'ZK Rollup',

    links: {
      websites: ['https://zks.org/'],
      bridges: ['https://zks.app'],
      documentation: ['https://en.wiki.zks.org/'],
      explorers: ['https://zkswap.info'],
      repositories: ['https://github.com/l2labs/zkswap-contracts'],
      socialMedia: [
        'https://medium.com/@zkswapofficial',
        'https://twitter.com/ZKSwapOfficial',
        'https://discord.gg/rpjpeq4Y47',
        'https://t.me/zkswapofficial',
        'https://reddit.com/r/ZKSwap_Official/',
      ],
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    associatedTokens: ['ZKS'],
    escrows: [
      {
        address: EthereumAddress('0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad'),
        sinceTimestamp: UnixTime(1613135194),
        tokens: '*',
        chain: 'ethereum',
      },
    ],
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.STATE_DIFFS,
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_ZKP_SN,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW_UNKNOWN,
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_VIA_L1(),
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_ZK,
  },
  stateValidation: {
    categories: [
      {
        ...STATE_VALIDATION.VALIDITY_PROOFS,
        references: [
          {
            title: 'ZKSwap Introduces Practical ZK Rollups - Medium blog',
            url: 'https://medium.com/zkswap/zkswap-introduces-practical-zk-rollups-zkspeed-achieving-high-tps-and-low-gas-fees-in-real-6effe4e789e0',
          },
        ],
      },
    ],
  },
  technology: {
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CALLDATA,
      references: [
        {
          title: 'ZKSwap Introduces Practical ZK Rollups - Medium blog',
          url: 'https://medium.com/zkswap/zkswap-introduces-practical-zk-rollups-zkspeed-achieving-high-tps-and-low-gas-fees-in-real-6effe4e789e0',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [
        {
          title: 'ZKSwap Validator - ZKSwap wiki',
          url: 'https://en.wiki.zks.org/techonology#3-validator',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.WITHDRAW_OR_HALT(),
      references: [
        {
          title: 'ZkSync.sol#L404 - ZKSwap source code',
          url: 'https://github.com/l2labs/zkswap-contracts-v2/blob/master/contracts/ZkSync.sol#L404',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR_WITHDRAWAL('zk'),
        references: [
          {
            title: 'Make Transaction',
            url: 'https://en.wiki.zks.org/interact-with-zkswap/make-transaction#withdraw',
          },
        ],
      },
      {
        ...EXITS.FORCED_WITHDRAWAL(),
        references: [
          {
            title: 'ZkSync.sol#L404 - ZKSwap source code',
            url: 'https://github.com/l2labs/zkswap-contracts-v2/blob/master/contracts/ZkSync.sol#L404',
          },
        ],
      },
      {
        ...EXITS.EMERGENCY('Exodus Mode', 'zero knowledge proof'),
        references: [
          {
            title: 'ZkSyncCommitBlock.sol#L230-L246 - ZKSwap source code',
            url: 'https://github.com/l2labs/zkswap-contracts-v2/blob/3f650d28a266a56d49a3b3d2049cde34112efb14/contracts/ZkSyncCommitBlock.sol#L230-L246',
          },
        ],
      },
    ],
  },
  contracts: {
    addresses: {
      ethereum: [
        discovery.getContractDetails(
          'ZkSync',
          'The main Rollup contract. Operator commits blocks, provides ZK proof which is validated by the Verifier contract and process withdrawals (executes blocks). Users deposit ETH and ERC20 tokens. This contract defines the upgrade delay in the UPGRADE_NOTICE_PERIOD constant that is currently set to 8 days.',
        ),
        discovery.getContractDetails(
          'ZkSyncCommitBlock',
          'Additional contract to store implementation details of the main ZkSync contract.',
        ),
        discovery.getContractDetails('ZkSyncExit'),
        discovery.getContractDetails(
          'Governance',
          'Keeps a list of block producers and whitelisted tokens.',
        ),
        discovery.getContractDetails('PairManager'),
        discovery.getContractDetails('Verifier'),
        discovery.getContractDetails('VerifierExit'),
        discovery.getContractDetails(
          'UpgradeGatekeeper',
          'This is the contract that implements the upgrade mechanism for Governance, Verifier and ZkSync. It relies on the ZkSync contract to enforce upgrade delays.',
        ),
      ],
    },
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK('8 days')],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getPermissionDetails(
          'zkSwap 1.0 Admin',
          discovery.getPermissionedAccounts('UpgradeGatekeeper', 'getMaster'),
          'This address is the master of Upgrade Gatekeeper contract, which is allowed to perform upgrades for Governance, Verifier, VerifierExit, PairManager and ZkSync contracts.',
        ),
        discovery.getPermissionDetails(
          'Active validator',
          discovery.getPermissionedAccounts('Governance', 'validators'),
          'This actor is allowed to propose, revert and execute L2 blocks on L1. A list of active validators is kept inside Governance contract and can be updated by zkSwap 1.0 Admin.',
        ),
      ],
    },
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
