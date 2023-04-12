import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
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

const discovery = new ProjectDiscovery('loopring')

export const loopring: Layer2 = {
  type: 'layer2',
  id: ProjectId('loopring'),
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
      // WeDEX: Beta 1
      {
        address: EthereumAddress('0x7D3D221A8D8AbDd868E8e88811fFaF033e68E108'),
        sinceTimestamp: new UnixTime(1575539271),
        tokens: ['LRC', 'USDT'],
      },
      // WeDEX: Beta 2
      {
        address: EthereumAddress('0xD97D09f3bd931a14382ac60f156C1285a56Bb51B'),
        sinceTimestamp: new UnixTime(1578284114),
        tokens: ['LRC', 'USDT'],
      },
      {
        address: EthereumAddress('0x674bdf20A0F284D710BC40872100128e2d66Bd3f'),
        sinceTimestamp: new UnixTime(1603949642),
        tokens: '*',
      },
    ],
    transactionApi: {
      type: 'loopring',
      callsPerMinute: 240,
    },
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
          address: discovery.getContract('GnosisSafe').address,
          type: 'MultiSig',
        },
      ],
      description:
        'This address is the owner of the following contracts: LoopringIOExchangeOwner, ExchangeV3 (proxy owner), BlockVerifier, AgentRegistry, LoopringV3. This allows it to grant access to submitting blocks and upgrade ExchangeV3 implementation potentially gaining access to all funds in DefaultDepositContract.',
    },
    {
      name: 'MultiSig participants',
      accounts: discovery
        .getContractValue<string[]>('GnosisSafe', 'getOwners')
        .map((owner) => ({ address: EthereumAddress(owner), type: 'EOA' })),
      description: `These addresses are the participants of the ${discovery.getContractValue<number>(
        'GnosisSafe',
        'getThreshold',
      )}/${
        discovery.getContractValue<string[]>('GnosisSafe', 'getOwners').length
      } Loopring MultiSig.`,
    },
    {
      name: 'Block Submitters',
      accounts: [
        {
          address: EthereumAddress(
            '0xdd4b5E28fe55196B8Bf44A040f2c11f85401fdC0',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x7961076f6130092c1C90bd0D2C6F7f54055FA6C7',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x2b263f55Bf2125159Ce8Ec2Bb575C649f822ab46',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x4774d954D20DB98492B0487BC9F91dc401dBA3aE',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xE6b0cf8ed864F9bfEBa1b03bac785B5aC82cf095',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x53dD53dAf8F112BcA64332eA97398EfbC8a0E234',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x212e75BF264C4FB3133fA5ef6f47A34367020A1A',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x238b649E62a0C383b54060b1625516b489183843',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x3243Ed9fdCDE2345890DDEAf6b083CA4cF0F68f2',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xbfCc986cA6E6729c1D191cC0179ef060b87a7C42',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xA921aF7e4dd279e1325399E4E3Bf13d0E57f48Fc',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xeadb3d065f8d15cc05e92594523516aD36d1c834',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xB1a6BF349c947A540a5fe6f1e89992ACDad836AB',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xeDEE915Ae45Cc4B2FDd1Ce12a2f70dCa0B2AD9e5',
          ),
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
        address: discovery.getContract('ExchangeV3').address,
        description: 'Main ExchangeV3 contract.',
        upgradeability: discovery.getContract('ExchangeV3').upgradeability,
      },
      {
        name: 'LoopringIOExchangeOwner',
        address: discovery.getContract('LoopringIOExchangeOwner').address,
        description:
          'Contract used by the Prover to submit exchange blocks with zkSNARK proofs that are later processed and verified by the BlockVerifier contract.',
      },
      {
        name: 'DefaultDepositContract',
        address: discovery.getContract('DefaultDepositContract').address,
        description:
          'ERC 20 token basic deposit contract. Handles user deposits and withdrawals.',
      },
      {
        name: 'LoopringV3',
        address: EthereumAddress('0xe56D6ccab6551932C0356E4e8d5dAF0630920C71'),
        description:
          'Contract managinging LRC staking for exchanges (One Loopring contract can manage many exchanges).',
      },
      {
        name: 'BlockVerifier',
        address: EthereumAddress('0x6150343E0F43A17519c0327c41eDd9eBE88D01ef'),
        description: 'zkSNARK Verifier based on ethsnarks library.',
      },
      {
        name: 'AgentRegistry',
        address: discovery.getContract('AgentRegistry').address,
        description:
          'Agent registry that is used by all other Loopring contracts. Currently used are FastWithdrawalAgent, ForcedWithdrawalAgent, \
          DestroyableWalletAgent and a number of LoopringAmmPool contracts.',
      },
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  milestones: [
    {
      name: 'Loopring zkRollup is live',
      link: 'https://medium.com/loopring-protocol/loopring-deployed-protocol-3-0-on-ethereum-a33103c9e5bf',
      date: '2019-12-04T00:00:00Z',
      description:
        'Loopring Protocol 3.0 is fully operational with support for orderbook trading on WeDex.',
    },
    {
      name: 'Loopring Protocol 3.6 Pre-release',
      link: 'https://medium.loopring.io/loopring-3-6-is-code-complete-and-security-audit-has-begun-68a642506e31',
      date: '2020-09-22T00:00:00Z',
      description:
        'Enhancements in transfers, order-book trading and AMM swap.',
    },
    {
      name: 'Loopring’s zkRollup AMM is Live',
      link: 'https://medium.loopring.io/looprings-zkrollup-amm-is-live-2f8251cd0fcd',
      date: '2020-12-02T00:00:00Z',
      description:
        'Improved implementation, enabling gas-free instant swaps and liquidity changes.',
    },
    {
      name: 'Loopring Supports Payments',
      link: 'https://medium.loopring.io/loopring-pay-is-live-zkrollup-transfers-on-ethereum-770d35213408',
      date: '2020-06-06T00:00:00Z',
      description: 'Support for ERC20 transfers is live on Loopring.',
    },
    {
      name: 'DeFi Port is Live on Loopring',
      link: 'https://medium.loopring.io/loopring-l2-defi-port-cd6e811250a9',
      date: '2022-09-27T00:00:00Z',
      description:
        'Dutch auctions, lending, and other DeFi functions can be performed on Loopring.',
    },
    {
      name: 'Loopring Supports NFTs',
      link: 'https://medium.loopring.io/loopring-now-supports-nfts-on-l2-29174a343d0d',
      date: '2021-08-24T00:00:00Z',
      description: 'Loopring supports NFT minting, trading, and transfers.',
    },
    {
      name: 'Loopring DEX is online',
      link: 'https://medium.loopring.io/loopring-launches-zkrollup-exchange-loopring-io-d6a85beeed21',
      date: '2020-02-27T00:00:00Z',
      description:
        'zkRollup trading is live, as Loopring launches their order book based exchange.',
    },
  ],
}
