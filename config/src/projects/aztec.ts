import { RISK } from './common'
import { Project } from './types'

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
    links: {
      websites: ['https://aztec.network/'],
      apps: ['https://zk.money'],
      documentation: ['https://developers.aztec.network/'],
      explorers: ['https://explorer.aztec.network/'],
      repositories: ['https://github.com/AztecProtocol/aztec-2-bug-bounty'],
      socialMedia: [
        'https://twitter.com/aztecnetwork',
        'https://medium.com/aztec-protocol',
        'https://t.me/aztecprotocol',
        'https://discord.gg/UDtJr9u',
        'https://plonk.cafe/',
      ],
    },
    technologyName: 'ZK Rollup',
    technologyDetails: 'zk-SNARK/PLONK',
    purpose: 'Private payments',
    riskView: {
      stateCorrectness: RISK.SNARK_PROOFS,
      dataAvailability: RISK.DATA_ON_CHAIN,
      censorshipResistance: RISK.UNKNOWN,
      upgradeability: RISK.UPGRADABLE,
      owner: RISK.MULTISIG_OWNER,
    },
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
        date: '2021-07-01',
        name: 'Introducing private Bitcoin',
        link: 'https://medium.com/aztec-protocol/introducing-private-bitcoin-1cd9d895c770',
      },
      {
        date: '2021-04-30',
        name: 'Introducing zkDAI into the Aztec Private Rollup',
        link: 'https://medium.com/aztec-protocol/introducing-zkdai-into-the-aztec-private-rollup-203bd1b5164c',
      },
      {
        date: '2021-03-15',
        name: 'Launching Aztec 2.0 Rollup',
        link: 'https://medium.com/aztec-protocol/launching-aztec-2-0-rollup-ac7db8012f4b',
      },
    ],
  },
}
