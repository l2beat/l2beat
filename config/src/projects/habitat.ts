import { Project } from './Project'

export const habitat: Project = {
  name: 'Habitat',
  slug: 'habitat',
  bridges: [
    {
      address: '0x96E471B5945373dE238963B4E032D3574be4d195',
      sinceBlock: 12731872,
      tokens: ['HBT', 'WETH', 'USDC', 'GNO'],
    },
  ],
  details: {
    website: 'https://0xhabitat.org/',
    color: '#29b65f',
    technology: {
      name: 'optimistic-rollup',
      details: 'NutBerry',
    },
    purpose: 'DAO governance',
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
          'Contract Ownership will be transferred to community governance in the future',
        sentiment: 'neutral',
      },
      {
        name: 'Can funds be stolen by the operator?',
        value: 'Yes, through a contract upgrade via the multisig.',
        tooltip:
          'The multisig will be replaced by on-chain governance once the Habitat community is sufficiently decentralized.',
        sentiment: 'neutral',
        pointers: [
          'https://github.com/0xHabitat/habitat/blob/master/src/rollup/contracts/HabitatV1.sol#L52',
        ],
      },
      {
        name: 'Protocol upgrade timelock',
        value: 'No',
        sentiment: 'bad',
      },
      {
        name: 'Permissionless?',
        value: 'Anyone can propose, dispute, challenge and finalize blocks',
        sentiment: 'good',
      },
      {
        name: 'Force TX mechanism?',
        value: 'No',
        tooltip:
          'Operators are independent transaction aggregators and are not subject to any enforcements.',
        sentiment: 'neutral',
      },
      {
        name: 'Can the funds be freely withdrawn?',
        value: 'Yes, but not instantly.',
        tooltip:
          'Withdraw delays are subject to the inspection period. Currently 1 week.',
        sentiment: 'good',
      },
      {
        name: 'Rollup Governance',
        value: 'HBT tokens are needed to participate.',
        sentiment: 'neutral',
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
