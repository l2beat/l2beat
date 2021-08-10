import { RISK } from './common/risk'
import { Project } from './types'

export const optimism: Project = {
  name: 'Optimism',
  slug: 'optimism',
  bridges: [
    {
      // TODO: this one seems unused but there are tokens locked
      address: '0x045e507925d2e05D114534D0810a1abD94aca8d6',
      sinceBlock: 11656238,
      tokens: ['SNX'],
    },
    {
      // TODO: this one seems unused but there are tokens locked
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
    technologyName: 'Optimistic Rollup',
    technologyDetails: 'Optimistic Virtual Machine',
    purpose: 'Universal',
    riskView: {
      stateCorrectness: RISK.FRAUD_PROOFS,
      dataAvailability: RISK.UNKNOWN,
      censorshipResistance: RISK.UNKNOWN,
      upgradeability: RISK.UNKNOWN,
      owner: RISK.UNKNOWN,
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
    news: [
      {
        date: '2021-07-14',
        name: 'Announcing Uniswap V3 on Optimism',
        link: 'https://optimismpbc.medium.com/announcing-uniswap-v3-on-optimism-6fb033398a11',
      },
      {
        date: '2021-03-26',
        name: 'Postponing mainnet launch',
        link: 'https://optimismpbc.medium.com/optimistically-cautious-767a898f90c8',
      },
      {
        date: '2021-01-16',
        name: 'Mainnet Soft Launch!',
        link: 'https://optimismpbc.medium.com/mainnet-soft-launch-7cacc0143cd5',
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
