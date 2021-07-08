import { Project } from './Project'

export const arbitrum: Project = {
  name: 'Arbitrum',
  slug: 'arbitrum',
  bridges: [
    {
      address: '0x011B6E24FfB0B5f5fCc564cf4183C5BBBc96D515',
      sinceBlock: 12525700,
      tokens: ['ETH'],
    },
  ],
  details: {
    website: 'https://offchainlabs.com/',
    color: '#4c9ce5',
    technology: {
      name: 'optimistic-rollup',
      details: 'Arbitrum Virtual Machine',
    },
    parameters: [
      {
        name: 'Primary use case',
        value: 'Universal',
      },
      {
        name: 'Hypothetical level of decentralization',
        sentiment: 'good',
        value: 'High',
      },
      {
        name: 'Current level of decentralization',
        value: 'Low',
        tooltip: 'Contracts are upgradable',
        sentiment: 'bad',
      },
      {
        name: 'Can funds be stolen by the operator?',
        value: 'Yes, through contract upgrade',
        tooltip: 'Contracts are upgradable',
        sentiment: 'neutral',
      },
      {
        name: 'Permissionless?',
        value: 'No',
        sentiment: 'bad',
        tooltip: 'Only sequencer can produce new blocks',
        pointers: [],
      },
      {
        name: 'Force TX mechanism?',
        value: 'Yes',
        sentiment: 'good',
        tooltip:
          "Sequencer can be forced to append particular TX into the rollup. For now it's only for whitelisted accounts.",
        pointers: [
          'https://etherscan.io/address/0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f#code',
        ],
      },
      {
        name: 'Privacy',
        value: 'No',
      },
      {
        name: 'Smart contracts',
        value: 'Yes',
        tooltip: 'Automatic EVM -> AVM translation happens under the hood.',
      },
    ],
  },
}
