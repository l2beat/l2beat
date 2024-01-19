import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'

import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  OPERATOR,
  RISK_VIEW,
  ScalingProjectPermissionedAccount,
} from '../common'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { VALUES } from '../discovery/values'
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('parallel')

const roles = discovery.getContractValue<{
  EXECUTOR_ROLE: { members: string[] }
}>('UpgradeExecutor', 'accessControl')

const EOAExecutor: ScalingProjectPermissionedAccount = {
  address: EthereumAddress(roles.EXECUTOR_ROLE.members[0]),
  type: 'EOA',
}

const challengeWindow = discovery.getContractValue<number>(
  'RollupProxy',
  'confirmPeriodBlocks',
)
const assumedBlockTime = 12 // seconds, different from RollupUserLogic.sol#L35 which assumes 13.2 seconds
const challengeWindowSeconds = challengeWindow * assumedBlockTime

const maxTimeVariation = discovery.getContractValue<number[]>(
  'SequencerInbox',
  'maxTimeVariation',
)
const selfSequencingDelay = maxTimeVariation[2]

const validatorAfkBlocks = discovery.getContractValue<number>(
  'RollupProxy',
  'VALIDATOR_AFK_BLOCKS',
)
const validatorAfkTime = validatorAfkBlocks * assumedBlockTime

