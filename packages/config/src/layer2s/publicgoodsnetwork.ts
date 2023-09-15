import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { HARDCODED } from '../discovery/values/hardcoded'
import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  subtractOne,
} from './common'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('publicgoodsnetwork')

const upgradesProxy = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

export const publicgoodsnetwork: Layer2 = {
  type: 'layer2',
  id: ProjectId('publicgoodsnetwork'),
  display: {
    name: 'Public Goods Network',
    slug: 'publicgoodsnetwork',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    description:
      'Public Goods Network is an OP stack chain focused on funding public goods.',
    purpose: 'Universal',
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://publicgoods.network/'],
      apps: ['https://bridge.publicgoods.network/'],
      documentation: ['https://docs.publicgoods.network/'],
      explorers: ['https://explorer.publicgoods.network'],
      repositories: [
        'https://github.com/supermodularxyz/pgn-monorepo',
        'https://github.com/supermodularxyz/pgn-docs',
      ],
      socialMedia: ['https://twitter.com/pgn_eth'],
    },
    activityDataSource: 'Blockchain RPC',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xb26Fd985c5959bBB382BAFdD0b879E149e48116c'),
        sinceTimestamp: new UnixTime(1686068903),
        tokens: ['ETH'],
        description: 'Main entry point for users depositing ETH.',
        ...upgradesProxy,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b'),
        sinceTimestamp: new UnixTime(1624401464),
        tokens: '*',
        description:
          'Main entry point for users depositing ERC20 tokens that do not require custom gateway.',
        ...upgradesProxy,
      }),
    ],
    transactionApi: {
      type: 'rpc',
      startBlock: 1,
      url: 'https://rpc.publicgoods.network',
      callsPerMinute: 1500,
      assessCount: subtractOne,
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_NONE,
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      sources: [
        {
          contract: 'OptimismPortal',
          references: [
            'https://etherscan.io/address/0x436e9FC7894e26718637f086d42B4a06439C8ae0#code#F1#L434',
          ],
        },
      ],
    },
    upgradeability: {
      ...RISK_VIEW.UPGRADABLE_YES,
      sources: [
        {
          contract: 'OptimismPortal',
          references: [
            'https://etherscan.io/address/0xb26Fd985c5959bBB382BAFdD0b879E149e48116c',
          ],
        },
      ],
    },
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE(
        HARDCODED.PUBLICGOODSNETWORK.SEQUENCING_WINDOW_SECONDS,
      ),
      sources: [
        {
          contract: 'OptimismPortal',
          references: [
            'https://etherscan.io/address/0x436e9FC7894e26718637f086d42B4a06439C8ae0#code#F1#L434',
          ],
        },
      ],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
      sources: [
        {
          contract: 'L2OutputOracle',
          references: [
            'https://etherscan.io/address/0x76983dfED43C7ae7ebB592A92Be2BE972cAE4348#code#F1#L186',
          ],
        },
      ],
    },
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  stage: getStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeSourceAvailable: true,
    },
    stage1: {
      stateVerificationOnL1: false,
      fraudProofSystemAtLeast5Outsiders: null,
      usersHave7DaysToExit: false,
      usersCanExitWithoutCooperation: false,
      securityCouncilProperlySetUp: null,
    },
    stage2: {
      proofSystemOverriddenOnlyInCaseOfABug: null,
      fraudProofSystemIsPermissionless: null,
      delayWith30DExitWindow: false,
    },
  }),
  technology: {
    stateCorrectness: {
      name: 'Fraud proofs are in development',
      description:
        'Ultimately, OP stack chains will use interactive fraud proofs to enforce state correctness. This feature is currently in development and the system permits invalid state roots.',
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'an invalid state root is submitted to the system.',
          isCritical: true,
        },
      ],
      references: [
        {
          text: 'L2OutputOracle.sol#L141 - Etherscan source code, deleteL2Outputs function',
          href: 'https://etherscan.io/address/0x76983dfED43C7ae7ebB592A92Be2BE972cAE4348#code#F1#L141',
        },
      ],
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
      references: [
        {
          text: 'Derivation: Batch submission - OP Stack specs',
          href: 'https://github.com/ethereum-optimism/optimism/blob/develop/specs/derivation.md#batch-submission',
        },
        {
          text: 'BatchInbox - Etherscan address',
          href: 'https://etherscan.io/address/0x6F54Ca6F6EdE96662024Ffd61BFd18f3f4e34DFf',
        },
        {
          text: 'OptimismPortal.sol#L434 - Etherscan source code, depositTransaction function',
          href: 'https://etherscan.io/address/0x436e9FC7894e26718637f086d42B4a06439C8ae0#code#F1#L434',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [
        {
          text: 'L2OutputOracle.sol#30 - Etherscan source code, CHALLENGER address',
          href: 'https://etherscan.io/address/0x76983dfED43C7ae7ebB592A92Be2BE972cAE4348#code#F1#L30',
        },
        {
          text: 'L2OutputOracle.sol#L35 - Etherscan source code, PROPOSER address',
          href: 'https://etherscan.io/address/0x76983dfED43C7ae7ebB592A92Be2BE972cAE4348#code#F1#L35',
        },
        {
          text: 'Decentralizing the sequencer - OP Stack docs',
          href: 'https://community.optimism.io/docs/protocol/#decentralizing-the-sequencer',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.CANONICAL_ORDERING,
      references: [
        {
          text: 'Sequencing Window - OP Stack specs',
          href: 'https://github.com/ethereum-optimism/optimism/blob/develop/specs/glossary.md#sequencing-window',
        },
        {
          text: 'OptimismPortal.sol#L434 - Etherscan source code, depositTransaction function',
          href: 'https://etherscan.io/address/0x436e9FC7894e26718637f086d42B4a06439C8ae0#code#F1#L434',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('optimistic', 'merkle proof'),
        references: [
          {
            text: 'OptimismPortal.sol#L242 - Etherscan source code, proveWithdrawalTransaction function',
            href: 'https://etherscan.io/address/0x436e9FC7894e26718637f086d42B4a06439C8ae0#code#F1#L242',
          },
          {
            text: 'OptimismPortal.sol#L325 - Etherscan source code, finalizeWithdrawalTransaction function',
            href: 'https://etherscan.io/address/0x436e9FC7894e26718637f086d42B4a06439C8ae0#code#F1#L325',
          },
          {
            text: 'L2OutputOracle.sol#L185 - Etherscan source code, PROPOSER check',
            href: 'https://etherscan.io/address/0x76983dfED43C7ae7ebB592A92Be2BE972cAE4348#code#F1#L185',
          },
        ],
        risks: [EXITS.RISK_CENTRALIZED_VALIDATOR],
      },
    ],
    smartContracts: {
      name: 'EVM compatible smart contracts are supported',
      description:
        'OP stack chains are pursuing the EVM Equivalence model. No changes to smart contracts are required regardless of the language they are written in, i.e. anything deployed on L1 can be deployed on L2.',
      risks: [],
      references: [
        {
          text: 'Introducing EVM Equivalence',
          href: 'https://medium.com/ethereum-optimism/introducing-evm-equivalence-5c2021deb306',
        },
      ],
    },
  },
  permissions: [
    ...discovery.getMultisigPermission(
      'PGNMultisig',
      'This address is the owner of the following contracts: SystemConfig, ProxyAdmin. It can upgrade the bridge implementation potentially gaining access to all funds, and change the sequencer, state root proposer or any other system component (unlimited upgrade power).',
    ),
    ...discovery.getMultisigPermission(
      'GuardianMultisig',
      'This address is the permissioned challenger of the system. It can delete non finalized roots without going through the fault proof process. It is also designated as a Guardian of the OptimismPortal, meaning it can halt withdrawals.',
    ),
    {
      name: 'ProxyAdmin',
      accounts: [discovery.getPermissionedAccount('AddressManager', 'owner')],
      description:
        "Admin of the AddressManager, SystemConfig, L2OutputOracle, OptimismPortal, L1StandardBridge proxies. It's controlled by the PGNMultisig.",
    },
    {
      name: 'Sequencer',
      accounts: [
        discovery.getPermissionedAccount('SystemConfig', 'batcherHash'),
      ],
      description: 'Central actor allowed to commit L2 transactions to L1',
    },
    {
      name: 'Proposer',
      accounts: [
        discovery.getPermissionedAccount('L2OutputOracle', 'PROPOSER'),
      ],
      description: 'Central actor allowed to post new L2 state roots to L1',
    },
  ],
  contracts: {
    addresses: [
      discovery.getContractDetails('L2OutputOracle', {
        description:
          'The L2OutputOracle contract contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.',
        ...upgradesProxy,
      }),
      discovery.getContractDetails('OptimismPortal', {
        description:
          'The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals.',
        ...upgradesProxy,
      }),
      discovery.getContractDetails('SystemConfig', {
        description:
          'It contains configuration parameters such as the Sequencer address, the L2 gas limit and the unsafe block signer address.',
        ...upgradesProxy,
      }),
      discovery.getContractDetails('L1CrossDomainMessenger', {
        description:
          "The L1 Cross Domain Messenger contract sends messages from L1 to L2, and relays messages from L2 onto L1. In the event that a message sent from L1 to L2 is rejected for exceeding the L2 epoch gas limit, it can be resubmitted via this contract's replay function.",
        ...upgradesProxy,
      }),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  milestones: [
    {
      name: 'Public Goods Network Launch',
      link: 'https://twitter.com/pgn_eth/status/1676972199423668228',
      date: '2023-07-06T00:00:00.00Z',
      description: 'The Public Goods Network is live on mainnet.',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'How Optimism compresses data',
      url: 'https://twitter.com/bkiepuszewski/status/1508740414492323840?s=20&t=vMgR4jW1ssap-A-MBsO4Jw',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
    },
    {
      title: 'Bedrock Explainer',
      url: 'https://community.optimism.io/docs/developers/bedrock/explainer/',
      thumbnail: NUGGETS.THUMBNAILS.OPTIMISM_04,
    },
    {
      title: 'Modular Rollup Theory',
      url: 'https://www.youtube.com/watch?v=jnVjhp41pcc',
      thumbnail: NUGGETS.THUMBNAILS.MODULAR_ROLLUP,
    },
  ],
}
