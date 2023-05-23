import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { VALUES } from '../discovery/values'
import { formatSeconds } from '../utils/formatSeconds'
import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  MILESTONES,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
} from './common'
import { UPGRADE_MECHANISM } from './common/upgradeMechanism'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('arbitrum')
const assumedBlockTime = 12 // seconds, different from RollupUserLogic.sol#L35 which assumes 13.2 seconds
const validatorAfkBlocks = discovery.getContractValue<number>(
  'RollupProxy',
  'VALIDATOR_AFK_BLOCKS',
)
const validatorAfkTime = validatorAfkBlocks * assumedBlockTime
const challengeWindow = discovery.getContractValue<number>(
  'RollupProxy',
  'confirmPeriodBlocks',
)
const l1TimelockDelay = discovery.getContractValue<number>(
  'L1ArbitrumTimelock',
  'getMinDelay',
)
const l2TimelockDelay = 259200 // 3 days, got from https://arbiscan.io/address/0x34d45e99f7D8c45ed05B5cA72D54bbD1fb3F98f0#readProxyContract
const totalDelay =
  l1TimelockDelay + challengeWindow * assumedBlockTime + l2TimelockDelay

export const arbitrum: Layer2 = {
  type: 'layer2',
  id: ProjectId('arbitrum'),
  display: {
    name: 'Arbitrum One',
    slug: 'arbitrum',
    warning:
      'Fraud proof system is fully deployed but is not yet permissionless as it requires Validators to be whitelisted.',
    description: `Arbitrum One is an Optimistic Rollup that aims to feel exactly like interacting with Ethereum, but with transactions costing a fraction of what they do on L1.\
      Centralized Sequencer receives users' transactions and regularly sends the transaction batch to mainnet Ethereum. Independent Validators (currently whitelisted)\
      read transaction batches from L1, execute them and submit a resulting L2 state root to L1. Any other Validator can challenge the state root within the challenge window (${formatSeconds(
        challengeWindow * assumedBlockTime,
      )}). \
      The challenge will result in an interactive fraud proof game that will be eventually settled by L1. As long as there is at least one honest Validator, users are guaranteed that\
      eventually correct L2 state root will be published to L1. If Sequencer is censoring users transactions, it is possible to force the transaction via L1 queue. If no Validator publishes\
    L2 state root within ${formatSeconds(
      validatorAfkTime,
    )} (${validatorAfkBlocks} blocks), the Validator whitelist is dropped and anyone can take over as a new Validator.`,
    purpose: 'Universal',
    links: {
      websites: ['https://arbitrum.io/', 'https://arbitrum.foundation/'],
      apps: [],
      documentation: ['https://developer.arbitrum.io/'],
      explorers: ['https://arbiscan.io', 'https://explorer.arbitrum.io/'],
      repositories: [
        'https://github.com/ArbitrumFoundation/docs',
        'https://github.com/ArbitrumFoundation/governance',
        'https://github.com/OffchainLabs/arbitrum',
        'https://github.com/OffchainLabs/nitro',
        'https://github.com/OffchainLabs/arb-os',
      ],
      socialMedia: [
        'https://twitter.com/arbitrum',
        'https://arbitrumfoundation.medium.com/',
        'https://discord.gg/Arbitrum',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  config: {
    associatedTokens: ['ARB'],
    nativeL2TokensIncludedInTVL: ['ARB'],
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a'),
        sinceTimestamp: new UnixTime(1661450734),
        tokens: ['ETH'],
        description:
          'Contract managing Inboxes and Outboxes. It escrows ETH sent to L2.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xcEe284F754E854890e311e3280b767F80797180d'),
        sinceTimestamp: new UnixTime(1623867835),
        tokens: '*',
        description:
          'Main entry point for users depositing ERC20 tokens that require minting custom token on L2.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xa3A7B6F88361F48403514059F1F16C8E78d60EeC'),
        sinceTimestamp: new UnixTime(1623784100),
        tokens: '*',
        description:
          'Main entry point for users depositing ERC20 tokens. Upon depositing, on L2 a generic, "wrapped" token will be minted.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xA10c7CE4b876998858b1a9E12b10092229539400'),
        sinceTimestamp: new UnixTime(1632133470),
        tokens: ['DAI'],
        description:
          'DAI Vault for custom DAI Gateway. Fully controlled by MakerDAO governance.',
      }),
      {
        // This bridge is inactive, but we keep it
        // in case we have to gather historic data
        address: VALUES.ARBITRUM.OLD_BRIDGE,
        sinceTimestamp: new UnixTime(1622243344),
        tokens: ['ETH'],
        isHistorical: true,
        newVersion: true,
      },
    ],
    transactionApi: {
      type: 'rpc',
      // We need to subtract the Nitro system transactions
      // after the block of the update
      assessCount: (count: number, blockNumber: number) =>
        blockNumber >= 22207818 ? count - 1 : count,
      startBlock: 1,
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: {
      value: 'Fraud proofs (INT)',
      description:
        'Fraud proofs allow WHITELISTED actors watching the chain to prove that the state is incorrect. Interactive proofs (INT) require multiple transactions over time to resolve.',
      sentiment: 'warning',
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    upgradeability: RISK_VIEW.UPGRADABLE_ARBITRUM(totalDelay),
    sequencerFailure: {
      value: 'Transact using L1',
      description: VALUES.ARBITRUM.getSequencerFailureString(),
      references: [
        'https://etherscan.io/address/0xD03bFe2CE83632F4E618a97299cc91B1335BB2d9#code#F1#L125',
        'https://developer.arbitrum.io/sequencer',
      ],
      contracts: ['SequencerInbox'],
    },
    validatorFailure: {
      value: 'Propose blocks',
      description:
        VALUES.ARBITRUM.getValidatorFailureString(validatorAfkBlocks),
      references: [
        'https://etherscan.io/address/0xA0Ed0562629D45B88A34a342f20dEb58c46C15ff#code#F61#L55',
      ],
      contracts: ['RollupProxy'],
    },
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
  }),
  technology: {
    category: 'Optimistic Rollup',
    stateCorrectness: {
      name: 'Fraud proofs ensure state correctness',
      description:
        'After some period of time, the published state root is assumed to be correct. For a certain time period, one of the whitelisted actors can submit a fraud proof that shows that the state was incorrect.',
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
          text: 'RollupUser.sol#L288 - Etherscan source code, onlyValidator modifier',
          href: 'https://etherscan.io/address/0xA0Ed0562629D45B88A34a342f20dEb58c46C15ff#code#F61#L288',
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
        VALUES.ARBITRUM.getValidatorFailureString(validatorAfkBlocks),
      references: [
        {
          text: 'Smart Contract source code',
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
    upgradeMechanism: UPGRADE_MECHANISM.ARBITRUM_DAO(
      l1TimelockDelay,
      challengeWindow * assumedBlockTime,
      l2TimelockDelay,
    ),
  },
  permissions: [
    ...discovery.getGnosisSafeDetails(
      'SecurityCouncil',
      'The admin of all contracts in the system, capable of issuing upgrades without notice and delay. This allows it to censor transactions, upgrade bridge implementation potentially gaining access to all funds stored in a bridge and change the sequencer or any other system component (unlimited upgrade power). It is also the admin of the special purpose smart contracts used by validators.',
    ),
    discovery.contractAsPermissioned(
      discovery.getContract('ArbitrumProxyAdmin'),
      'This contract is an admin of SequencerInbox, RollupEventInbox, Bridge, Outbox, Inbox and ChallengeManager contracts. It is owned by the Upgrade Executor.',
    ),
    discovery.contractAsPermissioned(
      discovery.getContractFromUpgradeability('UpgradeExecutor', 'admin'),
      'This contract is an admin of the Update Executor contract, but is also owned by it.',
    ),
    discovery.contractAsPermissioned(
      discovery.getContractFromUpgradeability('L1GatewayRouter', 'admin'),
      'This is yet another proxy admin for the three gateway contracts. It is owned by the Upgrade Executor.',
    ),
    {
      name: 'Sequencer',
      accounts: VALUES.ARBITRUM.SEQUENCER,
      description:
        'Central actor allowed to set the order in which L2 transactions are executed.',
    },
    {
      name: 'Validators',
      accounts: VALUES.ARBITRUM.VALIDATORS,
      description:
        'They can submit new state roots and challenge state roots. Some of the validators perform their duties through special purpose smart contracts.',
    },
  ],
  contracts: {
    addresses: [
      discovery.getMainContractDetails(
        'RollupProxy',
        'Main contract implementing Arbitrum One Rollup. Manages other Rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.',
      ),
      discovery.getMainContractDetails(
        'ArbitrumOneBridge',
        'Contract managing Inboxes and Outboxes. It escrows ETH sent to L2.',
      ),
      discovery.getMainContractDetails(
        'SequencerInbox',
        'Main entry point for the Sequencer submitting transaction batches to a Rollup.',
      ),
      discovery.getMainContractDetails(
        'Inbox',
        'Entry point for users depositing ETH and sending L1 --> L2 messages. Deposited ETH is escrowed in a Bridge contract.',
      ),
      discovery.getContractFromValue(
        'RollupProxy',
        'outbox',
        "Arbitrum's Outbox system allows for arbitrary L2 to L1 contract calls; i.e., messages initiated from L2 which eventually resolve in execution on L1.",
      ),
      discovery.getMainContractDetails(
        'UpgradeExecutor',
        "This contract can upgrade the system's contracts. The upgrades can be done either by the Security Council or by the L1ArbitrumTimelock.",
      ),
      discovery.getMainContractDetails(
        'L1ArbitrumTimelock',
        'Timelock contract for Arbitrum DAO Governance. It gives the DAO participants the ability to upgrade the system. Only the L2 counterpart of this contract can execute the upgrades.',
      ),
      discovery.getMainContractDetails(
        'L1GatewayRouter',
        'Router managing token <--> gateway mapping.',
      ),
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  milestones: [
    {
      name: 'ARB token airdrop',
      link: 'https://twitter.com/arbitrum/status/1638888588443111425',
      date: '2023-03-23T00:00:00Z',
      description: 'ARB token launched as a governance token for Arbitrum DAO.',
    },
    {
      name: 'Nitro Upgrade',
      link: 'https://medium.com/offchainlabs/arbitrum-nitro-one-small-step-for-l2-one-giant-leap-for-ethereum-bc9108047450',
      date: '2022-08-31T00:00:00Z',
      description:
        'Upgrade is live, introducing new architecture, increased throughput and lower fees.',
    },
    {
      name: 'Odyssey paused',
      link: 'https://twitter.com/arbitrum/status/1542159109511847937',
      date: '2022-06-29T00:00:00Z',
      description:
        'Due of the heavy load being put on the chain, Odyssey program got paused.',
    },
    {
      name: 'Odyssey started',
      link: 'https://twitter.com/arbitrum/status/1539292126105706496',
      date: '2022-06-21T00:00:00Z',
      description: 'Incentives program to onboard new users has started.',
    },
    {
      ...MILESTONES.MAINNET_OPEN,
      link: 'https://twitter.com/arbitrum/status/1432817424752128008',
      date: '2021-08-31T00:00:00Z',
    },
  ],
  maturity: {
    category: {
      score: 'B',
      requirements: ['There is an existing fraud proof system'],
    },
    modifier: {
      score: '-',
      items: ['Validators are behind a whitelist'],
    },
    thingsToImprove: {
      improvedScore: 'A',
      requirements: ['There should be no instant upgradeability'],
    },
  },
  knowledgeNuggets: [
    {
      title: 'Arbitrum update boosts decentralization',
      url: 'https://twitter.com/bkiepuszewski/status/1594754717330309120',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
    },
    {
      title: 'Arbitrum is down... or is it?',
      url: 'https://twitter.com/bkiepuszewski/status/1438445910191710211',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_04,
    },
  ],
}
