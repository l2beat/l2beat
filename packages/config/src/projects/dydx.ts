import { ProjectId, UnixTime } from '@l2beat/common'

import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { Project } from './types'

export const dydx: Project = {
  name: 'dYdX',
  slug: 'dydx',
  id: ProjectId('dydx'),
  bridges: [
    {
      address: '0xD54f502e184B6B739d7D27a6410a67dc462D69c8',
      sinceTimestamp: new UnixTime(1613033682),
      tokens: ['USDC'],
    },
  ],
  details: {
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
        'https://docs.starkware.co/starkex-docs-v2/',
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
    provider: 'StarkEx',
    riskView: {
      stateValidation: RISK_VIEW.STATE_ZKP_ST,
      dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
      upgradeability: RISK_VIEW.UPGRADABLE_YES,
      sequencerFailure: RISK_VIEW.SEQUENCER_STARKEX_PERPETUAL,
      validatorFailure: RISK_VIEW.VALIDATOR_ESCAPE_STARKEX_PERPETUAL,
    },
    technology: {
      category: {
        name: 'ZK Rollup',
        details: "Powered by StarkWare's StarkEx",
      },
      stateCorrectness: STATE_CORRECTNESS.STARKEX_VALIDITY_PROOFS,
      newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
      dataAvailability: {
        ...DATA_AVAILABILITY.STARKEX_ON_CHAIN,
        references: [
          ...DATA_AVAILABILITY.STARKEX_ON_CHAIN.references,
          {
            text: 'UpdatePerpetualState.sol#L82 - Etherscan source code',
            href: 'https://etherscan.io/address/0xdf9c117cad37f2ed8c99e36a40317d8cc340d4a0#code#F35#L82',
          },
        ],
      },
      operator: OPERATOR.STARKEX_OPERATOR,
      forceTransactions: FORCE_TRANSACTIONS.STARKEX_PERPETUAL_WITHDRAW,
      exitMechanisms: EXITS.STARKEX,
      contracts: {
        addresses: [
          {
            name: 'StarkPerpetual',
            address: '0xD54f502e184B6B739d7D27a6410a67dc462D69c8',
            description:
              'Main contract of dYdX exchange. Updates dYdX state and verifies its integrity using STARK Verifier. Allows users to deposit and withdraw tokens via normal and emergency modes.',
            upgradeability: {
              type: 'StarkWare',
              implementation: '0x2C0df87E073755139101b35c0A51e065291cc2d3',
              upgradeDelay: 0,
              isFinal: false,
            },
          },
          {
            name: 'GpsStatementVerifier',
            address: '0xC8c212f11f6ACca77A7afeB7282dEBa5530eb46C',
            description:
              'STARK Verifier. In contrast to Sorare, ImmutableX, DeversiFi and StarkNet which use common SHARP Prover, dYdX uses seperate Prover/Verifier.',
            upgradeability: {
              type: 'StarkWare',
              implementation: '0xCC5B2c75cbbD281b2Fc4B58C7d5B080d023C92F2',
              callImplementation: '0x894c4a12548FB18EaA48cF34f9Cd874Fc08b7FC3',
              upgradeDelay: 0,
              isFinal: false,
            },
          },
          {
            name: 'MemoryPageFactRegistry',
            description:
              'Contract storing CAIRO Program Output, in case of dYdX, it stores state diffs of dYdX Exchange.',
            address: '0xEfbCcE4659db72eC6897F46783303708cf9ACef8',
          },
          {
            name: 'FriStatementContract',
            description: 'Part of STARK Verifier.',
            address: '0xf6b83CcaDeee478FC372AF6ca7069b14FBc5E1B1',
          },
          {
            name: 'MerkleStatementContract',
            description: 'Part of STARK Verifier.',
            address: '0x0d62bac5c346c78DC1b27107CAbC5F4DE057a830',
          },
        ],
        risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
      },
      permissions: [
        {
          name: 'dYdX Governance',
          accounts: [
            {
              address: '0x7E9B1672616FF6D6629Ef2879419aaE79A9018D2',
              type: 'Contract',
            },
          ],
          description:
            'Defines rules of governance via the dYdX token. Can upgrade implementation of the rollup, potentially gaining access to all funds stored in the bridge. Currently there is no delay before the upgrade, so the users will not have time to migrate.',
        },
        {
          name: 'GpsStatementVerifier Governor',
          accounts: [
            {
              address: '0x3DE55343499f59CEB3f1dE47F2Cd7Eab28F2F5C6',
              type: 'EOA',
            },
          ],
          description:
            'Can upgrade implementation of Verifier, potentially with code approving fraudulent state. Currently there is no delay before the upgrade, so the users will not have time to migrate.',
        },
        {
          name: 'Operator',
          accounts: [
            {
              address: '0x8129b737912e17212C8693B781928f5D0303390a',
              type: 'EOA',
            },
          ],
          description:
            'Allowed to update state of the rollup. When Operator is down the state cannot be updated.',
        },
      ],
    },
    news: [
      {
        date: '2021-08-24',
        name: 'EOS is now live',
        link: 'https://dydx.exchange/blog/markets-17',
      },
      {
        date: '2021-08-12',
        name: 'dYdX Market Maker Debate',
        link: 'https://dydx.exchange/blog/debate-recap-cms-mgnr-wintermute',
      },
      {
        date: '2021-08-03',
        name: 'Introducing the dYdX Foundation',
        link: 'https://dydx.exchange/blog/introducing-dydx-foundation',
      },
    ],
  },
}
