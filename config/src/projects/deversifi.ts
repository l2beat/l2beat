import { Project } from './Project'

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
        sentiment: 'neutral',
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
