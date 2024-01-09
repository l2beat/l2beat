import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { HARDCODED } from '../discovery/values/hardcoded'
import { formatSeconds } from '../utils/formatSeconds'
import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
} from './common'
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from './common/liveness'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('aevo')

const FINALIZATION_PERIOD_SECONDS = discovery.getContractValue<number>(
  'L2OutputOracle',
  'FINALIZATION_PERIOD_SECONDS',
)

const upgradesProxy = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

const challengePeriod: number = discovery.getContractValue<number>(
  'L2OutputOracle',
  'FINALIZATION_PERIOD_SECONDS',
)

const upgradeDelay = 0

export const aevo: Layer2 = {
  type: 'layer2',
  id: ProjectId('aevo'),
  display: {
    name: 'Aevo',
    slug: 'aevo',
    warning:
      'Fraud proof system is currently under development. Users need to trust the block proposer to submit correct L1 state roots.',
    description:
      'Aevo is a high-performance decentralized options exchange, powered by the OP Stack.',
    purpose: 'DEX',
    provider: 'OP Stack',
    category: 'Optimistic Rollup',
    dataAvailabilityMode: 'TxData',
    links: {
      websites: ['https://aevo.xyz/'],
      apps: ['https://app.aevo.xyz/'],
      documentation: ['https://docs.aevo.xyz/'],
      explorers: ['https://explorer.aevo.xyz/'],
      repositories: ['https://github.com/aevoxyz'],
      socialMedia: ['https://twitter.com/aevoxyz'],
    },
    activityDataSource: 'Blockchain RPC',
    liveness: {
      warnings: {
        stateUpdates: OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
      },
      explanation: `Aevo is an Optimistic rollup that posts transaction data to the L1. For a transaction to be considered final, it has to be posted within a tx batch on L1 that links to a previous finalized batch. If the previous batch is missing, transaction finalization can be delayed up to ${formatSeconds(
        HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
      )} or until it gets published. The state root gets finalized ${formatSeconds(
        FINALIZATION_PERIOD_SECONDS,
      )} after it has been posted.`,
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x787A0ACaB02437c60Aafb1a29167A3609801e320'),
        sinceTimestamp: new UnixTime(1679193119),
        tokens: ['ETH'],
        description: 'Main entry point for users depositing ETH.',
        ...upgradesProxy,
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x4082C9647c098a6493fb499EaE63b5ce3259c574'),
        sinceTimestamp: new UnixTime(1679193071),
        tokens: '*',
        description:
          'Main entry point for users depositing ERC20 token that do not require custom gateway.',
        ...upgradesProxy,
      }),
    ],
    liveness: {
      batchSubmissions: [
        {
          formula: 'transfer',
          from: EthereumAddress('0x889e21d7BA3d6dD62e75d4980A4Ad1349c61599d'),
          to: EthereumAddress('0x253887577420Cb7e7418cD4d50147743c8041b28'),
          sinceTimestamp: new UnixTime(1679202395),
        },
      ],
      stateUpdates: [
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x909E51211e959339EFb14b36f5A50955a8ae3770',
          ),
          selector: '0x9aaab648',
          functionSignature:
            'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1Blockhash, uint256 _l1BlockNumber)',
          sinceTimestamp: new UnixTime(1679193083),
        },
      ],
      proofSubmissions: [],
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
            'https://etherscan.io/address/0x098927F692C86fA1722115652b9d2d7BE8cBa6D3#code#F1#L376',
          ],
        },
      ],
    },
    exitWindow: {
      ...RISK_VIEW.EXIT_WINDOW(upgradeDelay, challengePeriod),
      sources: [
        {
          contract: 'OptimismPortal',
          references: [
            'https://etherscan.io/address/0x098927F692C86fA1722115652b9d2d7BE8cBa6D3',
          ],
        },
      ],
    },
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_SELF_SEQUENCE(
        // the value is inside the node config, but we have no reference to it
        // so we assume it to be the same value as in other op stack chains
        HARDCODED.OPTIMISM.SEQUENCING_WINDOW_SECONDS,
      ),
      sources: [
        {
          contract: 'OptimismPortal',
          references: [
            'https://etherscan.io/address/0x098927F692C86fA1722115652b9d2d7BE8cBa6D3#code#F1#L376',
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
            'https://etherscan.io/address/0x0af92E6944900abA4B9BAC1417bA13ED6F45c27f#code#F1#L186',
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
      rollupNodeSourceAvailable: false,
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
          href: 'https://etherscan.io/address/0x0af92E6944900abA4B9BAC1417bA13ED6F45c27f#code#F1#L141',
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
          href: 'https://etherscan.io/address/0x889e21d7BA3d6dD62e75d4980A4Ad1349c61599d',
        },
        {
          text: 'OptimismPortal.sol#L434 - Etherscan source code, depositTransaction function',
          href: 'https://etherscan.io/address/0x098927F692C86fA1722115652b9d2d7BE8cBa6D3#code#F1#L376',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [
        {
          text: 'L2OutputOracle.sol#L30 - Etherscan source code, CHALLENGER address',
          href: 'https://etherscan.io/address/0x0af92E6944900abA4B9BAC1417bA13ED6F45c27f#code#F1#L30',
        },
        {
          text: 'L2OutputOracle.sol#L35 - Etherscan source code, PROPOSER address',
          href: 'https://etherscan.io/address/0x0af92E6944900abA4B9BAC1417bA13ED6F45c27f#code#F1#L35',
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
          text: 'OptimismPortal.sol#L434 - Etherscan source code, depositTransaction function',
          href: 'https://etherscan.io/address/0x098927F692C86fA1722115652b9d2d7BE8cBa6D3#code#F1#L376',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('optimistic', 'merkle proof'),
        references: [
          {
            text: 'OptimismPortal.sol#L242 - Etherscan source code, proveWithdrawalTransaction function',
            href: 'https://etherscan.io/address/0x098927F692C86fA1722115652b9d2d7BE8cBa6D3#code#F1#L190',
          },
          {
            text: 'OptimismPortal.sol#325 - Etherscan source code, finalizeWithdrawalTransaction function',
            href: 'https://etherscan.io/address/0x098927F692C86fA1722115652b9d2d7BE8cBa6D3#code#F1#L270',
          },
          {
            text: 'L2OutputOracle.sol#L185 - Etherscan source code, PROPOSER check',
            href: 'https://etherscan.io/address/0x0af92E6944900abA4B9BAC1417bA13ED6F45c27f#code#F1#L185',
          },
        ],
        risks: [EXITS.RISK_CENTRALIZED_VALIDATOR],
      },
      {
        ...EXITS.FORCED('all-withdrawals'),
        references: [
          {
            text: 'Forced withdrawal from an OP Stack blockchain',
            href: 'https://stack.optimism.io/docs/security/forced-withdrawal/',
          },
        ],
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
      'AevoMultiSig',
      'This address is the owner of the following contracts: ProxyAdmin, SystemConfig. It is also designated as a Guardian of the OptimismPortal, meaning it can halt withdrawals. It can upgrade the bridge implementation potentially gaining access to all funds, and change the sequencer, state root proposer or any other system component (unlimited upgrade power).',
    ),
    ...discovery.getOpStackPermissions({
      batcherHash: 'Sequencer',
      PROPOSER: 'Proposer',
      GUARDIAN: 'Guardian',
      CHALLENGER: 'Challenger',
    }),
  ],
  contracts: {
    addresses: [
      ...discovery.getOpStackContractDetails(upgradesProxy),
      discovery.getContractDetails('L1StandardBridge', {
        description:
          'The L1StandardBridge contract is the main entry point to deposit ERC20 tokens from L1 to L2.',
        ...upgradesProxy,
      }),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
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
  milestones: [
    {
      name: 'Aevo Open Mainnet Launch',
      link: 'https://aevo.mirror.xyz/hV7VYkpk7caoYl2DbOFcSaZRRrK-8NeWqKczrgUff6k',
      date: '2023-06-14T00:00:00.00Z',
      description:
        'Aevo removed the whitelist and opened the mainnet to the public.',
    },
  ],
}
