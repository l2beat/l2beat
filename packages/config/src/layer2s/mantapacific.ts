import {
  AssetId,
  ChainId,
  CoingeckoId,
  EthereumAddress,
  ProjectId,
  Token,
  UnixTime,
} from '@l2beat/shared-pure'

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
import { OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING } from './common/liveness'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('mantapacific')

const upgradesProxy = {
  upgradableBy: ['ProxyAdmin'],
  upgradeDelay: 'No delay',
}

const TOKENS: Omit<Token, 'chainId'>[] = [
  {
    id: AssetId('mantapacific:tia-celestia'),
    name: 'Celestia',
    symbol: 'TIA',
    decimals: 6,
    iconUrl:
      'https://assets.coingecko.com/coins/images/31967/large/tia.jpg?1696530772',
    address: EthereumAddress('0x6Fae4D9935E2fcb11fC79a64e917fb2BF14DaFaa'),
    coingeckoId: CoingeckoId('celestia'),
    sinceTimestamp: new UnixTime(1698782429),
    category: 'other',
    type: 'EBV',
    formula: 'totalSupply',
    bridgedUsing: {
      bridge: 'Hyperlane Nexus',
    },
  },
]

export const mantapacific: Layer2 = {
  type: 'layer2',
  id: ProjectId('mantapacific'),
  display: {
    name: 'Manta Pacific',
    slug: 'mantapacific',
    description:
      'Manta Pacific is an optimistic rollup empowering EVM-native zero-knowledge (ZK) applications and general dapps with a scalable, cost-effective environment to deploy simply using Solidity. Manta Pacific plans to eventually leverage Celestia for data availability to lower gas costs for users across all applications in its ecosystem.',
    warning:
      'Fraud proof system is currently under development. Users need to trust block Proposer to submit correct L1 state roots.',
    purpose: 'Universal',
    category: 'Optimistic Rollup',
    dataAvailabilityMode: 'TxData',
    provider: 'OP Stack',
    links: {
      websites: ['https://pacific.manta.network/'],
      apps: ['https://pacific-bridge.manta.network/'],
      documentation: ['https://docs.manta.network/'],
      explorers: ['https://pacific-explorer.manta.network/'],
      repositories: ['https://github.com/Manta-Network'],
      socialMedia: [
        'https://discord.gg/mantanetwork',
        'https://twitter.com/MantaNetwork',
        'https://medium.com/@mantanetwork',
      ],
    },
    activityDataSource: 'Blockchain RPC',
    liveness: {
      warnings: {
        stateUpdates: OPTIMISTIC_ROLLUP_STATE_UPDATES_WARNING,
      },
    },
  },
  config: {
    tokenList: TOKENS.map((t) => ({ ...t, chainId: ChainId.MANTA_PACIFIC })),
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x9168765EE952de7C6f8fC6FaD5Ec209B960b7622'),
        sinceTimestamp: new UnixTime(1694224871),
        tokens: ['ETH'],
        description: 'Main entry point for users depositing ETH.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x3B95bC951EE0f553ba487327278cAc44f29715E5'),
        sinceTimestamp: new UnixTime(1694224907),
        tokens: '*',
        description:
          'Main entry point for users depositing ERC20 token that do not require custom gateway.',
      }),
    ],
    transactionApi: {
      type: 'rpc',
      startBlock: 1,
      url: 'https://pacific-rpc.manta.network/http',
      callsPerMinute: 1500,
      assessCount: subtractOne,
    },
    liveness: {
      proofSubmissions: [],
      batchSubmissions: [
        {
          formula: 'transfer',
          from: EthereumAddress('0xa76e31d8471d569efdd3d95d1b11ce6710f4533f'),
          to: EthereumAddress('0xAEbA8e2307A22B6824a9a7a39f8b016C357Cd1Fe'),
          sinceTimestamp: new UnixTime(1694225435),
        },
      ],
      stateUpdates: [
        {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x30c789674ad3B458886BBC9abf42EEe19EA05C1D',
          ),
          selector: '0x9aaab648',
          functionSignature:
            'function proposeL2Output(bytes32 _outputRoot, uint256 _l2BlockNumber, bytes32 _l1Blockhash, uint256 _l1BlockNumber)',
          sinceTimestamp: new UnixTime(1694221607),
        },
      ],
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
            'https://etherscan.io/address/0x445c62F4948f3B08a6bB1DbC51Ef985b3Eb199F1#code#F1#L376',
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
            'https://etherscan.io/address/0x9168765EE952de7C6f8fC6FaD5Ec209B960b7622',
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
            'https://etherscan.io/address/0x445c62F4948f3B08a6bB1DbC51Ef985b3Eb199F1#code#F1#L376',
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
            'https://etherscan.io/address/0x1E5e634981564fc645dcbC6546aE618d7870B30a#code#F1#L186',
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
          href: 'https://etherscan.io/address/0x1E5e634981564fc645dcbC6546aE618d7870B30a#code#F1#L141',
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
          href: 'https://etherscan.io/address/0xaeba8e2307a22b6824a9a7a39f8b016c357cd1fe',
        },
        {
          text: 'OptimismPortal.sol#L376 - Etherscan source code, depositTransaction function',
          href: 'https://etherscan.io/address/0x445c62F4948f3B08a6bB1DbC51Ef985b3Eb199F1#code#F1#L376',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [
        {
          text: 'L2OutputOracle.sol#L30 - Etherscan source code, CHALLENGER address',
          href: 'https://etherscan.io/address/0x1E5e634981564fc645dcbC6546aE618d7870B30a#code#F1#L30',
        },
        {
          text: 'L2OutputOracle.sol#L35 - Etherscan source code, PROPOSER address',
          href: 'https://etherscan.io/address/0x1E5e634981564fc645dcbC6546aE618d7870B30a#code#F1#L35',
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
          text: 'OptimismPortal.sol#L376 - Etherscan source code, depositTransaction function',
          href: 'https://etherscan.io/address/0x445c62F4948f3B08a6bB1DbC51Ef985b3Eb199F1#code#F1#L376',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('optimistic', 'merkle proof'),
        references: [
          {
            text: 'OptimismPortal.sol#L242 - Etherscan source code, proveWithdrawalTransaction function',
            href: 'https://etherscan.io/address/0x445c62F4948f3B08a6bB1DbC51Ef985b3Eb199F1#code#F1#L190',
          },
          {
            text: 'OptimismPortal.sol#L270 - Etherscan source code, finalizeWithdrawalTransaction function',
            href: 'https://etherscan.io/address/0x445c62F4948f3B08a6bB1DbC51Ef985b3Eb199F1#code#F1#L270',
          },
          {
            text: 'L2OutputOracle.sol#L185 - Etherscan source code, PROPOSER check',
            href: 'https://etherscan.io/address/0x1E5e634981564fc645dcbC6546aE618d7870B30a#code#F1#L185',
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
    {
      name: 'MantaOwner',
      accounts: [discovery.getPermissionedAccount('SystemConfig', 'owner')],
      description:
        'Owner of the SystemConfig and configured as the Challenger and Guardian of the system.',
    },
    {
      name: 'AdminMultisig',
      accounts: [discovery.getPermissionedAccount('ProxyAdmin', 'owner')],
      description: 'Owner of the ProxyAdmin contract.',
    },
    ...discovery.getOpStackPermissions({
      batcherHash: 'Sequencer',
      PROPOSER: 'Proposer',
      GUARDIAN: 'Guardian',
      CHALLENGER: 'Challenger',
    }),
  ],
  contracts: {
    addresses: [...discovery.getOpStackContractDetails(upgradesProxy)],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  milestones: [
    {
      name: 'Manta Pacific Network Launch',
      link: 'https://mantanetwork.medium.com/manta-pacific-mainnet-alpha-launch-743c6bc2b95e',
      date: '2023-09-12T00:00:00Z',
      description: 'Manta Pacific is live on mainnet.',
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
