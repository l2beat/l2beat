import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
} from './common'
import { Project } from './types'

export const bobanetwork: Project = {
  name: 'Boba Network',
  slug: 'bobanetwork',
  bridges: [
    {
      // Proxy__OVM_L1StandardBridge
      address: '0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00',
      sinceBlock: 13012048,
      tokens: [
        'ETH',
        'USDC',
        'OMG',
        'DAI',
        'SUSHI',
        'UNI',
        'USDT',
        'FRAX',
        'WBTC',
        'FTM',
        'MATIC',
        'BAT',
        'ZRX',
      ],
    },
    {
      // Proxy__L1LiquidityPool
      address: '0x1A26ef6575B7BBB864d984D9255C069F6c361a14',
      sinceBlock: 13013879,
      tokens: ['ETH', 'USDC', 'OMG', 'DAI', 'SUSHI', 'USDT', 'ZRX'],
    },
  ],
  associatedToken: 'OMG',
  details: {
    description:
      'Boba is an L2 Ethereum scaling & augmenting solution built by the Enya team as core contributors to the OMG Foundation. Boba is an Optimistic Rollup scaling solution that claims to reduce gas fees, improve transaction throughput, and extend the capabilities of smart contracts.',
    purpose: 'Universal',
    links: {
      websites: ['https://boba.network'],
      apps: [],
      documentation: ['https://docs.boba.network/'],
      explorers: ['https://blockexplorer.boba.network/'],
      repositories: ['https://github.com/omgnetwork/optimism'],
      socialMedia: [
        'https://boba.network/#news',
        'https://www.enya.ai/company/media',
        'https://twitter.com/bobanetwork',
        'https://t.me/bobanetwork',
        'https://discord.gg/m7NysJjKhm',
      ],
    },
    riskView: {
      stateValidation: {
        value: 'Proofs disabled',
        description:
          'Currently the system permits invalid state roots. More details in project overview.',
        sentiment: 'bad',
      },
      dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
      upgradeability: RISK_VIEW.UPGRADABLE_YES,
      sequencerFailure: RISK_VIEW.SEQUENCER_TRANSACT_L1,
      validatorFailure: RISK_VIEW.VALIDATOR_WHITELISTED_BLOCKS,
    },
    technology: {
      category: {
        name: 'Optimistic Rollup',
      },
      stateCorrectness: {
        name: 'Fraud proofs are disabled',
        description:
          'Ultimately Boba Network will use fraud proofs to enforce state correctness. This feature is currently disabled and the system permits invalid state roots. Users have the ability to run a validator software and compute valid state roots locally, but cannot act on them on chain.',
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'an invalid state root is submitted to the system.',
          },
        ],
        references: [
          {
            text: 'The incentive contract for verification proofs is disabled - Boba FAQ',
            href: 'https://docs.boba.network/faq#the-incentive-contract-for-verification-proofs-is-disabled',
          },
          {
            text: 'Checking Boba Mainnet for Fraud - Boba Optimism repository',
            href: 'https://github.com/omgnetwork/optimism-v2/tree/develop/boba_community/fraud-detector',
          },
        ],
      },
      dataAvailability: {
        ...DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
        references: [
          {
            text: 'Data Availability Batches - Paradigm Research',
            href: 'https://research.paradigm.xyz/optimism#data-availability-batches',
          },
          {
            text: 'Canonical Transaction Chain - Boba documentation',
            href: 'https://docs.boba.network/developer-docs/chain-contracts#ovm-canonicaltransactionchain-ctc',
          },
        ],
      },
      operator: {
        ...OPERATOR.CENTRALIZED_SEQUENCER,
        references: [
          {
            text: 'Boba operates the only "Sequencer" node - Boba FAQ',
            href: 'https://docs.boba.network/faq#boba-operates-the-only-sequencer-node',
          },
        ],
      },
      forceTransactions: {
        ...FORCE_TRANSACTIONS.CANONICAL_ORDERING,
        references: [
          {
            text: 'Canonical Transaction Chain - Boba documentation',
            href: 'https://docs.boba.network/developer-docs/chain-contracts#ovm-canonicaltransactionchain-ctc',
          },
        ],
      },
      exitMechanisms: [
        {
          ...EXITS.REGULAR('optimistic', 'merkle proof'),
          references: [
            {
              text: 'The Standard Bridge - Boba documentation',
              href: 'https://docs.boba.network/developer-docs/bridging-l1-l2#the-standardtm-bridge',
            },
          ],
          risks: [EXITS.RISK_CENTRALIZED_VALIDATOR],
        },
        {
          name: 'Fast exit',
          description:
            'Users can initiate a fast exit which makes use of liquidity pools, and charges a small fee for the convenience. Users funds can then be withdrawn on L1 after only minutes.',
          references: [
            {
              text: 'The LP Bridge - Boba documentation',
              href: 'https://docs.boba.network/developer-docs/bridging-l1-l2#the-standardtm-bridge-1',
            },
          ],
          risks: [],
        },
      ],
      smartContracts: {
        name: 'EVM compatible smart contracts are supported',
        description:
          'Boba Network uses the Optimistic Virtual Machine (OVM) to execute transactions. This is similar to the EVM, but is independent from it and allows fraud proofs to be executed.',
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'there are mistakes in the highly complex OVM implementation.',
          },
        ],
        references: [
          {
            text: 'Execution Contracts - Learn more about the Boba Network execution contracts',
            href: 'https://docs.boba.network/developer-docs/chain-contracts/execution-contracts',
          },
        ],
      },
      contracts: {
        addresses: [
          {
            name: 'L1 Standard Bridge',
            address: '0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x1f2414D0af8741Bc822dBc2f88069c2b2907a840',
              implementation: '0x4828900EB9dB5346dfe33cCf884984D8014C7B4B',
            },
          },
          {
            name: 'L1 Liquidity Pool',
            address: '0x1A26ef6575B7BBB864d984D9255C069F6c361a14',
          },
          {
            // TODO: Support this type of proxy
            name: 'Proxy__OVM_L1CrossDomainMessenger',
            address: '0x6D4528d192dB72E282265D6092F4B872f9Dff69e',
          },
          {
            name: 'AddressManager',
            address: '0x8376ac6C3f73a25Dd994E0b0669ca7ee0C02F089',
          },
          {
            name: 'OVM_CanonicalTransactionChain',
            address: '0x4B5D9E5A6B1a514eba15A2f949531DcCd7c272F2',
          },
          {
            name: 'OVM_ChainStorageContainer:CTC:batches',
            address: '0xA7557b676EA0D9406459409B5ad01c14b5522c46',
          },
          {
            name: 'OVM_ChainStorageContainer:CTC:queue',
            address: '0x33938f8E5F2c36e3Ca2B01E878b3322E280d4c50',
          },
          {
            name: 'OVM_ChainStorageContainer:SCC:batches',
            address: '0x318d4dAb7D3793E40139b496c3B89422Ae5372D1',
          },
          {
            name: 'OVM_ExecutionManager',
            address: '0xa230D4b11F66A3DEEE0bEAf8D04551F236C8B646',
          },
          {
            name: 'OVM_FraudVerifier',
            address: '0x872c65c835deB2CFB3493f2C3dD353633Ae4f4B8',
          },
          {
            name: 'OVM_L1CrossDomainMessenger',
            address: '0x25109139f8C4F9f7b4E4d5452A067feaE3a537F3',
          },
          {
            name: 'OVM_L1MultiMessageRelayer',
            address: '0xAb2AF3A98D229b7dAeD7305Bb88aD0BA2c42f9cA',
          },
          {
            name: 'OVM_SafetyChecker',
            address: '0x85c0Cebfe3b81d64D256b38fDf65DD05887e5884',
          },
          {
            name: 'OVM_StateCommitmentChain',
            address: '0x17834b754e2f09946CE48D7B5beB4D7D94D98aB6',
          },
          {
            name: 'OVM_StateManagerFactory',
            address: '0x0c4935b421Af8F86698Fb77233e90AbC5f146846',
          },
          {
            name: 'OVM_StateTransitionerFactory',
            address: '0xc6dd73D427Bf784dd1e2f9F64029a79533ffAb40',
          },
        ],
        risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
      },
    },
    news: [
      {
        date: '2021-09-20',
        name: 'Boba Network Announces Public Mainnet Launch',
        link: 'https://www.enya.ai/press/public-mainnet',
      },
      {
        date: '2021-09-14',
        name: 'Boba Network Partners with Witnet',
        link: 'https://www.enya.ai/press/witnet',
      },
      {
        date: '2021-09-13',
        name: 'Boba Network Integrates with MyEtherWallet',
        link: 'https://www.enya.ai/press/mew',
      },
      {
        date: '2021-09-10',
        name: 'Boba Network Partners with Band Protocol',
        link: 'https://www.enya.ai/press/band-protocol',
      },
      {
        date: '2021-09-08',
        name: 'Boba Network Partners with API3',
        link: 'https://www.enya.ai/press/api3',
      },
      {
        date: '2021-09-07',
        name: 'Boba Network Partners with Frax Finance',
        link: 'https://www.enya.ai/press/frax',
      },
      {
        date: '2021-09-02',
        name: 'Boba Network Partners with SAKE',
        link: 'https://www.enya.ai/press/sake',
      },
      {
        date: '2021-08-31',
        name: 'Boba Network Partners with Anyswap',
        link: 'https://www.enya.ai/press/anyswap',
      },
      {
        date: '2021-08-26',
        name: 'Boba Network Partners with Coin98',
        link: 'https://www.enya.ai/press/coin98',
      },
      {
        date: '2021-08-24',
        name: 'Boba Network Partners with DODO',
        link: 'https://www.enya.ai/press/dodo',
      },
      {
        date: '2021-08-19',
        name: 'Enya Launches Mainnet Beta of Boba Network',
        link: 'https://www.enya.ai/press/bobanetwork',
      },
    ],
  },
}
