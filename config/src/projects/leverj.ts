import { Project } from './Project'

export const leverj: Project = {
  name: 'LeverJ',
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
    parameters: [
      {
        name: 'Primary use case',
        value: 'Decentralized derivatives exchange',
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
        name: 'Scaling Ethereum with the OMG Network',
        link: 'https://omg.network/omg-network-scales-ethereum/',
      },
    ],
  },
}
