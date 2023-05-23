import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { delayDescriptionFromSeconds } from '../utils/delayDescription'
import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('dydx')
const delaySeconds = discovery.getContractValue<number>(
  'PriorityExecutor',
  'getDelay',
)
const freezeGracePeriod = discovery.getContractValue<number>(
  'StarkPerpetual',
  'FREEZE_GRACE_PERIOD',
)

export const dydx: Layer2 = {
  type: 'layer2',
  id: ProjectId('dydx'),
  display: {
    name: 'dYdX',
    slug: 'dydx',
    description:
      'dYdX aims to build a powerful and professional exchange for trading crypto assets where users can truly own their trades and, eventually, the exchange itself.',
    purpose: 'Exchange',
    links: {
      websites: ['https://dydx.exchange/'],
      apps: [
        'https://trade.dydx.exchange/',
        'https://margin.dydx.exchange/',
        'https://dydx.l2beat.com',
      ],
      documentation: [
        'https://docs.starkware.co/starkex/',
        'https://docs.dydx.exchange/',
      ],
      explorers: ['https://dydx.l2beat.com'],
      repositories: [
        'https://github.com/starkware-libs/starkex-contracts',
        'https://github.com/dydxprotocol/',
      ],
      socialMedia: [
        'https://dydx.exchange/blog',
        'https://twitter.com/dYdX',
        'https://discord.gg/Tuze6tY',
        'https://youtube.com/c/dydxprotocol',
        'https://reddit.com/r/dydxprotocol/',
        'https://linkedin.com/company/dydx',
      ],
    },
    activityDataSource: 'Closed API',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xD54f502e184B6B739d7D27a6410a67dc462D69c8'),
        sinceTimestamp: new UnixTime(1613033682),
        tokens: ['USDC'],
      }),
    ],
    transactionApi: {
      type: 'starkex',
      product: 'dydx',
      sinceTimestamp: new UnixTime(1613033682),
      resyncLastDays: 7,
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_ST,
      references: [
        'https://etherscan.io/address/0xdf9c117cad37f2ed8c99e36a40317d8cc340d4a0#code#F35#L125',
      ],
    },
    dataAvailability: {
      ...RISK_VIEW.DATA_ON_CHAIN,
      references: [
        'https://etherscan.io/address/0xdf9c117cad37f2ed8c99e36a40317d8cc340d4a0#code#F35#L82',
      ],
    },
    upgradeability: RISK_VIEW.UPGRADE_DELAY_SECONDS(delaySeconds),
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_STARKEX_PERPETUAL(freezeGracePeriod),
      references: [
        'https://etherscan.io/address/0xc43f5526124877f9125e3b48101dca6d7c6b4ea3#code#F4#L46',
      ],
    },
    validatorFailure: {
      ...RISK_VIEW.VALIDATOR_ESCAPE_STARKEX_PERPETUAL,
      references: [
        'https://etherscan.io/address/0xc43f5526124877f9125e3b48101dca6d7c6b4ea3#code#F6#L32',
      ],
    },
    destinationToken: RISK_VIEW.CANONICAL_USDC,
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {
    provider: 'StarkEx',
    category: 'ZK Rollup',
    stateCorrectness: {
      ...STATE_CORRECTNESS.STARKEX_VALIDITY_PROOFS,
      references: [
        ...STATE_CORRECTNESS.STARKEX_VALIDITY_PROOFS.references,
        {
          text: 'UpdatePerpetualState.sol#L125 - Etherscan source code, verifyFact function call',
          href: 'https://etherscan.io/address/0xdf9c117cad37f2ed8c99e36a40317d8cc340d4a0#code#F35#L125',
        },
      ],
    },
    newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
    dataAvailability: {
      ...DATA_AVAILABILITY.STARKEX_ON_CHAIN,
      references: [
        ...DATA_AVAILABILITY.STARKEX_ON_CHAIN.references,
        {
          text: 'UpdatePerpetualState.sol#L82 - Etherscan source code, updateState function',
          href: 'https://etherscan.io/address/0xdf9c117cad37f2ed8c99e36a40317d8cc340d4a0#code#F35#L82',
        },
      ],
    },
    operator: {
      ...OPERATOR.STARKEX_OPERATOR,
      references: [
        ...OPERATOR.STARKEX_OPERATOR.references,
        {
          text: 'Operator.sol#L42 - Etherscan source code, onlyOperator modifier',
          href: 'https://etherscan.io/address/0xdf9c117cad37f2ed8c99e36a40317d8cc340d4a0#code#F26#L42',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.STARKEX_PERPETUAL_WITHDRAW(freezeGracePeriod),
      references: [
        ...FORCE_TRANSACTIONS.STARKEX_PERPETUAL_WITHDRAW(freezeGracePeriod)
          .references,
        {
          text: 'ForcedTrades.sol#L46 - Etherscan source code, forcedTradeRequest function',
          href: 'https://etherscan.io/address/0xc43f5526124877f9125e3b48101dca6d7c6b4ea3#code#F4#L46',
        },
        {
          text: 'ForcedWithdrawals.sol#L32 - Etherscan source code, forcedWithdrawalRequest function',
          href: 'https://etherscan.io/address/0xc43f5526124877f9125e3b48101dca6d7c6b4ea3#code#F6#L32',
        },
      ],
    },
    exitMechanisms: EXITS.STARKEX_PERPETUAL,
  },
  contracts: {
    addresses: [
      discovery.getMainContractDetails(
        'StarkPerpetual',
        'Main contract of dYdX exchange. Updates dYdX state and verifies its integrity using STARK Verifier. Allows users to deposit and withdraw tokens via normal and emergency modes.',
      ),
      discovery.getMainContractDetails(
        'GpsStatementVerifier',
        'STARK Verifier. In contrast to other StarkWare systems which use common SHARP Prover, dYdX uses separate Prover/Verifier.',
      ),
      {
        name: 'MemoryPageFactRegistry',
        description:
          'Contract storing CAIRO Program Output, in case of dYdX, it stores state diffs of dYdX Exchange.',
        address: EthereumAddress('0xEfbCcE4659db72eC6897F46783303708cf9ACef8'),
      },
      {
        name: 'FriStatementContract',
        description: 'Part of STARK Verifier.',
        address: EthereumAddress('0xf6b83CcaDeee478FC372AF6ca7069b14FBc5E1B1'),
      },
      {
        name: 'MerkleStatementContract',
        description: 'Part of STARK Verifier.',
        address: EthereumAddress('0x0d62bac5c346c78DC1b27107CAbC5F4DE057a830'),
      },
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_SECONDS_RISK(delaySeconds)],
  },
  permissions: [
    {
      name: 'dYdX Governance',
      accounts: [
        {
          address: EthereumAddress(
            discovery.getContractValue<string>('PriorityExecutor', 'getAdmin'),
          ),
          type: 'Contract',
        },
      ],
      description:
        'Defines rules of governance via the dYdX token. Can upgrade implementation of the rollup, potentially gaining access to all funds stored in the bridge. ' +
        delayDescriptionFromSeconds(delaySeconds),
    },
    {
      name: 'Operators',
      accounts: discovery.getPermissionedAccountsList(
        'StarkPerpetual',
        'OPERATORS',
      ),
      description:
        'Allowed to update state of the rollup. When Operator is down the state cannot be updated.',
    },
  ],
  milestones: [
    {
      name: 'Public launch',
      link: 'https://dydx.exchange/blog/public',
      date: '2021-04-06T00:00:00Z',
      description:
        'Layer 2 cross-margined Perpetuals are now live in production for all traders.',
    },
    {
      name: 'dYdX Foundation',
      link: 'https://dydx.exchange/blog/introducing-dydx-foundation',
      date: '2021-08-03T00:00:00Z',
      description:
        'Independent foundation was created to participate in the Protocol governance.',
    },
    {
      name: 'dYdX v4 announcement',
      link: 'https://dydx.exchange/blog/dydx-chain',
      date: '2022-06-22T00:00:00Z',
      description:
        'dYdX V4 will be developed as a standalone blockchain based on the Cosmos SDK.',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'How does escape hatch work?',
      url: 'https://twitter.com/bkiepuszewski/status/1469201939049103360',
      thumbnail: NUGGETS.THUMBNAILS.L2BEAT_03,
    },
    ...NUGGETS.STARKWARE,
  ],
}
