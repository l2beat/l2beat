import { Project } from './Project'

export const aztec: Project = {
  name: 'Aztec',
  slug: 'aztec',
  bridges: [
    {
      address: '0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba',
      sinceBlock: 11967192,
      tokens: ['ETH', 'DAI'],
    },
  ],
  details: {
    website: 'https://zk.money',
    color: '#8953f3',
    technology: {
      name: 'zk-rollup',
      details: 'zk-SNARK/PLONK',
    },
    purpose: 'Private payments',
    parameters: [
      {
        name: 'Primary use case',
        value: 'Private payments',
      },
      {
        name: 'Hypothetical level of decentralization',
        sentiment: 'good',
        value: 'High',
      },
      {
        name: 'Current level of decentralization',
        value: '?',
      },
      {
        name: 'Can funds be stolen by the operator?',
        value: '?',
      },
      {
        name: 'Permissionless?',
        value: '?',
      },
      {
        name: 'Force TX mechanism?',
        value: '?',
      },
      {
        name: 'Privacy',
        value: 'Yes',
      },
      {
        name: 'Smart contracts',
        tooltip: 'Possible in the future (Noir - custom language) ',
        value: 'No',
      },
    ],
    news: [
      {
        name: 'Introducing zkDAI into the Aztec Private Rollup',
        link: 'https://medium.com/aztec-protocol/introducing-zkdai-into-the-aztec-private-rollup-203bd1b5164c',
      },
      {
        name: 'Launching Aztec 2.0 Rollup',
        link: 'https://medium.com/aztec-protocol/launching-aztec-2-0-rollup-ac7db8012f4b',
      },
    ],
  },
}
