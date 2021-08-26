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
      tokens: ['ETH', 'LINK', 'USDT', 'WBTC'],
    },
  ],
  details: {
    warning:
      'Currently only whitelisted contracts can be deployed on Optimism.',
    description:
      'Optimistic Ethereum is an EVM-compatible Optimistic Rollup chain. It aims to be fast, simple, and secure.',
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
    riskView: {
      stateValidation: {
        value: 'Proofs disabled',
        description:
          'Currently the system permits invalid state roots. More details in project overview.',
        sentiment: 'bad',
      },
      dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
      upgradeability: RISK_VIEW.UPGRADABLE_YES,
      operatorCensoring: RISK_VIEW.CENSORING_TRANSACT_L1,
      operatorDown: RISK_VIEW.DOWN_NO_MECHANISM,
    },
    technology: {
      category: {
        name: 'Optimistic Rollup',
      },
      stateCorrectness: {
        name: 'Fraud proofs are disabled',
        description:
          'Ultimately Optimism will use fraud proofs to enforce state correctness. This feature is currently disabled and the system permits invalid state roots.',
        risks: [
          {
            category: 'Funds can be stolen if',
            text: 'an invalid state root is submitted to the system.',
            isCritical: true,
          },
        ],
        references: [
          {
            text: 'The incentive contract for verification proofs is disabled - Optimism FAQ',
            href: 'https://community.optimism.io/faqs/#the-incentive-contract-for-verification-proofs-is-disabled',
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
            text: 'Optimism operates the only "Sequencer" node - Optimism FAQ',
            href: 'https://community.optimism.io/faqs/#optimism-operates-the-only-sequencer-node',
          },
        ],
      },
      forceTransactions: {
        ...FORCE_TRANSACTIONS.CANONICAL_ORDERING,
        references: [
          {
            text: ' Chain Contracts - Optimism documentation',
            href: 'https://community.optimism.io/docs/protocol/protocol.html#chain-contracts',
          },
        ],
      },
      exitMechanisms: [
        {
          ...EXITS.REGULAR('optimistic', 'merkle proof'),
          references: [
            {
              text: ' Withdrawing back to L1 - Optimism documentation',
              href: 'https://community.optimism.io/docs/users/gateway.html#withdrawing-back-to-l1',
            },
          ],
          risks: [
            {
              category: 'Funds can be lost if',
              text: 'the centralized sequencer goes down and nobody can exit.',
              isCritical: true,
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
            text: 'Execution Contracts - Optimism documentation',
            href: 'https://community.optimism.io/docs/protocol/protocol.html#execution-contracts',
          },
          {
            text: 'Deployer Whitelist - Optimism documentation',
            href: 'https://community.optimism.io/docs/protocol/protocol.html#ovm-deployerwhitelist',
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
            name: 'L1ChugSplashProxy',
            address: '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1',
            description: CONTRACTS.UNVERIFIED_DESCRIPTION,
            upgradeability: {
              type: 'EIP1967',
              admin: '0x9996571372066A1545D3435C6935e3F9593A7eF5',
              implementation: '0x9091dda480B232133A7D2E4cb23336B4F0293196',
            },
          },
        ],
        risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK, CONTRACTS.UNVERIFIED_RISK],
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
    ],

    // DEPRECATED ITEMS BELOW

    technologyName: 'Optimistic Rollup',
    technologyDetails: 'Optimistic Virtual Machine',
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
        tooltip: 'Contracts are upgradable',
        sentiment: 'bad',
        value: 'Low',
      },
      {
        name: 'Can funds be stolen by the operator?',
        tooltip: 'Contracts are upgradable',
        sentiment: 'warning',
        pointers: [
          {
            name: 'Lib_AddressManager.sol#L47 - Optimism source code',
            href: 'https://github.com/ethereum-optimism/contracts/blob/master/contracts/optimistic-ethereum/libraries/resolver/Lib_AddressManager.sol#L47',
          },
          {
            name: 'SynthetixBridgeToOptimism.sol#L138 - Synthetix source code',
            href: 'https://github.com/Synthetixio/synthetix/blob/develop/contracts/SynthetixBridgeToOptimism.sol#L138',
          },
        ],
        value: 'Yes, through contract upgrade',
      },
      {
        name: 'Permissionless?',
        sentiment: 'bad',
        tooltip: 'Only sequencer can produce new blocks',
        pointers: [
          {
            name: 'OVM_CanonicalTransactionChain.sol#L411 - Optimism source code',
            href: 'https://github.com/ethereum-optimism/contracts/blob/master/contracts/optimistic-ethereum/OVM/chain/OVM_CanonicalTransactionChain.sol#L411',
          },
        ],
        value: 'No',
      },
      {
        name: 'Force TX mechanism?',
        sentiment: 'good',
        tooltip:
          'Sequencer can be forced to append particular TX into the rollup',
        pointers: [
          {
            name: 'OVM_CanonicalTransactionChain.sol#L256 - Optimism source code',
            href: 'https://github.com/ethereum-optimism/contracts/blob/master/contracts/optimistic-ethereum/OVM/chain/OVM_CanonicalTransactionChain.sol#L256',
          },
        ],
        value: 'Yes',
      },
      {
        name: 'Privacy',
        value: 'No',
      },
      {
        name: 'Smart contracts',
        tooltip:
          'Custom Solidity compiler. Currently, no new smart contracts can be deployed.',
        value: 'Yes',
      },
    ],
    notes: {
      text: 'Currently, fraud proof mechanism seems to be disabled. Optimism resolver resolved "OVM_FraudVerifier" to externally owned account and only this account can submit proofs.',
      pointers: [
        {
          name: 'EOA on Etherscan',
          href: 'https://etherscan.io/address/0xDDB4ae08438057FCfA323b20910f79912723a550',
        },
        {
          name: 'Github issue with more details',
          href: 'https://github.com/l2beat/l2beat/issues/35',
        },
      ],
    },
  },
}
