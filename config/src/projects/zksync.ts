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
    links: {
      websites: ['https://zksync.io/'],
      apps: ['https://wallet.zksync.io/'],
      documentation: ['https://zksync.io/dev/'],
      explorers: ['https://zkscan.io/'],
      repositories: ['https://github.com/matter-labs/zksync'],
      socialMedia: [
        'https://medium.com/matter-labs',
        'https://gitter.im/matter-labs/zksync',
        'https://discord.gg/px2aR7w',
        'https://t.me/zksync',
        'https://twitter.com/zksync',
      ],
    },
    technology: {
      name: 'zk-rollup',
      details: 'zk-SNARK',
    },
    purpose: 'Payments',
    parameters: [
      {
        name: 'Primary use case',
        value: 'Payments',
      },
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
          {
            name: 'Bridge contract - source on Etherscan',
            href: 'https://etherscan.io/address/0xaBEA9132b05A70803a4E85094fD0e1800777fBEF#code',
          },
        ],
      },
      {
        name: 'Permissionless?',
        value: 'No',
        sentiment: 'bad',
        tooltip: 'Only whitelisted actors can produce new blocks',
        pointers: [
          {
            name: 'ZkSync.sol#L268 - ZkSync source code',
            href: 'https://github.com/matter-labs/zksync/blob/1cda8c7c1a9bfbec6491a1e4634b0fc33b206834/contracts/contracts/ZkSync.sol#L268',
          },
        ],
      },
      {
        name: 'Force TX mechanism?',
        value: 'Yes but only for withdrawals',
        sentiment: 'good',
        tooltip:
          'Tx can be forced into a rollup state or rollup goes into "exodus" mode and everyone can exit.',
        pointers: [
          {
            name: 'ZkSync.sol#L223 - ZkSync source code',
            href: 'https://github.com/matter-labs/zksync/blob/1cda8c7c1a9bfbec6491a1e4634b0fc33b206834/contracts/contracts/ZkSync.sol#L223',
          },
          {
            name: 'ZkSync.sol#L352 - ZkSync source code',
            href: 'https://github.com/matter-labs/zksync/blob/1cda8c7c1a9bfbec6491a1e4634b0fc33b206834/contracts/contracts/ZkSync.sol#L352',
          },
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
        date: '2021-05-31',
        name: 'zkSync 2.0: Hello Ethereum!',
        link: 'https://medium.com/matter-labs/zksync-2-0-hello-ethereum-ca48588de179',
      },
      {
        date: '2021-05-24',
        name: 'zkSync 1.x: Swaps, NFTs, event system, and permissionless token listing',
        link: 'https://medium.com/matter-labs/zksync-1-x-swaps-nfts-event-system-and-permissionless-token-listing-e126fcc04d61',
      },
      {
        date: '2021-04-13',
        name: 'zkPorter: a breakthrough in L2 scaling',
        link: 'https://medium.com/matter-labs/zkporter-a-breakthrough-in-l2-scaling-ed5e48842fbf',
      },
      {
        date: '2021-03-27',
        name: 'zkSync 2.0 Roadmap Update: zkEVM Testnet in May, Mainnet in August',
        link: 'https://medium.com/matter-labs/zksync-2-0-roadmap-update-zkevm-testnet-in-may-mainnet-in-august-379c66995021',
      },
      {
        date: '2020-06-18',
        name: 'zkSync is Live! Bringing Trustless, Scalable Payments to Ethereum',
        link: 'https://medium.com/matter-labs/zksync-is-live-bringing-trustless-scalable-payments-to-ethereum-9c634b3e6823',
      },
    ],
  },
}
