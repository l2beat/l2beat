import { Project } from './Project'

export const zksync: Project = {
  name: 'zkSync',
  slug: 'zksync',
  bridges: [
    {
      address: '0xaBEA9132b05A70803a4E85094fD0e1800777fBEF',
      sinceBlock: 10269890,
      tokens: ['DAI', 'ETH', 'GLM', 'USDC', 'USDT', 'WBTC'],
    },
  ],
  details: {
    website: 'https://zksync.io/',
    color: '#8c8dfc',
    technology: {
      name: 'zk-rollup',
      details: 'zk-SNARK',
    },
    purpose: 'Payments',
    parameters: [
      { name: 'Primary use case', value: 'Payments' },
      {
        name: 'Hypothetical level of decentralization',
        value: 'High',
        sentiment: 'good',
      },
      {
        name: 'Current level of decentralization',
        value: 'Low',
        tooltip: 'Contracts are upgradable',
        sentiment: 'bad',
      },
      {
        name: 'Can funds be stolen by the operator?',
        value: 'Yes, through contract upgrade',
        tooltip:
          'Contracts are upgradable BUT on the upside there is a 14 days timelock',
        sentiment: 'neutral',
        pointers: [
          'https://etherscan.io/address/0xaBEA9132b05A70803a4E85094fD0e1800777fBEF#code',
        ],
      },
      {
        name: 'Permissionless?',
        value: 'No',
        sentiment: 'bad',
        tooltip: 'Only whitelisted actors can produce new blocks',
        pointers: [
          'https://github.com/matter-labs/zksync/blob/1cda8c7c1a9bfbec6491a1e4634b0fc33b206834/contracts/contracts/ZkSync.sol#L268',
        ],
      },
      {
        name: 'Force TX mechanism?',
        value: 'Yes but only for withdrawals',
        sentiment: 'good',
        tooltip:
          'Tx can be forced into a rollup state or rollup goes into "exodus" mode and everyone can exit.',
        pointers: [
          'https://github.com/matter-labs/zksync/blob/1cda8c7c1a9bfbec6491a1e4634b0fc33b206834/contracts/contracts/ZkSync.sol#L223',
          'https://github.com/matter-labs/zksync/blob/1cda8c7c1a9bfbec6491a1e4634b0fc33b206834/contracts/contracts/ZkSync.sol#L352',
        ],
      },
      {
        name: 'Privacy',
        value: 'No',
        tooltip: 'Theoretically possible in the future',
      },
      {
        name: 'Smart contracts',
        value: 'No',
        tooltip:
          'Possible in the near future (zinc - custom language or compiling from Solidity)',
      },
    ],
    news: [
      {
        name: 'zkSync 2.0 Roadmap Update: zkEVM Testnet in May, Mainnet in August',
        link: 'https://medium.com/matter-labs/zksync-2-0-roadmap-update-zkevm-testnet-in-may-mainnet-in-august-379c66995021',
      },
    ],
  },
}
