import {
  CONTRACTS,
  DATA_AVAILABILITY,
  FORCE_TRANSACTIONS,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
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
    description:
      'Aztec is an open source layer 2 network that aims to bring scalability and privacy to Ethereum. It strives to enable affordable, private crypto payments via zero-knowledge proofs.',
    purpose: 'Private payments',
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
    riskView: {
      stateValidation: RISK_VIEW.STATE_ZKP_SN,
      dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
      upgradeability: RISK_VIEW.UPGRADABLE_YES,
      sequencerFailure: RISK_VIEW.SEQUENCER_PROPOSE_BLOCKS_ZKP,
      validatorFailure: RISK_VIEW.VALIDATOR_PROPOSE_BLOCKS_ZKP,
    },
    technology: {
      category: {
        name: 'ZK Rollup',
      },
      stateCorrectness: {
        ...STATE_CORRECTNESS.VALIDITY_PROOFS,
        references: [
          {
            text: 'RollupProcessor.sol#L395 - Etherscan source code',
            href: 'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L395',
          },
        ],
      },
      newCryptography: {
        ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
        references: [
          {
            text: 'TurboVerifier.sol#L37 - Etherscan source code',
            href: 'https://etherscan.io/address/0xbc87b0ccdd7e5a064051ae9aeece2ca6617d8675#code#F1#L37',
          },
        ],
      },
      dataAvailability: {
        ...DATA_AVAILABILITY.ON_CHAIN,
        references: [
          {
            text: 'RollupProcessor.sol#L359 - Etherscan source code',
            href: 'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L359',
          },
        ],
      },
      operator: {
        ...OPERATOR.CENTRALIZED_OPERATOR,
        description:
          'Only specific addresses appointed by the owner are permitted to propose new blocks during regular rollup operation. Periodically a special window is open during which anyone can propose new blocks.',
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
        ...FORCE_TRANSACTIONS.PROPOSE_OWN_BLOCKS,
        description:
          FORCE_TRANSACTIONS.PROPOSE_OWN_BLOCKS.description +
          ' Periodically the rollup opens a special window during which anyone can propose new blocks.',
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
            'The user initiates the withdrawal by submitting a transaction on L2. When the block containing that transaction is proven on L1 the assets are automatically withdrawn to the user.',
          risks: [],
          references: [
            {
              text: 'RollupProcessor.sol#LL396 - Etherscan source code',
              href: 'https://etherscan.io/address/0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba#code#F1#L396',
            },
          ],
        },
      ],
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
      contracts: {
        addresses: [
          {
            address: '0x737901bea3eeb88459df9ef1BE8fF3Ae1B42A2ba',
            name: 'RollupProcessor',
          },
          {
            address: '0x41A57F5581aDf11b25F3eDb7C1DB19f18bb76734',
            name: 'AztecFeeDistributor',
          },
          {
            address: '0xDCC80dB987bf63f01b7bafCED6230DE5002eF874',
            name: 'TurboVerifier',
            // TurboVerifier uses unverified libraries https://etherscan.io/address/0x8eefd2d44952ddcb94bb383d4c0aa670f941c784
            description:
              'The source code of the VerificationKeys library used by this contract is not verified on Etherscan.',
          },
        ],
        risks: [CONTRACTS.UNVERIFIED_RISK],
      },
    },
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
