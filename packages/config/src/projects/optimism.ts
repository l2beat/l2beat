import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  OPERATOR,
  RISK_VIEW,
} from './common'
import { Project } from './types'

export const optimism: Project = {
  name: 'Optimism',
  slug: 'optimism',
  bridges: [
    {
      // old snx bridge
      address: '0x045e507925d2e05D114534D0810a1abD94aca8d6',
      sinceBlock: 11656238,
      tokens: ['SNX'],
    },
    {
      // old snx bridge
      address: '0x5Fd79D46EBA7F351fe49BFF9E87cdeA6c821eF9f',
      sinceBlock: 12409015,
      tokens: ['SNX'],
    },
    {
      address: '0xCd9D4988C0AE61887B075bA77f08cbFAd2b65068',
      sinceBlock: 12409013,
      tokens: ['SNX'],
    },
    {
      address: '0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65',
      sinceBlock: 12781431,
      tokens: ['DAI'],
    },
    {
      address: '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1',
      sinceBlock: 12686786,
      tokens: ['ETH', 'LINK', 'MKR', 'UNI', 'USDC', 'USDT', 'WBTC'],
    },
  ],
  details: {
    warning:
      'Currently only whitelisted contracts can be deployed on Optimism.',
    description:
      'Optimistic Ethereum is an EVM-compatible Optimistic Rollup chain. It aims to be fast, simple, and secure. \
      With the Nov 2021 upgrade to "EVM equivalent" OVM 2.0 old fraud proof system has been disabled while the \
      new fraud-proof system is being built.',
    purpose: 'Universal',
    links: {
      websites: ['https://optimism.io/'],
      apps: [],
      documentation: ['https://community.optimism.io/docs/'],
      explorers: ['https://optimistic.etherscan.io/'],
      repositories: ['https://github.com/ethereum-optimism/optimism'],
      socialMedia: [
        'https://medium.com/ethereum-optimism',
        'https://twitter.com/optimismPBC',
        'https://discord.gg/jrnFEvq',
        'https://youtube.com/playlist?list=PLX_rXoLYCf5HqTWygUfoMfzRirGz5lekH',
        'https://twitch.tv/optimismpbc',
      ],
    },
    provider: 'Optimism',
    riskView: {
      stateValidation: {
        value: 'In development',
        description:
          'Currently the system permits invalid state roots. More details in project overview.',
        sentiment: 'bad',
      },
      dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
      upgradeability: RISK_VIEW.UPGRADABLE_YES,
      sequencerFailure: RISK_VIEW.SEQUENCER_TRANSACT_L1,
      validatorFailure: RISK_VIEW.VALIDATOR_WHITELISTED_BLOCKS,
    },
    technology: {
      category: {
        name: 'Optimistic Rollup',
      },
      stateCorrectness: {
        name: 'Fraud proofs are in development',
        description:
          'Ultimately Optimism will use interactive fraud proofs to enforce state correctness. This feature is currently in development and the system permits invalid state roots.',
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'an invalid state root is submitted to the system.',
            isCritical: true,
          },
        ],
        references: [
          {
            text: 'Introducing EVM Equivalence',
            href: 'https://medium.com/ethereum-optimism/introducing-evm-equivalence-5c2021deb306',
          },
        ],
      },
      dataAvailability: {
        ...DATA_AVAILABILITY.ON_CHAIN_CANONICAL,
        references: [
          {
            text: 'Data Availability Batches - Paradigm Research',
            href: 'https://research.paradigm.xyz/optimism#data-availability-batches',
          },
        ],
      },
      operator: {
        ...OPERATOR.CENTRALIZED_SEQUENCER,
        references: [
          {
            text: 'How will the sequencer be decentralized over time? - Optimism documentation',
            href: 'https://community.optimism.io/docs/protocol/sequencing.html#how-will-the-sequencer-be-decentralized-over-time',
          },
        ],
      },
      forceTransactions: {
        ...FORCE_TRANSACTIONS.CANONICAL_ORDERING,
        references: [
          {
            text: ' Chain Contracts - Optimism documentation',
            href: 'https://community.optimism.io/docs/protocol/protocol-2.0.html#chain-contracts',
          },
        ],
      },
      exitMechanisms: [
        {
          ...EXITS.REGULAR('optimistic', 'merkle proof'),
          references: [
            {
              text: ' Withdrawing back to L1 - Optimism documentation',
              href: 'https://community.optimism.io/docs/users/withdrawal.html',
            },
          ],
          risks: [
            {
              ...EXITS.RISK_CENTRALIZED_VALIDATOR,
              references: [
                {
                  text: 'mockOVM_BondManager.sol#L71 - Etherscan source code',
                  href: 'https://etherscan.io/address/0xCd76de5C57004d47d0216ec7dAbd3c72D8c49057#code#F6#L71',
                },
              ],
            },
          ],
        },
      ],
      smartContracts: {
        name: 'EVM compatible smart contracts are supported',
        description:
          'Optimism uses the Optimistic Virtual Machine (OVM) to execute transactions. This is similar to the EVM, but is independent from it and allows fraud proofs to be executed. Currently there is a whitelist that limits who can deploy smart contracts.',
        risks: [
          {
            category: 'Funds can be lost if',
            text: 'there are mistakes in the highly complex OVM implementation.',
          },
        ],
        references: [
          {
            text: 'Deployer Whitelist - Optimism documentation',
            href: 'https://community.optimism.io/docs/developers/l2/deploy.html#whitelisting',
          },
        ],
      },
      contracts: {
        addresses: [
          {
            name: 'SynthetixBridgeToOptimism',
            address: '0x045e507925d2e05D114534D0810a1abD94aca8d6',
          },
          {
            name: 'SynthetixBridgeEscrow',
            address: '0x5Fd79D46EBA7F351fe49BFF9E87cdeA6c821eF9f',
          },
          {
            name: 'SynthetixBridgeToOptimism',
            address: '0xCd9D4988C0AE61887B075bA77f08cbFAd2b65068',
          },
          {
            name: 'L1Escrow',
            address: '0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65',
          },
          {
            name: 'Lib_AddressManager',
            address: '0xdE1FCfB0851916CA5101820A69b13a4E276bd81F',
          },
          {
            name: 'CanonicalTransactionChain',
            address: '0x5E4e65926BA27467555EB562121fac00D24E9dD2',
          },
          {
            name: 'ChainStorageContainer',
            address: '0xb0ddFf09c4019e31960de11bD845E836078E8EbE',
          },
          {
            name: 'StateCommitmentChain',
            address: '0xBe5dAb4A2e9cd0F27300dB4aB94BeE3A233AEB19',
          },
          {
            name: 'L1StandardBridge',
            address: '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x9996571372066A1545D3435C6935e3F9593A7eF5',
              implementation: '0x40E0C049f4671846E9Cff93AAEd88f2B48E527bB',
            },
          },
          {
            name: 'L1CrossDomainMessenger',
            address: '0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x9996571372066A1545D3435C6935e3F9593A7eF5',
              implementation: '0xd9166833FF12A5F900ccfBf2c8B62a90F1Ca1FD5',
            },
          },
          {
            name: 'BondManager',
            address: '0xcd626E1328b41fCF24737F137BcD4CE0c32bc8d1',
          },
        ],
        risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
      },
    },
    news: [
      {
        date: '2021-08-19',
        name: 'Community Launch',
        link: 'https://medium.com/ethereum-optimism/community-launch-7c9a2a9d3e84',
      },
      {
        date: '2021-07-20',
        name: 'Retroactive Public Goods Funding',
        link: 'https://medium.com/ethereum-optimism/retroactive-public-goods-funding-33c9b7d00f0c',
      },
      {
        date: '2021-02-24',
        name: 'Dope Hires & Moar Mainnet in March',
        link: 'https://medium.com/ethereum-optimism/dope-hires-moar-mainnet-in-march-174fa8966361',
      },
      {
        date: '2021-10-26',
        name: 'Introducing EVM Equivalence',
        link: 'https://medium.com/ethereum-optimism/introducing-evm-equivalence-5c2021deb306',
      },
      {
        date: '2021-11-12',
        name: 'Network upgrade to OVM 2.0',
        link: 'https://twitter.com/optimismPBC/status/1458953238867165192?s=20',
      },
    ],
  },
}
