import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  SHARP_VERIFIER_CONTRACT,
  STATE_CORRECTNESS,
} from './common'
import { Layer2 } from './types'

export const layer2financezk: Layer2 = {
  type: 'layer2',
  id: ProjectId('layer2financezk'),
  display: {
    name: 'Layer2.Finance-zk',
    slug: 'layer2financezk',
    description:
      'Celer’s Layer2.finance in ZK Proofs Mode Built with StarkEx from StarkWare.',
    purpose: 'DeFi protocols',
    links: {
      websites: ['https://layer2.finance/'],
      apps: ['https://zk.layer2.finance'],
      documentation: [],
      explorers: [],
      repositories: [
        'https://github.com/starkware-libs/starkex-contracts',
        'https://github.com/celer-network/defi-pooling-broker-contracts',
      ],
      socialMedia: [
        'https://discord.gg/uGx4fjQ',
        'https://t.me/celernetwork',
        'https://twitter.com/CelerNetwork',
      ],
    },
  },
  config: {
    escrows: [
      {
        address: '0x82123571C8a5e0910280C066bc634c4945FFcbC8',
        sinceTimestamp: new UnixTime(1645130774),
        tokens: ['ETH', 'USDC', 'USDT'],
      },
      {
        address: '0x8581cd55ff53F1F85A237fa9D60E72a79f0973b6',
        sinceTimestamp: new UnixTime(1648621885),
        tokens: ['cETH'],
      },
      {
        address: '0x4455E4435Cf7e6B6A4Df17bEAE1A413ef3663B90',
        sinceTimestamp: new UnixTime(1647862894),
        tokens: ['cETH'],
      },
      {
        address: '0x3F3b821243E5664822c0babBA2B4f37bf294e7a0',
        sinceTimestamp: new UnixTime(1648621976),
        tokens: ['cUSDC'],
      },
    ],
    events: [
      {
        name: 'LogStateTransitionFact',
        abi: ' event LogStateTransitionFact(bytes32 stateTransitionFact)',
        emitter: EthereumAddress('0x82123571C8a5e0910280C066bc634c4945FFcbC8'),
        type: 'state',
        sinceTimestamp: new UnixTime(1645130774),
      },
    ],
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_ST,
    dataAvailability: RISK_VIEW.DATA_EXTERNAL_DAC,
    upgradeability: RISK_VIEW.UPGRADABLE_YES,
    sequencerFailure: RISK_VIEW.SEQUENCER_STARKEX_SPOT,
    validatorFailure: RISK_VIEW.VALIDATOR_ESCAPE_MP,
    destinationToken: RISK_VIEW.CANONICAL,
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {
    provider: 'StarkEx',
    category: 'Validium',
    stateCorrectness: STATE_CORRECTNESS.STARKEX_VALIDITY_PROOFS,
    newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
    dataAvailability: DATA_AVAILABILITY.STARKEX_OFF_CHAIN,
    operator: OPERATOR.STARKEX_OPERATOR,
    forceTransactions: FORCE_TRANSACTIONS.STARKEX_SPOT_WITHDRAW,
    exitMechanisms: EXITS.STARKEX,
  },
  contracts: {
    addresses: [
      {
        name: 'StarkExchange',
        address: '0x82123571C8a5e0910280C066bc634c4945FFcbC8',
        upgradeability: {
          type: 'StarkWare',
          implementation: '0x4EDD62189732e9fF476ABa880b48c29432A7AC9B',
          upgradeDelay: 0,
          isFinal: false,
        },
      },
      {
        name: 'Committee',
        address: '0xF000A3B10e1920aDC6e7D829828e3357Fc5128A9',
      },
      SHARP_VERIFIER_CONTRACT,
      {
        name: 'Broker',
        description:
          'Broker manages investment strategies on L1 for tokens deposited to the system. Strategies invest in specific protocols, e.g. Compound and they escrow LP tokens as custom Wrapped tokens.',
        address: '0xe7c753895d492f8D4B06a2A1B16c1aEF2A7d16E5',
      },
      {
        name: 'StrategyCompound',
        description:
          'It is through this contract that groups of users interact with the Compound DeFi protocol.',
        address: '0x5b000954F70B0410685193B0afd3074B744B5C97',
      },
      {
        name: 'GpsFactRegistryAdapter',
        address: '0x6e3AbCE72A3CD5edc05E59283c733Fd4bF8B3baE',
      },
      {
        name: 'GpsStatementVerifier',
        address: '0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60',
        upgradeability: {
          type: 'StarkWare',
          implementation: '0xD4C4044ACa68ebBcB81B13cC2699e1Bca2d3F458',
          upgradeDelay: 2419200,
          callImplementation: '0x522B2871c3918B92c165115d862e50e440905068',
          isFinal: true,
        },
      },
      {
        name: 'OrderRegistry',
        address: '0x518c4A79a1102eEDc987005CA8cE6B87Ca14dDf8',
      },
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    {
      name: 'Governor',
      accounts: [
        {
          address: '0x1E153596BceB29c6EAE88DDB290eBeCC3FE9735e',
          type: 'EOA',
        },
      ],
      description:
        'Can upgrade implementation of the system, potentially gaining access to all funds stored in the bridge. Currently there is no delay before the upgrade, so the users will not have time to migrate.',
    },
    {
      name: 'Data Availability Committee',
      accounts: [],
      description:
        'There exists a Data Availability Committee with unknown members and an unverified smart contract.',
    },
    {
      name: 'SHARP Verifier Governor',
      accounts: [
        {
          address: '0x3DE55343499f59CEB3f1dE47F2Cd7Eab28F2F5C6',
          type: 'EOA',
        },
      ],
      description:
        'Can upgrade implementation of SHARP Verifier, potentially with code approving fraudulent state. Currently there is no delay before the upgrade, so the users will not have time to migrate.',
    },
    {
      name: 'Broker Owner',
      accounts: [
        {
          address: '0xe0b79Cf6311E72caF7D31a552BFec67841Dd5988',
          type: 'EOA',
        },
      ],
      description:
        'Most Broker functionality is restricted only for the owner, it includes managing rides, setting prices or slippages, burning shares.',
    },
    {
      name: 'Operator',
      accounts: [
        {
          address: '0x85A732d8e21f1890BdeA4eDddCf4Dd0E70a31EA5',
          type: 'EOA',
        },
      ],
      description:
        'Allowed to update state of the system. When Operator is down the state cannot be updated.',
    },
  ],
}
