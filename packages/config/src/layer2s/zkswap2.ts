import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import {
  CONTRACTS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  RISK_VIEW,
} from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { Layer2 } from './types'
import { zkswap } from './zkswap'

const discovery = new ProjectDiscovery('zkswap2')

export const zkswap2: Layer2 = {
  type: 'layer2',
  id: ProjectId('zkswap2'),
  isArchived: true,
  display: {
    name: 'ZKSwap 2.0',
    slug: 'zkswap2',
    warning:
      'Version 3 of the protocol called ZkSpace is available and users are encouraged to move their assets there.',
    description:
      'ZKSwap is a fork of zkSync with added AMM functionality. Based on ZK Rollup technology, ZKSwap aims to execute the full functionality of Uniswap on Layer 2, but increase the TPS, and make transaction processing cheaper.',
    purposes: ['Payments', 'AMM'],
    provider: 'zkSync Lite',
    category: 'ZK Rollup',
    dataAvailabilityMode: 'StateDiffs',
    links: {
      websites: ['https://zks.org/'],
      apps: ['https://zks.app'],
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
        sinceTimestamp: new UnixTime(1626059966),
        tokens: '*',
      },
    ],
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_SN,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW_UNKNOWN,
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_VIA_L1(),
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_ZK,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {
    stateCorrectness: zkswap.technology.stateCorrectness,
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
      references: [
        {
          text: 'ZKSpace Whitepaper',
          href: 'https://github.com/l2labs/zkspace-whitepaper',
        },
      ],
    },
    dataAvailability: zkswap.technology.dataAvailability,
    operator: zkswap.technology.operator,
    forceTransactions: zkswap.technology.forceTransactions,
    exitMechanisms: zkswap.technology.exitMechanisms,
  },
  contracts: {
    addresses: [
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
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK('8 days')],
  },
  permissions: [
    {
      name: 'zkSwap 2.0 Admin',
      accounts: [
        discovery.getPermissionedAccount('UpgradeGatekeeper', 'getMaster'),
      ],
      description:
        'This address is the master of Upgrade Gatekeeper contract, which is allowed to perform upgrades for Governance, Verifier, VerifierExit, PairManager and ZkSync contracts.',
    },
    {
      name: 'Active validator',
      accounts: discovery.getPermissionedAccounts('Governance', 'validators'),
      description:
        'This actor is allowed to propose, revert and execute L2 blocks on L1. A list of active validators is kept inside Governance contract and can be updated by zkSwap 2.0 Admin.',
    },
  ],
}
