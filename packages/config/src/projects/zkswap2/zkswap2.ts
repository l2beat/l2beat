import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  RISK_VIEW,
} from '../../common'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { zkswap } from '../zkswap/zkswap'

const discovery = new ProjectDiscovery('zkswap2')

export const zkswap2: ScalingProject = {
  type: 'layer2',
  id: ProjectId('zkswap2'),
  capability: 'universal',
  addedAt: UnixTime(1629199654), // 2021-08-17T11:27:34Z
  archivedAt: UnixTime(1677196800), // 2023-02-24T00:00:00.000Z,
  display: {
    name: 'ZKSwap 2.0',
    slug: 'zkswap2',
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
        'https://medium.com/@zkspaceofficial',
        'https://twitter.com/ZKSpaceOfficial',
        'https://discord.gg/UbjmQfUVvf',
        'https://t.me/ZKSpaceOfficial',
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
        address: EthereumAddress('0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3'),
        sinceTimestamp: UnixTime(1626059966),
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
  stateValidation: zkswap.stateValidation,
  technology: {
    dataAvailability: zkswap.technology?.dataAvailability,
    operator: zkswap.technology?.operator,
    forceTransactions: zkswap.technology?.forceTransactions,
    exitMechanisms: zkswap.technology?.exitMechanisms,
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
        discovery.getContractDetails(
          'UniswapV2Factory',
          'Manages trading pairs.',
        ),
        discovery.getContractDetails('Verifier', 'zkSNARK Plonk Verifier.'),
        discovery.getContractDetails('VerifierExit'),
        discovery.getContractDetails('UpgradeGatekeeper'),
      ],
    },
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK('8 days')],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getPermissionDetails(
          'zkSwap 2.0 Admin',
          discovery.getPermissionedAccounts('UpgradeGatekeeper', 'getMaster'),
          'This address is the master of Upgrade Gatekeeper contract, which is allowed to perform upgrades for Governance, Verifier, VerifierExit, PairManager and ZkSync contracts.',
        ),
        discovery.getPermissionDetails(
          'Active validator',
          discovery.getPermissionedAccounts('Governance', 'validators'),
          'This actor is allowed to propose, revert and execute L2 blocks on L1. A list of active validators is kept inside Governance contract and can be updated by zkSwap 2.0 Admin.',
        ),
      ],
    },
  },
  discoveryInfo: getDiscoveryInfo([discovery]),
}
