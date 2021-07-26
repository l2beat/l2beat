import { Project } from './Project'

export const fuel: Project = {
  name: 'Fuel',
  slug: 'fuel',
  bridges: [
    {
      address: '0x6880f6Fd960D1581C2730a451A22EED1081cfD72',
      sinceBlock: 11787727,
      tokens: ['DAI', 'USDC', 'USDT'],
    },
  ],
  details: {
    links: {
      websites: ['https://fuel.sh/'],
      apps: [],
      documentation: ['https://docs.fuel.sh/'],
      explorers: ['https://mainnet.fuel.sh/network/'],
      repositories: ['https://github.com/FuelLabs/fuel-v1-contracts'],
      socialMedia: [
        'https://discord.gg/xfpK4Pe',
        'https://twitter.com/fuellabs_',
      ],
    },
    technology: {
      name: 'optimistic-rollup',
      details: 'UTXO',
    },
    purpose: 'Payments',
    parameters: [
      {
        name: 'Primary use case',
        value: 'Payments',
      },
      {
        name: 'Hypothetical level of decentralization',
        sentiment: 'good',
        value: 'High',
      },
      {
        name: 'Current level of decentralization',
        sentiment: 'neutral',
        tooltip:
          "Optimistic rollups require 3rd party validators to submit fraud proofs. B/c of current lack of the adoption users can't trust that such validators are running.",
        value: 'Medium',
      },
      {
        name: 'Can funds be stolen by the operator?',
        sentiment: 'good',
        value: 'No',
      },
      {
        name: 'Permissionless?',
        sentiment: 'good',
        tooltip:
          'Anyone can submit a new root that can become part of the rollup after a delay',
        pointers: [
          'https://github.com/FuelLabs/fuel/blob/49c35e8de752200175174a08b6a8eae42796790d/src/Block.yulp#L95-L101',
        ],
        value: 'Yes',
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
        date: '2020-01-19',
        name: 'Announcing the Fuel v0 Open Beta',
        link: 'https://fuellabs.medium.com/announcing-the-fuel-v0-open-beta-565a2d340fc3',
      },
    ],
  },
}
