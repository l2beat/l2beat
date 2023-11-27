import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  OPERATOR,
  RISK_VIEW,
  subtractOne,
} from './common'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('lightlink')

export const lightlink: Layer2 = {
  type: 'layer2',
  id: ProjectId('lightlink'), // This is a simple identifier, you can use a UUID or another unique string if preferred.
  display: {
    name: 'LightLink',
    slug: 'lightlink',
    description:
      'LightLink is a high-performance, secure, and scalable network, built on Ethereum. The network leverages the power of layer 2 scaling solutions to provide fast and low-cost transactions. Built to onboard new users, LightLink supports both Enterprise mode and standard transacting, unlocking the power of gasless execution with optionality to pay fees in either ETH or its native token, LL. Combined with LightLinks highly composable nature, these features render the network suitable for a wide range of applications, including enterprise ecosystems, gaming and metaverse projects, ticketing, and identity management.',
    purpose: 'Optimistic Rollup',
    category: 'Optimistic Rollup',
    dataAvailabilityMode: 'TxData',
    provider: 'Pellar',
    links: {
      websites: ['https://lightlink.io'],
      apps: ['https://bridge.lightlink.io'],
      documentation: ['https://docs.lightlink.io'],
      explorers: ['https://phoenix.lightlink.io'],
      repositories: ['https://github.com/pellartech/'],
      socialMedia: [
        'https://twitter.com/lightlinkchain',
        'https://discord.gg/lightlinkchain',
        'https://blog.lightlink.io',
      ],
      // Add other links as needed
    },
    activityDataSource: 'Blockchain RPC', // If you have any warnings or additional display info, add them here.
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x3ca373f5ecb92ac762f9876f6e773082a4589995'),
        sinceTimestamp: new UnixTime(1692155207),
        tokens: ['ETH'],
        description: 'Holds Ether',
        // Add any other relevant details for the escrow contract.
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x63105ee97BfB22Dfe23033b3b14A4F8FED121ee9'),
        sinceTimestamp: new UnixTime(1692155531),
        tokens: '*',
        description: 'Holds ERC20 tokens',
        // Add any other relevant details for the escrow contract.
      }),
    ],
    transactionApi: {
      type: 'rpc',
      startBlock: 1,
      url: 'https://replicator.phoenix.lightlink.io/rpc/v1',
      callsPerMinute: 1500,
      assessCount: subtractOne,
    }, // If you have token details, transaction API info, or other config details, add them here.
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_NONE,
    dataAvailability: {
      ...RISK_VIEW.DATA_MIXED,
      sources: [
        {
          contract: 'PrimeAnchor',
          references: [
            'https://etherscan.io/address/0x99eae1b4c6159c4835da1cd86a2542dea70536bb#code#F4#L8',
          ],
        },
      ],
      description:
        'Transaction is currently stored on IPFS with the IPFS CID, transaction roots and state roots being posted to L1. The LightLink team is working on moving DA to Celestia.',
    },
    upgradeability: {
      ...RISK_VIEW.UPGRADABLE_YES,
    },
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_NO_MECHANISM,
      value: '',
      description:
        'At the present time, there is no mechanism to prevent the sequencer from censoring transactions. Allowing transactions to be enqueued via L1 is on the LightLink roadmap.',
      sentiment: 'UnderReview',
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_CANNOT_WITHDRAW,
    },
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL('ETH', 'is'),
  }),
  stage: getStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: null,
      rollupNodeSourceAvailable: null,
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
      fraudProofSystemIsPermissionless: false,
      delayWith30DExitWindow: false,
    },
  }),
  technology: {
    stateCorrectness: {
      name: 'Fraud proofs are in development',
      description:
        'Ultimately LightLink will use fraud proofs to enforce state correctness. This feature is currently in development and the system permits invalid state roots. Users have the ability to run a validator software and compute valid state roots locally, but cannot act on them on chain.',
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'an invalid state root is submitted to the system.',
          isCritical: true,
        },
      ],
      references: [],
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.GENERIC_OFF_CHAIN,
      references: [
        {
          text: 'PrimeAnchor.sol#L23 - Etherscan source code, publishProof function',
          href: 'https://etherscan.io/address/0x99eae1b4c6159c4835da1cd86a2542dea70536bb#code#F4#L8',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [
        {
          text: 'LightLink operates the only "Sequencer" node.',
          href: 'https://docs.lightlink.io/lightlink-protocol/achitecture-and-design/protocol-design',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.SEQUENCER_NO_MECHANISM,
      references: [],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('optimistic', 'no proof'),
        references: [
          {
            text: 'The Standard Bridge - LightLink documentation',
            href: 'https://docs.lightlink.io/lightlink-protocol/achitecture-and-design/bridge-architecture',
          },
        ],
        risks: [EXITS.RISK_CENTRALIZED_VALIDATOR],
      },
    ],
    smartContracts: {
      name: 'EVM compatible smart contracts are supported',
      description:
        'LightLink has an EVM Equivalence model. No changes to smart contracts are required regardless of the language they are written in, i.e. anything deployed on L1 can be deployed on LightLink Network.',
      risks: [],
      references: [],
    },
  },
  contracts: {
    addresses: [
      discovery.getContractDetails('PrimeAnchor', {
        description:
          'PrimeAnchor is a smart contract on L1 that stores information about the rollup batches and state. It is used to prove the state of the rollup to L1.',
      }),
      discovery.getContractDetails('L1NativeTokenPredicate', {
        description:
          'L1NativeTokenPredicate is a proxied smart contract that manages initializing deposits and finalizing withdrawals of native Ether on L1.',
      }),
      discovery.getContractDetails('L1ERC20Predicate', {
        description:
          'L1ERC20Predicate is a proxied smart contract that manages initializing deposits and finalizing withdrawals of ERC20 tokens on L1.',
      }),
      discovery.getContractDetails('L1BridgeRegistry', {
        description:
          'L1BridgeRegistry controls the PoA bridge validators and consensus thresholds.',
      }),
      discovery.getContractDetails('Multisig', {
        description:
          'Multisig is a smart contract that require multiple signatures to execute a transaction. It is used to manage the L1BridgeRegistry contract.',
      }),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    {
      name: 'State Root Proposer',
      accounts: [discovery.getPermissionedAccount('PrimeAnchor', 'owner')],
      description: 'Central actor to post new L2 state roots to L1.',
    },
  ],
  milestones: [
    {
      name: 'Pegasus Testnet Launch',
      link: 'https://pegasus.lightlink.io/block/1',
      date: '2023-01-10T00:00:00.00Z',
      description: 'Launch of the Pegasus testnet for LightLink.',
    },
    {
      name: 'Phoenix Mainnet Launch',
      link: 'https://blog.lightlink.io/hello-world/',
      date: '2023-01-25T00:00:00.00Z',
      description: 'Launch of the Phoenix mainnet for LightLink.',
    },
    {
      name: 'Testnet Bridge Launch',
      link: 'https://blog.lightlink.io/lightlink-testnet-bridge-launch/',
      date: '2023-05-25T00:00:00.00Z',
      description: 'Launch of the bridge for the LightLink testnet.',
    },
  ],
}
