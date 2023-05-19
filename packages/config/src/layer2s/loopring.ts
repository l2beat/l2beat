import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { formatSeconds } from '../utils/formatSeconds'
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
const forcedWithdrawalDelay = formatSeconds(
  discovery.getContractValue<number[]>('ExchangeV3', 'getConstants')[2],
)
const maxAgeDepositUntilWithdrawable = formatSeconds(
  discovery.getContractValue<number>(
    'ExchangeV3',
    'getMaxAgeDepositUntilWithdrawable',
  ),
)

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
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_FORCE_EXIT_L1,
      description:
        RISK_VIEW.SEQUENCER_FORCE_EXIT_L1.description +
        ` The sequencer can censor individual deposits, but in such case after ${maxAgeDepositUntilWithdrawable} users can get their funds back.`,
      references: [
        'https://etherscan.io/address/0x26d8Ba776a067C5928841985bCe342f75BAE7E82#code#L7252',
        'https://etherscan.io/address/0x26d8Ba776a067C5928841985bCe342f75BAE7E82#code#L6195',
      ],
    },
    validatorFailure: {
      ...RISK_VIEW.VALIDATOR_ESCAPE_MP,
      description:
        RISK_VIEW.VALIDATOR_ESCAPE_MP.description +
        ` There is a ${forcedWithdrawalDelay} delay on this operation.`,
      references: [
        'https://etherscan.io/address/0x26d8Ba776a067C5928841985bCe342f75BAE7E82#code#L8159',
      ],
    },
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
          text: 'ExchangeV3.sol#L315-L322 - Etherscan source code, submitBlocks function',
          href: 'https://etherscan.io/address/0x26d8Ba776a067C5928841985bCe342f75BAE7E82#code#L8022',
        },
        {
          text: 'LoopringIOExchangeOwner.sol#L123-L126 - Etherscan source code, hasAccessTo function call',
          href: 'https://etherscan.io/address/0x153CdDD727e407Cb951f728F24bEB9A5FaaA8512#code#L5539',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.WITHDRAW_OR_HALT(),
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
          {
            text: 'ExchangeV3.sol#L8118 - Loopring source code, forceWithdraw function',
            href: 'https://etherscan.io/address/0x26d8Ba776a067C5928841985bCe342f75BAE7E82#code#L8118',
          },
        ],
      },
      {
        ...EXITS.EMERGENCY(
          'Withdrawal Mode',
          'merkle proof',
          forcedWithdrawalDelay,
        ),
        references: [
          {
            text: 'Forced Request Handling - Loopring design doc',
            href: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md#forced-request-handling',
          },
          {
            text: 'ExchangeV3.sol#L8159 - Loopring source code, withdrawFromMerkleTree function',
            href: 'https://etherscan.io/address/0x26d8Ba776a067C5928841985bCe342f75BAE7E82#code#L8159',
          },
        ],
      },
    ],
  },
  permissions: [
    ...discovery.getGnosisSafeDetails(
      'ProxyOwner',
      'This address is the owner of the following contracts: LoopringIOExchangeOwner, ExchangeV3 (proxy), BlockVerifier, AgentRegistry, LoopringV3. This allows it to grant access to submitting blocks and upgrade ExchangeV3 implementation potentially gaining access to all funds in DefaultDepositContract.',
    ),
    {
      name: 'Block Submitters',
      accounts: discovery.getPermissionedAccountsList(
        'LoopringIOExchangeOwner',
        'blockSubmitters',
      ),
      description:
        'Actors who can submit new blocks, updating the L2 state on L1.',
    },
    {
      name: 'RollupOwner',
      accounts: [
        {
          address: EthereumAddress(
            discovery.getContractValue<string>('ExchangeV3', 'owner'),
          ),
          type: 'EOA',
        },
      ],
      description:
        'The rollup owner can submit blocks, set rollup parameters and shutdown the exchange.',
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
