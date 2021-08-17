import { RISK, TECHNOLOGY } from './common'
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
      stateValidation: RISK.STATE_ZKP_SN,
      dataAvailability: RISK.DATA_ON_CHAIN,
      upgradeability: RISK.UPGRADABLE_YES,
      operatorCensoring: RISK.CENSORING_PROPOSE_BLOCKS,
      operatorDown: RISK.DOWN_PROPOSE_BLOCKS,
    },
    technology: {
      category: {
        name: 'ZK Rollup',
        references: [],
      },
      stateCorrectness: {
        ...TECHNOLOGY.VALIDITY_PROOFS,
        references: [
          {
            text: 'RollupProcessor.sol#L395 - Etherscan source code',
            href: 'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L395',
          },
        ],
      },
      dataAvailability: {
        ...TECHNOLOGY.ON_CHAIN_DATA,
        references: [
          {
            text: 'RollupProcessor.sol#L359 - Etherscan source code',
            href: 'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L359',
          },
        ],
      },
      newCryptography: {
        ...TECHNOLOGY.ZK_SNARKS,
        references: [
          {
            text: 'TurboVerifier.sol#L37 - Etherscan source code',
            href: 'https://etherscan.io/address/0xbc87b0ccdd7e5a064051ae9aeece2ca6617d8675#code#F1#L37',
          },
        ],
      },
      additionalPrivacy: {
        name: 'Payments are private',
        description:
          'Balances and identities for all tokens on the Aztec rollup are encrypted. Each transaction is encoded as a zkSNARK, protecting user data.',
        risks: [],
        references: [
          {
            text: 'Fast Privacy, Now - Aztec Medium Blog',
            href: 'https://medium.com/aztec-protocol/aztec-zkrollup-layer-2-privacy-1978e90ee3b6#3b25',
          },
        ],
      },
      operator: {
        name: 'The sequencer is centralized.',
        description:
          'Only specific addresses appointed by the owner are permitted to propose new blocks during regular rollup operation.',
        risks: [],
        references: [
          {
            text: 'RollupProcessor.sol#L97 - Etherscan source code',
            href: 'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L97',
          },
          {
            text: 'RollupProcessor.sol#L369 - Etherscan source code',
            href: 'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L369',
          },
        ],
      },
      forceTransactions: {
        name: 'Users can force submit any transaction',
        description:
          'Periodically the rollup opens an escape hatch which is a period during which anyone can propose new blocks. In order for a user to circumvent censorship with their own transaction they need to provide a ZK proof for a block which contains that transaction.',
        risks: [],
        references: [
          {
            text: 'RollupProcessor.sol#L347 - Etherscan source code',
            href: 'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L347',
          },
        ],
      },
      exitMechanisms: [
        {
          name: 'Regular withdraw',
          description:
            'The user initiates a withdrawal request on L2. When the block with this request on L1 is proved on L1 the assets are automatically withdrawn to the user in the same transaction. Users can use the escape hatch to force withdraw, but they need to prove the block themselves.',
          risks: [],
          references: [
            {
              text: 'RollupProcessor.sol#LL396 - Etherscan source code',
              href: 'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L396',
            },
          ],
        },
      ],
      contracts: {
        addresses: [
          // 0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba
          // 0x41A57F5581aDf11b25F3eDb7C1DB19f18bb76734
          // 0xDCC80dB987bf63f01b7bafCED6230DE5002eF874
        ],
        risks: [
          // TurboVerifier uses unverified libraries https://etherscan.io/address/0x8eefd2d44952ddcb94bb383d4c0aa670f941c784
        ],
      },
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
