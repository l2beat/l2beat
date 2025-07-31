import {
  ChainId,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'

import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
  STATE_VALIDATION,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { BADGES } from '../../common/badges'
import { formatExecutionDelay } from '../../common/formatDelays'
import { PROOFS } from '../../common/proofSystems'
import { getStage } from '../../common/stages/getStage'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import type { ScalingProject } from '../../internalTypes'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'

const discovery = new ProjectDiscovery('loopring')
const forcedWithdrawalDelay = discovery.getContractValue<{
  [key: string]: number
}>('ExchangeV3', 'getConstants').MAX_AGE_FORCED_REQUEST_UNTIL_WITHDRAW_MODE
const maxAgeDepositUntilWithdrawable = discovery.getContractValue<number>(
  'ExchangeV3',
  'getMaxAgeDepositUntilWithdrawable',
)
const forcedWithdrawalFee = discovery.getContractValue<number>(
  'LoopringV3',
  'forcedWithdrawalFee',
)

const upgrades = {
  upgradableBy: [{ name: 'LoopringMultisig', delay: 'no' }],
}

const upgradeDelay = 0
const finalizationPeriod = 0

export const loopring: ScalingProject = {
  type: 'layer2',
  id: ProjectId('loopring'),
  capability: 'appchain',
  addedAt: UnixTime(1623153328), // 2021-06-08T11:55:28Z
  badges: [BADGES.VM.AppChain, BADGES.DA.EthereumCalldata],
  display: {
    name: 'Loopring',
    slug: 'loopring',
    description:
      'Loopring is a ZK Rollup exchange protocol for trading and payments.',
    purposes: ['NFT', 'Exchange'],
    stacks: ['Loopring'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://loopring.org'],
      bridges: ['https://loopring.io/#/trade'],
      documentation: [
        'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md',
        'https://docs.loopring.io/',
      ],
      explorers: ['https://explorer.loopring.io/'],
      repositories: ['https://github.com/Loopring/protocols'],
      socialMedia: [
        'https://loopring.org/#/blog',
        'https://medium.com/loopring-protocol',
        'https://twitter.com/loopringorg',
        'https://discord.gg/loopring',
        'https://youtube.com/c/loopring',
        'https://weibo.com/loopringfoundation',
        'https://reddit.com/r/loopringorg/',
        'https://loopring.substack.com/',
      ],
    },
    liveness: {
      explanation:
        'Loopring is a ZK rollup that posts state diffs to the L1. For a transaction to be considered final, the state diffs have to be submitted and validity proof should be generated, submitted, and verified. ',
    },
  },
  chainConfig: {
    name: 'loopring',
    chainId: undefined,
    apis: [
      {
        type: 'loopring',
        url: 'https://api3.loopring.io/api/v3',
        callsPerMinute: 240,
      },
    ],
  },
  config: {
    associatedTokens: ['LRC'],
    escrows: [
      // WeDEX: Beta 1
      {
        address: EthereumAddress('0x7D3D221A8D8AbDd868E8e88811fFaF033e68E108'),
        sinceTimestamp: UnixTime(1575539271),
        tokens: ['LRC', 'USDT'],
        isHistorical: true,
        chain: 'ethereum',
      },
      // WeDEX: Beta 2
      {
        address: EthereumAddress('0xD97D09f3bd931a14382ac60f156C1285a56Bb51B'),
        sinceTimestamp: UnixTime(1578284114),
        tokens: ['LRC', 'USDT'],
        isHistorical: true,
        chain: 'ethereum',
      },
      {
        address: EthereumAddress('0x674bdf20A0F284D710BC40872100128e2d66Bd3f'),
        sinceTimestamp: UnixTime(1603949642),
        tokens: '*',
        chain: 'ethereum',
      },
    ],
    activityConfig: {
      type: 'block',
    },
    daTracking: [
      {
        type: 'ethereum',
        daLayer: ProjectId('ethereum'),
        sinceBlock: 0, // Edge Case: config added @ DA Module start
        inbox: EthereumAddress('0x153CdDD727e407Cb951f728F24bEB9A5FaaA8512'),
        sequencers: [
          EthereumAddress('0x2b263f55Bf2125159Ce8Ec2Bb575C649f822ab46'),
          EthereumAddress('0x4774d954D20DB98492B0487BC9F91dc401dBA3aE'),
          EthereumAddress('0x53dD53dAf8F112BcA64332eA97398EfbC8a0E234'),
          EthereumAddress('0x212e75BF264C4FB3133fA5ef6f47A34367020A1A'),
          EthereumAddress('0x238b649E62a0C383b54060b1625516b489183843'),
          EthereumAddress('0x3243Ed9fdCDE2345890DDEAf6b083CA4cF0F68f2'),
          EthereumAddress('0xbfCc986cA6E6729c1D191cC0179ef060b87a7C42'),
          EthereumAddress('0xA921aF7e4dd279e1325399E4E3Bf13d0E57f48Fc'),
          EthereumAddress('0xeadb3d065f8d15cc05e92594523516aD36d1c834'),
          EthereumAddress('0xB1a6BF349c947A540a5fe6f1e89992ACDad836AB'),
          EthereumAddress('0xeDEE915Ae45Cc4B2FDd1Ce12a2f70dCa0B2AD9e5'),
          EthereumAddress('0xE6b0cf8ed864F9bfEBa1b03bac785B5aC82cf095'),
          EthereumAddress('0x487e8Be2BaD383b5B62fC5fb46005A8Fac10E341'),
        ],
      },
    ],
    trackedTxs: [
      {
        uses: [
          {
            type: 'liveness',
            subtype: 'stateUpdates',
          },
          {
            type: 'l2costs',
            subtype: 'stateUpdates',
          },
        ],
        query: {
          formula: 'functionCall',
          address: EthereumAddress(
            '0x153CdDD727e407Cb951f728F24bEB9A5FaaA8512',
          ),
          selector: '0xdcb2aa31',
          functionSignature:
            'function submitBlocksWithCallbacks(bool isDataCompressed, bytes calldata data, ((uint16,(uint16,uint16,uint16,bytes)[])[], address[])  calldata config)',
          sinceTimestamp: UnixTime(1616396742),
        },
      },
    ],
    liveness: {
      duplicateData: {
        from: 'stateUpdates',
        to: 'proofSubmissions',
      },
    },
  },
  dataAvailability: {
    layer: DA_LAYERS.ETH_CALLDATA,
    bridge: DA_BRIDGES.ENSHRINED,
    mode: DA_MODES.STATE_DIFFS,
  },
  riskView: {
    stateValidation: {
      ...RISK_VIEW.STATE_ZKP_SN,
      secondLine: formatExecutionDelay(finalizationPeriod),
    },
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    exitWindow: RISK_VIEW.EXIT_WINDOW(upgradeDelay, forcedWithdrawalDelay),
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_VIA_L1_LOOPRING(
      forcedWithdrawalDelay,
      forcedWithdrawalFee,
      maxAgeDepositUntilWithdrawable,
    ),
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP,
  },
  stage: getStage(
    {
      stage0: {
        callsItselfRollup: true,
        stateRootsPostedToL1: true,
        dataAvailabilityOnL1: true,
        rollupNodeSourceAvailable: true,
        stateVerificationOnL1: true,
        fraudProofSystemAtLeast5Outsiders: null,
      },
      stage1: {
        principle: false,
        usersHave7DaysToExit: false,
        usersCanExitWithoutCooperation: true,
        securityCouncilProperlySetUp: null,
      },
      stage2: {
        proofSystemOverriddenOnlyInCaseOfABug: null,
        fraudProofSystemIsPermissionless: null,
        delayWith30DExitWindow: false,
      },
    },
    {
      rollupNodeLink: 'https://github.com/Loopring/loopring-subgraph-v2',
      additionalConsiderations: {
        short:
          'Loopring provides an orderbook decentralized exchange for spot trading. Arbitrary contracts are not supported.',
        long: 'Loopring provides an orderbook decentralized exchange for spot trading. Arbitrary contracts are not supported.',
      },
    },
  ),
  technology: {
    dataAvailability: {
      ...TECHNOLOGY_DATA_AVAILABILITY.ON_CHAIN_CALLDATA,
      references: [
        {
          title: 'Introduction - Loopring design doc',
          url: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md#introduction',
        },
      ],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [
        {
          title:
            'ExchangeV3.sol#L315-L322 - Etherscan source code, submitBlocks function',
          url: 'https://etherscan.io/address/0x26d8Ba776a067C5928841985bCe342f75BAE7E82#code#L8022',
        },
        {
          title:
            'LoopringIOExchangeOwner.sol#L123-L126 - Etherscan source code, hasAccessTo function call',
          url: 'https://etherscan.io/address/0x153CdDD727e407Cb951f728F24bEB9A5FaaA8512#code#L5539',
        },
      ],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.WITHDRAW_OR_HALT(),
      references: [
        {
          title: 'Forced Withdrawals - Loopring design doc',
          url: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md#forced-withdrawals',
        },
        {
          title: 'Forced Request Handling - Loopring design doc',
          url: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md#forced-request-handling',
        },
      ],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR_WITHDRAWAL('zk'),
        references: [
          {
            title: 'Withdraw - Loopring design doc',
            url: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md#withdraw',
          },
        ],
      },
      {
        ...EXITS.FORCED_WITHDRAWAL(),
        references: [
          {
            title: 'Forced Request Handling - Loopring design doc',
            url: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md#forced-request-handling',
          },
          {
            title:
              'ExchangeV3.sol#L8118 - Loopring source code, forceWithdraw function',
            url: 'https://etherscan.io/address/0x26d8Ba776a067C5928841985bCe342f75BAE7E82#code#L8118',
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
            title: 'Forced Request Handling - Loopring design doc',
            url: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md#forced-request-handling',
          },
          {
            title:
              'ExchangeV3.sol#L8159 - Loopring source code, withdrawFromMerkleTree function',
            url: 'https://etherscan.io/address/0x26d8Ba776a067C5928841985bCe342f75BAE7E82#code#L8159',
          },
        ],
      },
    ],
  },
  permissions: {
    ethereum: {
      actors: [
        discovery.getMultisigPermission(
          'LoopringMultisig',
          'This address is the owner of the following contracts: LoopringIOExchangeOwner, ExchangeV3 (proxy), BlockVerifier, AgentRegistry, LoopringV3. This allows it to grant access to submitting blocks, arbitrarily change the forced withdrawal fee, change the Verifier address and upgrade ExchangeV3 implementation potentially gaining access to all funds in DefaultDepositContract.',
        ),
        discovery.getPermissionDetails(
          'Block Submitters',
          discovery.getPermissionedAccounts(
            'LoopringIOExchangeOwner',
            'blockSubmitters',
          ),
          'Actors who can submit new blocks, updating the L2 state on L1.',
        ),
        discovery.getPermissionDetails(
          'RollupOwner',
          discovery.getPermissionedAccounts('ExchangeV3', 'owner'),

          'The rollup owner can submit blocks, set rollup parameters and shutdown the exchange.',
        ),
      ],
    },
  },
  contracts: {
    addresses: {
      ethereum: [
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
          'Contract managing LRC staking for exchanges (one Loopring contract can manage many exchanges). It also allows to change the forced withdrawal fee and the Verifier address.',
        ),
        discovery.getContractDetails(
          'FastWithdrawalAgent',
          'Auxiliary contract allowing users to process fast withdrawals.',
        ),
        discovery.getContractDetails(
          'ForcedWithdrawalAgent',
          'Auxiliary contract able to force withdrawals from L1 on behalf of users.',
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
    },
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  stateValidation: {
    description:
      'Each update to the system state must be accompanied by a ZK proof that ensures that the new state was derived by correctly applying a series of valid user transactions to the previous state. These proofs are then verified on Ethereum by a smart contract.',
    categories: [
      {
        title: 'ZK Circuits',
        description:
          'Loopring utilizes Groth16 for their proving system. The source code of the circuits can be found [here](https://github.com/Loopring/protocol3-circuits).',
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'the proof system is implemented incorrectly.',
          },
        ],
      },
      {
        title: 'Verification Keys Generation',
        description:
          'Groth16 requires a circuit specific trusted setup, so they run their own ceremony. The first phase is run using Powers of Tau ceremony. Some of the instructions on how to regenerate the verification keys can be found [here](https://github.com/Loopring/trusted_setup/tree/loopring-3.6.2).',
      },
      {
        ...STATE_VALIDATION.VALIDITY_PROOFS,
        references: [
          {
            title: 'Operators - Loopring design doc',
            url: 'https://github.com/Loopring/protocols/blob/master/packages/loopring_v3/DESIGN.md#operators',
          },
        ],
      },
    ],
    proofVerification: {
      shortDescription: 'Loopring is a DEX rollup on Ethereum.',
      aggregation: false,
      requiredTools: [
        {
          name: 'Custom tool',
          version: 'v3.6.2',
          link: 'https://github.com/Loopring/trusted_setup/tree/loopring-3.6.2',
        },
      ],
      verifiers: [
        {
          name: 'LoopringVerifier',
          description: 'Loopring utilizes Groth16 for their proving system.',
          verified: 'no',
          contractAddress: EthereumAddress(
            '0x6150343E0F43A17519c0327c41eDd9eBE88D01ef',
          ),
          chainId: ChainId.ETHEREUM,
          subVerifiers: [
            {
              name: 'Main circuit',
              ...PROOFS.GROTH16('POT18'),
              link: 'https://github.com/Loopring/protocol3-circuits.git',
            },
          ],
        },
      ],
    },
  },
  milestones: [
    {
      title: 'Loopring ZK Rollup is live',
      url: 'https://medium.com/loopring-protocol/loopring-protocol-3-0-zksnarks-for-scalability-845b35a8b75b',
      date: '2019-12-04T00:00:00Z',
      description:
        'Loopring Protocol 3.0 is fully operational with support for orderbook trading on WeDex.',
      type: 'general',
    },
    {
      title: 'Loopring Protocol 3.6 Pre-release',
      url: 'https://medium.loopring.io/loopring-3-6-is-code-complete-and-security-audit-has-begun-68a642506e31',
      date: '2020-09-22T00:00:00Z',
      description:
        'Enhancements in transfers, order-book trading and AMM swap.',
      type: 'general',
    },
    {
      title: 'Loopring’s ZK Rollup AMM is Live',
      url: 'https://medium.loopring.io/looprings-zkrollup-amm-is-live-2f8251cd0fcd',
      date: '2020-12-02T00:00:00Z',
      description:
        'Improved implementation, enabling gas-free instant swaps and liquidity changes.',
      type: 'general',
    },
    {
      title: 'Loopring Supports Payments',
      url: 'https://medium.loopring.io/loopring-pay-is-live-zkrollup-transfers-on-ethereum-770d35213408',
      date: '2020-06-06T00:00:00Z',
      description: 'Support for ERC20 transfers is live on Loopring.',
      type: 'general',
    },
    {
      title: 'DeFi Port is Live on Loopring',
      url: 'https://medium.loopring.io/loopring-l2-defi-port-cd6e811250a9',
      date: '2022-09-27T00:00:00Z',
      description:
        'Dutch auctions, lending, and other DeFi functions can be performed on Loopring.',
      type: 'general',
    },
    {
      title: 'Loopring Supports NFTs',
      url: 'https://medium.loopring.io/loopring-now-supports-nfts-on-l2-29174a343d0d',
      date: '2021-08-24T00:00:00Z',
      description: 'Loopring supports NFT minting, trading, and transfers.',
      type: 'general',
    },
    {
      title: 'Loopring DEX is online',
      url: 'https://medium.loopring.io/loopring-launches-zkrollup-exchange-loopring-io-d6a85beeed21',
      date: '2020-02-27T00:00:00Z',
      description:
        'ZK Rollup trading is live, as Loopring launches their order book based exchange.',
      type: 'general',
    },
  ],
  discoveryInfo: getDiscoveryInfo([discovery]),
}
