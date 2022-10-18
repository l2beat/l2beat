import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/types'

import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { Layer2 } from './types'

export const loopring: Layer2 = {
  type: 'layer2',
  id: ProjectId.LOOPRING,
  display: {
    name: 'Loopring',
    slug: 'loopring',
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
    activityDataSource: 'Explorer API',
  },
  config: {
    associatedTokens: ['LRC'],
    escrows: [
      {
        address: '0x674bdf20A0F284D710BC40872100128e2d66Bd3f',
        sinceTimestamp: new UnixTime(1603949642),
        tokens: '*',
      },
    ],
    events: [
      {
        name: 'BlockSubmitted',
        abi: 'event BlockSubmitted (uint256 indexed blockIdx, bytes32 merkleRoot, bytes32 publicDataHash)',
        emitter: EthereumAddress('0x0BABA1Ad5bE3a5C0a66E7ac838a129Bf948f1eA4'),
        type: 'state',
        sinceTimestamp: new UnixTime(1603950102),
      },
    ],
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_SN,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    upgradeability: RISK_VIEW.UPGRADABLE_YES,
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_EXIT_L1,
    validatorFailure: RISK_VIEW.VALIDATOR_ESCAPE_MP,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL('LRC'),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {
    category: 'ZK Rollup',
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
  },
  permissions: [
    {
      name: 'Loopring MultiSig',
      accounts: [
        {
          address: '0xDd2A08a1c1A28c1A571E098914cA10F2877D9c97',
          type: 'MultiSig',
        },
      ],
      description:
        'This address is the owner of the following contracts: LoopringIOExchangeOwner, ExchangeV3 (proxy owner), BlockVerifier, AgentRegistry, LoopringV3. This allows it to grant access to submitting blocks and upgrade ExchangeV3 implementation potentially gaining access to all funds in DefaultDepositContract.',
    },
    {
      name: 'MultiSig participants',
      accounts: [
        {
          address: '0x3b1d1f89e0b6803174a2de72e21a6f6f8464d5f1',
          type: 'EOA',
        },
        {
          address: '0x4cbbd41a2c057cab8db00ac60f1ab52f36870185',
          type: 'EOA',
        },
        {
          address: '0x55d79345afc87806b690c9f96c4d7bfe2bca8268',
          type: 'EOA',
        },
        {
          address: '0xb89cdf808da6cfb39f3c2e167ffb5ddfc811c33e',
          type: 'EOA',
        },
        {
          address: '0x51b8982ebfa21eb01b1e591b8f45a33fca216e0d',
          type: 'EOA',
        },
        {
          address: '0x1f28f10176f89f4e9985873b84d14e75751bb3d1',
          type: 'EOA',
        },
      ],
      description:
        'These addresses are the participants of the 4/6 Loopring MultiSig.',
    },
    {
      name: 'Block Submitters',
      accounts: [
        {
          address: '0xdd4b5E28fe55196B8Bf44A040f2c11f85401fdC0',
          type: 'EOA',
        },
        {
          address: '0x7961076f6130092c1C90bd0D2C6F7f54055FA6C7',
          type: 'EOA',
        },
        {
          address: '0x2b263f55Bf2125159Ce8Ec2Bb575C649f822ab46',
          type: 'EOA',
        },
        {
          address: '0x4774d954D20DB98492B0487BC9F91dc401dBA3aE',
          type: 'EOA',
        },
        {
          address: '0xE6b0cf8ed864F9bfEBa1b03bac785B5aC82cf095',
          type: 'EOA',
        },
        {
          address: '0x53dD53dAf8F112BcA64332eA97398EfbC8a0E234',
          type: 'EOA',
        },
        {
          address: '0x212e75BF264C4FB3133fA5ef6f47A34367020A1A',
          type: 'EOA',
        },
        {
          address: '0x238b649E62a0C383b54060b1625516b489183843',
          type: 'EOA',
        },
        {
          address: '0x3243Ed9fdCDE2345890DDEAf6b083CA4cF0F68f2',
          type: 'EOA',
        },
        {
          address: '0xbfCc986cA6E6729c1D191cC0179ef060b87a7C42',
          type: 'EOA',
        },
        {
          address: '0xA921aF7e4dd279e1325399E4E3Bf13d0E57f48Fc',
          type: 'EOA',
        },
        {
          address: '0xeadb3d065f8d15cc05e92594523516aD36d1c834',
          type: 'EOA',
        },
        {
          address: '0xB1a6BF349c947A540a5fe6f1e89992ACDad836AB',
          type: 'EOA',
        },
        {
          address: '0xeDEE915Ae45Cc4B2FDd1Ce12a2f70dCa0B2AD9e5',
          type: 'EOA',
        },
      ],
      description:
        'Actors who can submit new blocks, updating the L2 state on L1.',
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
  news: [
    {
      date: '2022-09-16',
      name: 'Loophead Drop #4: NFT Marketplace Challenge',
      link: 'https://medium.loopring.io/loophead-drop-4-nft-marketplace-challenge-a122f96aa3b5',
    },
    {
      date: '2022-08-25',
      name: 'Lido Staked ETH on Loopring L2',
      link: 'https://medium.loopring.io/lido-staked-eth-on-loopring-l2-6b23b1e56212',
    },
    {
      date: '2022-08-17',
      name: 'Introducing DAO Voting',
      link: 'https://medium.loopring.io/introducing-dao-voting-46a210c373bc',
    },
  ],
}
