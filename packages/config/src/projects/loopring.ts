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

export const loopring: Project = {
  name: 'Loopring',
  slug: 'loopring',
  id: ProjectId('loopring'),
  bridges: [
    {
      address: '0x674bdf20A0F284D710BC40872100128e2d66Bd3f',
      sinceTimestamp: new UnixTime(1603949642),
      tokens: '*',
    },
  ],
  associatedTokens: ['LRC'],
  details: {
    description:
      "Loopring's zkRollup L2 solution aims to offer the same security guarantees as Ethereum mainnet, with a big scalability boost: throughput increased by 1000x, and cost reduced to just 0.1% of L1.",
    purpose: 'Tokens, NFTs, AMM',
    links: {
      websites: ['https://loopring.org'],
      apps: ['https://exchange.loopring.io/'],
      documentation: [
        'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md',
      ],
      explorers: ['https://explorer.loopring.io/'],
      repositories: ['https://github.com/Loopring/protocols'],
      socialMedia: [
        'https://loopring.org/#/blog',
        'https://medium.com/loopring-protocol',
        'https://twitter.com/loopringorg',
        'https://discord.gg/KkYccYp',
        'https://youtube.com/c/loopring',
        'https://weibo.com/loopringfoundation',
        'https://reddit.com/r/loopringorg/',
        'https://loopring.substack.com/',
      ],
    },
    riskView: {
      stateValidation: RISK_VIEW.STATE_ZKP_SN,
      dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
      upgradeability: RISK_VIEW.UPGRADABLE_YES,
      sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_EXIT_L1,
      validatorFailure: RISK_VIEW.VALIDATOR_ESCAPE_MP,
    },
    technology: {
      category: {
        name: 'ZK Rollup',
      },
      stateCorrectness: {
        ...STATE_CORRECTNESS.VALIDITY_PROOFS,
        references: [
          {
            text: 'Operators - Loopring design doc',
            href: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md#operators',
          },
        ],
      },
      newCryptography: {
        ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
        references: [
          {
            text: 'Operators - Loopring design doc',
            href: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md#operators',
          },
        ],
      },
      dataAvailability: {
        ...DATA_AVAILABILITY.ON_CHAIN,
        references: [
          {
            text: 'Introduction - Loopring design doc',
            href: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md#introduction',
          },
        ],
      },
      operator: {
        ...OPERATOR.CENTRALIZED_OPERATOR,
        references: [
          {
            text: 'ExchangeV3.sol#L315-L322 - Loopring source code',
            href: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/contracts/core/impl/ExchangeV3.sol#L315-L322',
          },
          {
            text: 'LoopringIOExchangeOwner.sol#L123-L126 - Loopring source code',
            href: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/contracts/aux/access/LoopringIOExchangeOwner.sol#L123-L126',
          },
        ],
      },
      forceTransactions: {
        ...FORCE_TRANSACTIONS.WITHDRAW_OR_HALT,
        references: [
          {
            text: 'Forced Withdrawals - Loopring design doc',
            href: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md#forced-withdrawals',
          },
          {
            text: 'Forced Request Handling - Loopring design doc',
            href: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md#forced-request-handling',
          },
        ],
      },
      exitMechanisms: [
        {
          ...EXITS.REGULAR('zk', 'no proof'),
          references: [
            {
              text: 'Withdraw - Loopring design doc',
              href: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md#withdraw',
            },
          ],
        },
        {
          ...EXITS.FORCED,
          references: [
            {
              text: 'Forced Request Handling - Loopring design doc',
              href: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md#forced-request-handling',
            },
          ],
        },
        {
          ...EXITS.EMERGENCY('Withdrawal Mode', 'merkle proof'),
          references: [
            {
              text: 'Forced Request Handling - Loopring design doc',
              href: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md#forced-request-handling',
            },
          ],
        },
      ],
      contracts: {
        addresses: [
          {
            name: 'ExchangeV3',
            address: '0x0BABA1Ad5bE3a5C0a66E7ac838a129Bf948f1eA4',
            description: 'Main ExchangeV3 contract.',
            upgradeability: {
              type: 'ZeppelinOs',
              admin: '0xDd2A08a1c1A28c1A571E098914cA10F2877D9c97',
              implementation: '0x26d8Ba776a067C5928841985bCe342f75BAE7E82',
            },
          },
          {
            address: '0x153CdDD727e407Cb951f728F24bEB9A5FaaA8512',
            name: 'LoopringIOExchangeOwner',
            description:
              'Contract used by the Prover to submit exchange blocks with zkSNARK proofs that are later processed and verified by the BlockVerifier contract.',
          },
          {
            name: 'DefaultDepositContract',
            description:
              'ERC 20 token basic deposit contract. Handles user deposits and withdrawals.',
            address: '0x674bdf20A0F284D710BC40872100128e2d66Bd3f',
          },
          {
            name: 'LoopringV3',
            description:
              'Contract managinging LRC staking for exchanges (One Loopring contract can manage many exchanges).',
            address: '0xe56D6ccab6551932C0356E4e8d5dAF0630920C71',
          },
          {
            name: 'BlockVerifier',
            description: 'zkSNARK Verifier based on ethsnarks library.',
            address: '0x6150343E0F43A17519c0327c41eDd9eBE88D01ef',
          },
          {
            name: 'AgentRegistry',
            description:
              'Agent rergistery that is used by all other Loopring contracts. Currently used are FastWithdrawalAgent, ForcedWithdrawalAgent, \
            DestroyableWalletAgent and a number of LoopringAmmPool contracts.',
            address: '0x39B9bf169a7e225ba037C443A40460c77438ea14',
          },
        ],
        risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
      },
    },
    news: [
      {
        date: '2020-08-24',
        name: 'Loopring Now Supports NFTs on L2',
        link: 'https://medium.com/loopring-protocol/loopring-now-supports-nfts-on-l2-29174a343d0d',
      },
      {
        date: '2020-08-24',
        name: 'dAMM (distributed AMM)',
        link: 'https://medium.com/loopring-protocol/damm-distributed-amm-98dcfa2b26dd',
      },
      {
        date: '2020-08-18',
        name: 'Loopring L2 Liquidity Mining: Round 13',
        link: 'https://medium.com/loopring-protocol/loopring-l2-liquidity-mining-round-13-9957aac9a21b',
      },
    ],
  },
}
