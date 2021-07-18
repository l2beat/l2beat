import { Project } from './Project'

export const leverj: Project = {
  name: 'LeverJ',
  slug: 'leverj',
  bridges: [
    {
      address: '0x75ACe7a086eA0FB1a79e43Cc6331Ad053d8C67cB',
      sinceBlock: 8929632,
      tokens: ['ETH', 'DAI', 'L2'],
    },
  ],
  details: {
    showNotL2Warning: true,
    website: 'https://leverj.io/',
    color: '#4967ff',
    technology: {
      name: 'plasma',
      details: 'Gluon Plasma',
    },
    purpose: 'Exchange',
    parameters: [
      {
        name: 'Primary use case',
        value: 'Exchange',
      },
      {
        name: 'Hypothetical level of decentralization',
        value: 'High',
        sentiment: 'good',
      },
      {
        name: 'Current level of decentralization',
        value: 'Low',
        tooltip: 'Single operator. Supports decentralized watchers.',
        sentiment: 'neutral',
      },
      {
        name: 'Can funds be stolen by the operator?',
        value: 'No',
        tooltip:
          'Users can safely exit to L1 even if the operator is malicious.',
        sentiment: 'good',
      },
      {
        name: 'Permisonless?',
        value: 'No',
        sentiment: 'bad',
        tooltip: 'Only operator can produce new blocks',
      },
      {
        name: 'Force TX mechanism?',
        value: 'Yes but only for withdrawals',
        sentiment: 'good',
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
        date: '2021-04-08',
        name: 'Shutting Down the Spot Market on Leverj',
        link: 'https://blog.leverj.io/announcement-shutting-down-the-spot-markets-on-leverj-c20d14fad546',
      },
      {
        date: '2020-09-25',
        name: 'Launching high frequency derivatives trading on a DEX',
        link: 'https://blog.leverj.io/launching-high-frequency-derivatives-trading-on-a-dex-fdca839aa51d',
      },
      {
        date: '2019-02-19',
        name: 'Leverj now on Ethereum Mainnet',
        link: 'https://blog.leverj.io/leverj-now-on-ethereum-mainnet-bd016af01cb7',
      },
    ],
  },
}
