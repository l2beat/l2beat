import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

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
import { getStage } from './common/stages/getStage'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('loopring')
const forcedWithdrawalDelay = discovery.getContractValue<number[]>(
  'ExchangeV3',
  'getConstants',
)[2]
const maxAgeDepositUntilWithdrawable = discovery.getContractValue<number>(
  'ExchangeV3',
  'getMaxAgeDepositUntilWithdrawable',
)
const forcedWithdrawalFee = discovery.getContractValue<number>(
  'LoopringV3',
  'forcedWithdrawalFee',
)

const upgrades = {
  upgradableBy: ['ProxyOwner'],
  upgradeDelay: 'No delay',
}

export const loopring: Layer2 = {
  type: 'layer2',
  id: ProjectId('loopring'),
  display: {
    name: 'Loopring',
    slug: 'loopring',
    description:
      "Loopring's zkRollup L2 solution aims to offer the same security guarantees as Ethereum mainnet, with a big scalability boost: throughput increased by 1000x, and cost reduced to just 0.1% of L1.",
    purpose: 'Tokens, NFTs, AMM',
    provider: 'loopring',
    category: 'ZK Rollup',
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
        isHistorical: true,
      },
      // WeDEX: Beta 2
      {
        address: EthereumAddress('0xD97D09f3bd931a14382ac60f156C1285a56Bb51B'),
        sinceTimestamp: new UnixTime(1578284114),
        tokens: ['LRC', 'USDT'],
        isHistorical: true,
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
      ...RISK_VIEW.SEQUENCER_FORCE_VIA_L1_LOOPRING(
        forcedWithdrawalDelay,
        forcedWithdrawalFee,
        maxAgeDepositUntilWithdrawable,
      ),
      sources: [
        {
          contract: 'ExchangeV3',
          references: [
            'https://etherscan.io/address/0x26d8Ba776a067C5928841985bCe342f75BAE7E82#code#L7252',
            'https://etherscan.io/address/0x26d8Ba776a067C5928841985bCe342f75BAE7E82#code#L6195',
            'https://etherscan.io/address/0x26d8Ba776a067C5928841985bCe342f75BAE7E82#code#L6090',
          ],
        },
        {
          contract: 'LoopringV3',
          references: [
            'https://etherscan.io/address/0xe56D6ccab6551932C0356E4e8d5dAF0630920C71#code#L1825',
          ],
        },
      ],
    },
    proposerFailure: {
      ...RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP,
      sources: [
        {
          contract: 'ExchangeV3',
          references: [
            'https://etherscan.io/address/0x26d8Ba776a067C5928841985bCe342f75BAE7E82#code#L8159',
          ],
        },
      ],
    },
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL('LRC'),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  stage: getStage({
    stage0: {
      callsItselfRollup: true,
      stateRootsPostedToL1: true,
      dataAvailabilityOnL1: true,
      rollupNodeOpenSource: 'UnderReview',
    },
    stage1: {
      stateVerificationOnL1: true,
      fraudProofSystemAtLeast5Outsiders: null,
      usersHave7DaysToExit: false,
      usersCanExitWithoutCooperation: true,
      securityCouncilProperlySetUp: null,
    },
    stage2: {
      proofSystemOverriddenOnlyInCaseOfABug: null,
      fraudProofSystemIsPermissionless: null,
      delayWith30DExitWindow: false,
    },
  }),
  technology: {
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
    ...discovery.getMultisigPermission(
      'ProxyOwner',
      'This address is the owner of the following contracts: LoopringIOExchangeOwner, ExchangeV3 (proxy), BlockVerifier, AgentRegistry, LoopringV3. This allows it to grant access to submitting blocks, arbitrarily change the forced withdrawal fee, change the Verifier address and upgrade ExchangeV3 implementation potentially gaining access to all funds in DefaultDepositContract.',
    ),
    {
      name: 'Block Submitters',
      accounts: discovery.getPermissionedAccounts(
        'LoopringIOExchangeOwner',
        'blockSubmitters',
      ),
      description:
        'Actors who can submit new blocks, updating the L2 state on L1.',
    },
    {
      name: 'RollupOwner',
      accounts: [discovery.getPermissionedAccount('ExchangeV3', 'owner')],
      description:
        'The rollup owner can submit blocks, set rollup parameters and shutdown the exchange.',
    },
  ],
  contracts: {
    addresses: [
      discovery.getContractDetails('ExchangeV3', {
        description: 'Main Loopring contract.',
        ...upgrades,
      }),
      discovery.getContractDetails(
        'LoopringIOExchangeOwner',
        'Contract used by the Prover to submit exchange blocks with zkSNARK proofs that are later processed and verified by the BlockVerifier contract. It allows to give or revoke permissions to submit blocks and to open block submission to everyone.',
      ),
      discovery.getContractDetails(
        'DefaultDepositContract',
        'ERC 20 token basic deposit contract. Handles user deposits and withdrawals.',
      ),
      discovery.getContractDetails(
        'LoopringV3',
        'Contract managing LRC staking for exchanges (one Loopring contract can manage many exchanges). It also allows to change the forced withdrawl fee and the Verifier address.',
      ),
      discovery.getContractDetails('BlockVerifier', {
        description: 'zkSNARK Verifier based on ethsnarks library.',
        ...upgrades,
        upgradeConsiderations:
          'The Verifier contract address can be changed by the ProxyOwner.',
      }),
      discovery.getContractDetails(
        'AgentRegistry',
        'Agent registry that is used by all other Loopring contracts. Currently used are FastWithdrawalAgent, ForcedWithdrawalAgent, DestroyableWalletAgent and a number of LoopringAmmPool contracts.',
      ),
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