export const parallel: Layer2 = {
  type: 'layer2',
  id: ProjectId('parallel'),
  display: {
    name: 'Parallel',
    slug: 'parallel',
    headerWarning: '',
    description:
      'Parallel will launch an Ethereum L2 solution utilizing Arbitrum Nitro technology. More information coming soon.',
    purposes: ['Universal', 'DeFi'],
    category: 'Optimistic Rollup',
    dataAvailabilityMode: 'TxData',
    provider: 'Arbitrum',
    links: {
      websites: ['https://parallel.fi'],
      apps: ['https://parallel.fi/airdrop'],
      documentation: ['https://docs.parallel.fi/parallel-chain/overview'],
      explorers: [
        'https://explorerl2new-surprised-harlequin-bonobo-fvcy2k9oqh.t.conduit.xyz/',
      ],
      repositories: [],
      socialMedia: [
        'https://twitter.com/ParallelFi',
        'https://discord.gg/rdjVz8zavF',
        'https://t.me/parallelfi_community',
      ],
    },
  },
  stage: getStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeSourceAvailable: 'UnderReview',
    },
    stage1: {
      stateVerificationOnL1: true,
      fraudProofSystemAtLeast5Outsiders: 'UnderReview',
      usersHave7DaysToExit: false,
      usersCanExitWithoutCooperation: true,
      securityCouncilProperlySetUp: false,
    },
    stage2: {
      proofSystemOverriddenOnlyInCaseOfABug: false,
      fraudProofSystemIsPermissionless: false,
      delayWith30DExitWindow: false,
    },
  }),
  riskView: makeBridgeCompatible({
    stateValidation: {
      value: 'Fraud proofs (INT)',
      description:
        'Fraud proofs allow WHITELISTED actors watching the chain to prove that the state is incorrect. Interactive proofs (INT) require multiple transactions over time to resolve. The challenge protocol can be subject to delay attacks.',
      sentiment: 'warning',
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, challengeWindowSeconds),
    sequencerFailure: RISK_VIEW.SEQUENCER_SELF_SEQUENCE(selfSequencingDelay),
    proposerFailure:
      RISK_VIEW.PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED(validatorAfkTime),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
  }),
  technology: {
    stateCorrectness: {
      name: 'Fraud proofs ensure state correctness',
      description:
        'After some period of time, the published state root is assumed to be correct. For a certain time period, one of the whitelisted actors can submit a fraud proof that shows that the state was incorrect. The challenge protocol can be subject to delay attacks.',
      risks: [
        {
          category: 'Funds can be stolen if',
          text: 'none of the whitelisted verifiers checks the published state. Fraud proofs assume at least one honest and able validator.',
          isCritical: true,
        },
      ],
      references: [
        {
          text: 'How is fraud proven - Arbitrum documentation FAQ',
          href: 'https://developer.offchainlabs.com/intro/#q-and-how-exactly-is-fraud-proven-sounds-complicated',
        },
        {
          text: 'Arbitrum Glossary: Challenge Period',
          href: 'https://developer.arbitrum.io/intro/glossary#challenge-period',
        },
        {
          text: 'RollupUser.sol - Etherscan source code, onlyValidator modifier',
          href: 'https://etherscan.io/address/0x660ea1675F7323dC3Ba0c8dDFB593225Eb01E3C1',
        },
        {
          text: 'Solutions to Delay Attacks on Rollups',
          href: 'https://medium.com/offchainlabs/solutions-to-delay-attacks-on-rollups-434f9d05a07a',
        },
      ],
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
      references: [
        {
          text: 'Sequencing followed by deterministic execution - Arbitrum documentation',
          href: 'https://developer.offchainlabs.com/inside-arbitrum-nitro/#sequencing-followed-by-deterministic-execution',
        },
        {
          text: 'SequencerInbox.sol - Etherscan source code, addSequencerL2BatchFromOrigin function',
          href: 'https://etherscan.io/address/0x873484Ba63353C8b71210ce123B465512d408B27',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_SEQUENCER,
      references: [
        {
          text: 'Sequencer - Arbitrum documentation',
          href: 'https://developer.offchainlabs.com/sequencer',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.CANONICAL_ORDERING,
      description:
        FORCE_TRANSACTIONS.CANONICAL_ORDERING.description +
        ' ' +
        VALUES.ARBITRUM.getProposerFailureString(validatorAfkBlocks),
      references: [
        {
          text: 'SequencerInbox.sol#L125 - Etherscan source code, forceInclusion function',
          href: 'https://etherscan.io/address/0xD03bFe2CE83632F4E618a97299cc91B1335BB2d9#code#F1#L125',
        },
        {
          text: 'Sequencer Isn’t Doing Its Job - Arbitrum documentation',
          href: 'https://developer.offchainlabs.com/sequencer#unhappyuncommon-case-sequencer-isnt-doing-its-job',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('optimistic', 'merkle proof'),
        references: [
          {
            text: 'Transaction lifecycle - Arbitrum documentation',
            href: 'https://developer.offchainlabs.com/tx-lifecycle',
          },
          {
            text: 'L2 to L1 Messages - Arbitrum documentation',
            href: 'https://developer.offchainlabs.com/arbos/l2-to-l1-messaging',
          },
          {
            text: 'Mainnet for everyone - Arbitrum Blog',
            href: 'https://offchain.medium.com/mainnet-for-everyone-27ce0f67c85e',
          },
        ],
        risks: [],
      },
      {
        name: 'Tradeable Bridge Exit',
        description:
          "When a user initiates a regular withdrawal a third party verifying the chain can offer to buy this withdrawal by paying the user on L1. The user will get the funds immediately, however the third party has to wait for the block to be finalized. This is implemented as a first party functionality inside Arbitrum's token bridge.",
        risks: [],
        references: [
          {
            text: 'Tradeable Bridge Exits - Arbitrum documentation',
            href: 'https://developer.offchainlabs.com/docs/withdrawals#tradeable-bridge-exits',
          },
        ],
      },
      EXITS.AUTONOMOUS,
    ],
    smartContracts: {
      name: 'EVM compatible smart contracts are supported',
      description:
        'The project uses Nitro technology that allows running fraud proofs by executing EVM code on top of WASM.',
      risks: [
        {
          category: 'Funds can be lost if',
          text: 'there are mistakes in the highly complex Nitro and WASM one-step prover implementation.',
        },
      ],
      references: [
        {
          text: 'Inside Arbitrum Nitro',
          href: 'https://developer.offchainlabs.com/inside-arbitrum-nitro/',
        },
      ],
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x5a961c7D162195a9Dc5a357Cc168b0694283382E'),
        tokens: ['ETH'],
        description:
          'Contract managing Inboxes and Outboxes. It escrows ETH sent to L2.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x6Eb9240d4add111D5Fc81b10Ff12eECabcf9752d'),
        tokens: '*',
        description:
          'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xa1c86E2362dba0525075622af6d5f739B1304D45'),
        tokens: '*',
        description:
          'Main entry point for users depositing ERC20 tokens that require minting custom token on L2.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x150286BdbE7C8Cd23D41a8e1e64438e0dc04dc3d'),
        tokens: ['WETH'],
        description: 'Escrow for WETH sent to L2.',
      }),
    ],
  },
  permissions: [
    discovery.contractAsPermissioned(
      discovery.getContract('ProxyAdmin'),
      'Contract owned by the UpgradeExecutor and admin of Inbox, L1WETHGateway, ChallengeManager, Bridge, L1GatewayRouter, L1ERC20Gateway, L1CustomGateway, SequencerInbox, Outbox and UpgradeExecutor proxies.',
    ),
    ...discovery.getMultisigPermission(
      'OwnerMultisig',
      'Multisig that can execute upgrades via the UpgradeExecutor.',
    ),
    {
      name: 'RollupOwner',
      accounts: [EOAExecutor],
      description: 'EOA that can execute upgrades via the UpgradeExecutor.',
    },
    {
      name: 'Validators/Proposers',
      accounts: discovery.getPermissionedAccounts('RollupProxy', 'validators'),
      description:
        'They can submit new state roots and challenge state roots. Some of the operators perform their duties through special purpose smart contracts.',
    },
    {
      name: 'Sequencers',
      accounts: discovery.getPermissionedAccounts(
        'SequencerInbox',
        'batchPosters',
      ),
      description:
        'Central actors allowed to submit transaction batches to L1.',
    },
  ],
  contracts: {
    addresses: [
      discovery.getContractDetails('RollupProxy', {
        description:
          'Main contract implementing Arbitrum One Rollup. Manages other Rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.',
      }),
      discovery.getContractDetails('Bridge', {
        description:
          'Contract managing Inboxes and Outboxes. It escrows ETH sent to L2.',
      }),
      discovery.getContractDetails('SequencerInbox', {
        description:
          'Main entry point for the Sequencer submitting transaction batches.',
      }),
      discovery.getContractDetails('Inbox', {
        description:
          'Entry point for users depositing ETH and sending L1 -> L2 messages.',
      }),
      discovery.getContractDetails('Outbox', {
        description:
          'Contract that allows L2->L1 calls, i.e. messages initiated on L2 which eventually resolve in execution on L1.',
      }),
      discovery.getContractDetails('L1GatewayRouter', {
        description: 'Router managing token <--> gateway mapping.',
      }),
      discovery.getContractDetails('UpgradeExecutor', {
        description: 'Contract allowed to upgrade the system.',
      }),
      discovery.getContractDetails('ChallengeManager', {
        description:
          'Contract that allows challenging invalid state roots. Can be called through the RollupProxy.',
      }),
      discovery.getContractDetails('OneStepProofEntry', {
        description: 'Contract used to perform the last step of a fraud proof.',
      }),
      discovery.getContractDetails('OneStepProverMemory'),
      discovery.getContractDetails('OneStepProverMath'),
      discovery.getContractDetails('OneStepProverHostIo'),
      discovery.getContractDetails('OneStepProver0'),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  milestones: [
    {
      name: 'Parallel Mainnet closed launch',
      link: 'https://twitter.com/ParallelFi/status/1743048283684237574',
      date: '2024-01-05T00:00:00Z',
      description: 'Parallel Mainnet is open for developers.',
    },
  ],
  knowledgeNuggets: [],
}
