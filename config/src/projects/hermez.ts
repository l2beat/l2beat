import { Project } from './Project'

export const hermez: Project = {
  name: 'Hermez',
  slug: 'hermez',
  bridges: [
    {
      address: '0xA68D85dF56E733A06443306A095646317B5Fa633',
      sinceBlock: 12093596,
      tokens: ['DAI', 'ETH', 'LINK', 'UNI', 'USDC', 'USDT', 'WBTC', 'YFI'],
    },
  ],
  details: {
    website: 'https://hermez.io/',
    color: '#ff9933',
    technology: {
      name: 'zk-rollup',
      details: 'zk-SNARK',
    },
    parameters: [
      {
        name: 'Primary use case',
        value: 'Payments',
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
          'Contracts are upgradable BUT on the upside there is a 7 days timelock',
        sentiment: 'neutral',
        pointers: [
          'https://etherscan.io/address/0xA68D85dF56E733A06443306A095646317B5Fa633#code',
        ],
        value: 'Yes, through contract upgrade',
      },
      {
        name: 'Permissionless?',
        sentiment: 'bad',
        tooltip:
          'After initial bootstraping period anyone could bid for a slot time to forge new batches and update the state root',
        pointers: [
          'https://github.com/hermeznetwork/contracts/blob/master/contracts/auction/HermezAuctionProtocol.sol#L515',
          'https://github.com/hermeznetwork/contracts/blob/master/contracts/auction/HermezAuctionProtocol.sol#L571',
          'https://docs.hermez.io/#/developers/protocol/consensus/consensus',
        ],
        value: 'No',
      },
      {
        name: 'Force TX mechanism?',
        sentiment: 'good',
        tooltip:
          'Transaction can be forced via smart contract. Coordinators must process them',
        pointers: [
          'https://github.com/hermeznetwork/contracts/blob/master/contracts/hermez/Hermez.sol#L361',
          'https://docs.hermez.io/#/developers/protocol/hermez-protocol/protocol?id=l1-user-transactions',
        ],
        value: 'Yes',
      },
      {
        name: 'Privacy',
        value: 'No',
      },
      {
        name: 'Smart contracts',
        value: 'No',
      },
    ],
    news: [
      {
        name: 'Hermez Network Mainnet Launch on 4th of March 2021',
        link: 'https://blog.hermez.io/hermez-network-mainnet-launch/',
      },
    ],
  },
}
