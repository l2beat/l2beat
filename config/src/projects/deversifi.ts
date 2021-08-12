import { RISK, STARKEX } from './common'
import { Project } from './types'

export const deversifi: Project = {
  name: 'DeversiFi',
  slug: 'deversifi',
  bridges: [
    {
      address: '0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b',
      sinceBlock: 10141009,
      tokens: [
        'ETH',
        'USDT',
        'WBTC',
        'USDC',
        'DAI',
        'LDO',
        'CEL',
        'cUSDT',
        'PNK',
        'AAVE',
        'SUSHI',
        'YFI',
        'UNI',
        'ZRX',
        'HEZ',
        'DUSK',
        'LINK',
        'MKR',
        'MLN',
        'NEC',
        'COMP',
        'SNX',
        'BAL',
        'LRC',
        'OMG',
        'BAT',
      ],
    },
  ],
  details: {
    links: {
      websites: ['https://www.deversifi.com/'],
      apps: ['https://app.deversifi.com/'],
      documentation: [
        'https://docs.deversifi.com/',
        'https://support.deversifi.com/en/',
        'https://docs.starkware.co/starkex-docs-v2/',
      ],
      explorers: [],
      repositories: [
        'https://github.com/starkware-libs/starkex-contracts',
        'https://github.com/deversifi',
      ],
      socialMedia: [
        'https://blog.deversifi.com/',
        'https://twitter.com/deversifi',
        'https://linkedin.com/company/deversifi/',
        'https://youtube.com/c/deversifi',
      ],
    },
    technologyName: 'Validium',
    technologyDetails: "Powered by StarkWare's StarkEx",
    purpose: 'Exchange',
    provider: 'StarkEx',
    riskView: {
      stateCorrectness: RISK.STARK_PROOFS,
      dataAvailability: RISK.DATA_EXTERNAL,
      censorshipResistance: RISK.FORCE_EXIT,
      upgradeability: RISK.UPGRADE_DELAY('4 weeks'),
      owner: RISK.UNKNOWN,
    },
    technology: {
      category: {
        name: 'Validium',
        description: "Powered by StarkWare's StarkEx",
        references: [
          {
            text: 'DeversiFi Contracts - StarkEx documentation',
            href: 'https://docs.starkware.co/starkex-v3/starkex-deep-dive/smart-contracts-1/deployments-addresses#deversifi-contracts',
          },
        ],
      },
      stateCorrectness: STARKEX.VALIDITY_PROOFS,
      dataAvailability: STARKEX.VALIDIUM_DATA_AVAILABILITY,
      newCryptography: STARKEX.CRYPTOGRAPHY,
      operator: STARKEX.OPERATOR,
      forceTransactions: STARKEX.FORCE_OPERATIONS,
      exitMechanisms: [STARKEX.OFF_CHAIN_WITHDRAWAL, STARKEX.FORCED_WITHDRAWAL],
      contracts: {
        addresses: [
          {
            name: 'Bridge',
            address: '0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b',
            upgradable: true,
            // TODO: more information
          },
          {
            name: 'Committee',
            address: '0x28780349A33eEE56bb92241bAAB8095449e24306',
            upgradable: true,
            // TODO: more information
          },
          {
            name: 'GpsStatementVerifier',
            address: '0xd4CF925B9d0f4d1cCf82aB97C25130657474Ee19',
            upgradable: true,
            // TODO: more information
          },
          {
            name: 'MemoryPageFactRegistry',
            address: '0xc8e4EE91E7C14D625B829D2C2E87cF7348Eca449',
            upgradable: true,
            // TODO: more information
          },
          {
            name: 'FriStatementContract',
            address: '0x2742A152Be5032DafBC885Ba1801ffbc2345de7B',
            upgradable: true,
            // TODO: more information
          },
          {
            name: 'MerkleStatementContract',
            address: '0x0aF10D116A5CF10cA8835A0d775e0b248114fAD0',
            upgradable: true,
            // TODO: more information
          },
        ],
        risks: [
          // TODO: Risks
        ],
      },
    },
    parameters: [
      {
        name: 'Primary use case',
        value: 'Exchange',
      },
      {
        name: 'Hypothetical level of decentralization',
        value: 'High',
      },
      {
        name: 'Current level of decentralization',
        tooltip: 'Contracts are upgradable',
        sentiment: 'bad',
        value: 'Low',
      },
      {
        name: 'Can funds be stolen by the operator?',
        tooltip: 'Contracts are upgradable',
        sentiment: 'warning',
        pointers: [
          {
            name: 'Bridge contract - source on Etherscan',
            href: 'https://etherscan.io/address/0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b#code',
          },
        ],
        value: 'Yes, through contract upgrade',
      },
      {
        name: 'Permissionless?',
        sentiment: 'bad',
        tooltip: 'Only DeversiFi can produce new blocks',
        value: 'No',
      },
      {
        name: 'Force TX mechanism?',
        sentiment: 'good',
        value: 'Yes but only for withdrawals',
      },
      {
        name: 'Privacy',
        value: 'No',
      },
      {
        name: 'Smart contracts',
        value: 'No',
      },
    ],
    news: [
      {
        date: '2020-03-15',
        name: 'Fast Withdrawals - A Powerful New Building Block for Scalable DeFi',
        link: 'https://blog.deversifi.com/l2-composability/',
      },
      {
        date: '2020-07-15',
        name: 'Say Hello to the New DeversiFi - powered by StarkWare!',
        link: 'https://blog.deversifi.com/introducing-deversifi2-0/',
      },
    ],
  },
}
