import { Project } from './Project'

export const zkswap: Project = {
  name: 'ZKSwap',
  slug: 'zkswap',
  bridges: [
    {
      address: '0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad',
      sinceBlock: 11841962,
      tokens: [
        '1INCH',
        'AAVE',
        'BNB',
        'BUSD',
        'DAI',
        'ETH',
        'LINK',
        'LRC',
        'MKR',
        'REN',
        'RUNE',
        'SNX',
        'SUSHI',
        'UNI',
        'USDC',
        'USDT',
        'WBTC',
        'YFI',
      ],
    },
  ],
  details: {
    website: 'https://zks.org/',
    color: '#5a11a8',
    showNotL2Warning: true,
    technology: {
      name: 'validium',
      details: 'ZKSpeed',
    },
    purpose: 'Payments, Exchange',
    parameters: [
      {
        name: 'Primary use case',
        value: 'DEX, Payments',
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
        tooltip:
          'Contracts are upgradable BUT on the upside there is a 14 days timelock',
        sentiment: 'good',
        pointers: [
          'https://etherscan.io/address/0x8eca806aecc86ce90da803b080ca4e3a9b8097ad#code',
        ],
        value: 'Yes',
      },
      {
        name: 'Permissionless?',
        sentiment: 'bad',
        tooltip: 'Only whitelisted actors can produce new blocks',
        pointers: [
          'https://github.com/l2labs/zkswap-contracts/blob/e0686dfd40d92ab56425cb760fe342921f228d9f/contracts/ZkSyncCommitBlock.sol#L46',
        ],
        value: 'No',
      },
      {
        name: 'Force TX mechanism?',
        sentiment: 'good',
        tooltip:
          'Tx can be forced into a rollup state or rollup goes into "exodus" mode and everyone can exit.',
        pointers: [
          'https://github.com/l2labs/zkswap-contracts/blob/main/contracts/ZkSyncExit.sol',
          'https://github.com/l2labs/zkswap-contracts/blob/e0686dfd40d92ab56425cb760fe342921f228d9f/contracts/ZkSyncCommitBlock.sol#L224',
        ],
        value: 'Yes but only for withdrawals',
      },
      {
        name: 'Privacy',
        tooltip: 'Theoretically possible in the future',
        value: 'No',
      },
      {
        name: 'Smart contracts',
        tooltip: 'Possible in the future',
        value: 'No',
      },
    ],
    news: [
      {
        name: 'ZKSwap Sets Out Roadmap for 2021',
        link: 'https://zkswapofficial.medium.com/zkswap-sets-out-roadmap-for-2021-1fb39be999b3',
      },
    ],
    notes: {
      text: 'Spikes in TVL are caused by liquidity mining events',
      pointers: [
        'https://zkswapofficial.medium.com/proof-of-liquidity-mining-upcoming-with-9-million-zks-rewards-218eaa1843a2',
      ],
    },
  },
}
