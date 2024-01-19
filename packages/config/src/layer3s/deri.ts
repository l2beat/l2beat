import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'

import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  OPERATOR,
  ScalingProjectPermissionedAccount,
} from '../common'
import { RISK_VIEW } from '../common/riskView'
import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { VALUES } from '../discovery/values'
import { Layer3 } from './types'

const discovery = new ProjectDiscovery('deri', 'arbitrum')

const roles = discovery.getContractValue<{
  EXECUTOR_ROLE: { members: string[] }
}>('UpgradeExecutor', 'accessControl')

const EOAExecutor: ScalingProjectPermissionedAccount = {
  address: EthereumAddress(roles.EXECUTOR_ROLE.members[0]),
  type: 'EOA',
}

const assumedBlockTime = 12 // seconds, different from RollupUserLogic.sol#L35 which assumes 13.2 seconds
const validatorAfkBlocks = discovery.getContractValue<number>(
  'RollupProxy',
  'VALIDATOR_AFK_BLOCKS',
)
const validatorAfkTime = validatorAfkBlocks * assumedBlockTime

const maxTimeVariation = discovery.getContractValue<number[]>(
  'SequencerInbox',
  'maxTimeVariation',
)
const selfSequencingDelay = maxTimeVariation[2]

export const deri: Layer3 = {
  type: 'layer3',
  id: ProjectId('deri'),
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Deri',
    slug: 'deri',
    description:
      'Deri is an Ethereum Layer-3 that leverages Arbitrum Nitro to enable efficient cross-chain futures, options, and derivatives.',
    purposes: ['DeFi'],
    category: 'Optimistic Rollup',
    provider: 'Arbitrum Orbit',
    dataAvailabilityMode: 'NotApplicable',
    links: {
      websites: ['https://deri.io/'],
      apps: [],
      documentation: ['https://docs.deri.io/'],
      explorers: ['https://explorer-dchain.deri.io/'],
      repositories: ['https://github.com/OffchainLabs/nitro'],
      socialMedia: [
        'https://twitter.com/DeriProtocol',
        'https://t.me/DeriProtocol',
        'https://discord.com/invite/kb8ZbYgp8M',
      ],
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        // Bridge
        address: EthereumAddress('0xD4FE46D2533E7d03382ac6cACF0547F336e59DC0'),
        tokens: ['ETH'],
        description:
          'Contract managing Inboxes and Outboxes. It escrows ETH sent to L2.',
      }),
    ],
  },
  riskView: makeBridgeCompatible({
    stateValidation: {
      value: 'Fraud proofs (INT)',
      description:
        'Fraud proofs allow WHITELISTED actors watching the chain to prove that the state is incorrect. Interactive proofs (INT) require multiple transactions over time to resolve. The challenge protocol can be subject to delay attacks.',
      sentiment: 'warning',
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN_L2,
    exitWindow: RISK_VIEW.EXIT_WINDOW(0, selfSequencingDelay),
    sequencerFailure: RISK_VIEW.SEQUENCER_SELF_SEQUENCE(selfSequencingDelay),
    proposerFailure:
      RISK_VIEW.PROPOSER_SELF_PROPOSE_WHITELIST_DROPPED(validatorAfkTime),
    validatedBy: RISK_VIEW.VALIDATED_BY_L2('Arbitrum'),
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
          href: 'https://arbiscan.io/address/0x0aE4dD666748bF0F6dB5c149Eab1D8aD27820A6A#code',
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
          text: 'SequencerInbox.sol#206 - Etherscan source code, addSequencerL2BatchFromOrigin function',
          href: 'https://etherscan.io/address/0xD03bFe2CE83632F4E618a97299cc91B1335BB2d9#code#F1#L206',
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
          text: 'SequencerInbox.sol - Etherscan source code, forceInclusion function',
          href: 'https://arbiscan.io/address/0x1c6ACCd9d66f3B993928E7439c9A2d67b94a445F#code',
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
        'Arbitrum One uses Nitro technology that allows running fraud proofs by executing EVM code on top of WASM.',
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
  permissions: [
    discovery.contractAsPermissioned(
      discovery.getContract('ProxyAdmin'),
      'Contract owned by the UpgradeExecutor and admin of UpgradeExecutor, L1ERC20Gateway, L1CustomGateway, L1GatewayRouter, ChallengeManager, Outbox, Bridge, SequencerInbox and Inbox proxies.',
    ),
    {
      name: 'OwnerEOA',
      accounts: [EOAExecutor],
      description: 'EOA that can execute upgrade via the UpgradeExecutor.',
    },
    // TODO: add Sequencers and Proposers
  ],
  contracts: {
    addresses: [
      discovery.getContractDetails('UpgradeExecutor', {
        description: 'Contract allowed to upgrade the system.',
      }),
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
  milestones: [],
  knowledgeNuggets: [],
}
