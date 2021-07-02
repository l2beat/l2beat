import { Project } from './Project'
import { tokenList } from '../tokens'

export const habitat: Project = {
  name: 'Habitat',
  bridges: [
    {
      address: '0x96E471B5945373dE238963B4E032D3574be4d195',
      sinceBlock: 12731872,
      tokens: tokenList.map((e) => e.symbol),
    },
  ],
  details: {
    website: 'https://0xhabitat.org/',
    color: '#29b65f',
    technology: {
      name: 'application specific optimistic-rollup',
      details: 'NutBerry',
    },
    parameters: [
      {
        name: 'Primary use case',
        value: 'Governance & Treasury Management',
      },
      {
        name: 'Hypothetical level of decentralization',
        value: 'High',
        sentiment: 'good',
      },
      {
        name: 'Current level of decentralization',
        value: 'Low',
        tooltip:
          'Community owned Rollup, currently in the bootstrapping phase.',
        sentiment: 'neutral',
      },
      {
        name: 'Can funds be stolen by the operator?',
        value: 'Yes, through a contract upgrade via the multisig.',
        tooltip:
          'Ownership will be transferred to community governance in the future.',
        sentiment: 'neutral',
        pointers: [
          'https://github.com/0xHabitat/habitat/blob/master/src/rollup/contracts/HabitatV1.sol#L52',
        ],
      },
      {
        name: 'Permissionless?',
        value: 'Yes',
        sentiment: 'bad',
      },
      {
        name: 'Force TX mechanism?',
        value: 'Yes',
        tooltip:
          'Fully permissionless. Rollup node can be run inside web browsers.',
        sentiment: 'good',
      },
      {
        name: 'Privacy',
        value: 'No',
      },
      {
        name: 'Smart contracts',
        value:
          'Limited. Only static contracts that comply to the Habitat Module interface.',
        pointers: [
          'https://github.com/0xHabitat/habitat/blob/master/src/rollup/contracts/HabitatModule.sol',
        ],
      },
    ],
    news: [
      {
        name: 'Community Update #15 - Habitat is Live on Mainnet',
        link: 'https://0xhabitat.substack.com/p/15',
      },
    ],
  },
}
