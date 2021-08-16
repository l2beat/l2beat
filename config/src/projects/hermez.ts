import { RISK, TECHNOLOGY } from './common'
import { Project } from './types'

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
    links: {
      websites: ['https://hermez.io/'],
      apps: ['https://wallet.hermez.io/'],
      documentation: [
        'https://docs.hermez.io/',
        'https://hermez.io/hermez-whitepaper.pdf',
      ],
      explorers: ['https://explorer.hermez.io/'],
      repositories: [
        'https://github.com/hermeznetwork/contracts',
        'https://github.com/hermeznetwork/hermez-node',
      ],
      socialMedia: [
        'https://blog.hermez.io/',
        'https://t.me/hermez_network',
        'https://discord.gg/AczuUXDA2N',
        'https://twitter.com/hermez_network',
      ],
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
            text: 'ZK-Proofs - Hermez documentation',
            href: 'https://docs.hermez.io/#/about/security?id=zk-proofs',
          },
        ],
      },
      dataAvailability: {
        ...TECHNOLOGY.ON_CHAIN_DATA,
        references: [
          {
            text: 'Data Availability - Hermez documentation',
            href: 'https://docs.hermez.io/#/developers/glossary?id=data-availability',
          },
        ],
      },
      newCryptography: {
        ...TECHNOLOGY.ZK_SNARKS,
        references: [
          {
            text: 'ZK-Proofs - Hermez documentation',
            href: 'https://docs.hermez.io/#/about/security?id=zk-proofs',
          },
          {
            text: 'Multi-party Computation for the Trusted Setup - Hermez documentation',
            href: 'https://docs.hermez.io/#/about/security?id=multi-party-computation-for-the-trusted-setup',
          },
        ],
      },
      operator: {
        name: 'Anyone can become an operator',
        description:
          'The system runs an auction in which anyone can bid to become the operator for a set number of blocks. The operator will be able to propose blocks and collect fees during this window. Hermez will also run a operator known as boot coordinator that will propose blocks in case no one bids in the auction. This operator can be removed by the governance.',
        risks: [],
        references: [
          {
            text: 'Forging Consensus Protocol - Hermez documentation',
            href: 'https://docs.hermez.io/#/developers/protocol/consensus/consensus?id=forging-consensus-protocol',
          },
          {
            text: 'Boot Coordinator - Hermez documentation',
            href: 'https://docs.hermez.io/#/developers/protocol/consensus/consensus?id=boot-coordinator',
          },
        ],
      },
      forceTransactions: {
        name: 'Users can force submit any transaction',
        // extract - same as fuel
        description: 'Because the block production is open to anyone if users experience censorship from the operator they can propose their own blocks which would include their transactions.',
        risks: [],
        references: [
          {
            text: '',
            href: 'https://docs.hermez.io/#/faq/end-users?id=can-coordinators-censor-transactions'
          }
        ],
      },
      exitMechanisms: [
        /*
        Normal exit		"1. User submits a withdrawal request on L2
2. The block is proven
3. IF THE FUNDS ARE BELOW A CERTAIN AMOUNT. The user submits a merkle proof of the withdrawals and gets the funds"
Forced exit		"1. User submits a withdrawal request on L1
2. The coordinators pick up L1 transactions before L2 transactions
3. Same as normal exit"
Delayed exit		"1. User tries normal of forced exit
2. IF THE FUNDS ARE ABOVE A CERTAIN AMOUNT. The funds are transfered to the WithdrawalDelayer
3. After a specified delay has passed and THE EMERGENCY MODE HAS NOT BEEN ACTIVATED the funds can be withdrawn by the user"
Emergency mode		"1. User tries normal of forced exit
2. IF THE FUNDS ARE ABOVE A CERTAIN AMOUNT. The funds are transfered to the WithdrawalDelayer
3. IF THE EMERGENCY MODE HAS BEEN ACTIVATED. The funds are transferred to the governance"
*/
      ],
      contracts: {
        addresses: [
          // HermezAuctionProtocol: 0x15468b45ed46c8383f5c0b1b6cf2ecf403c2aec2
          // HermezAddress: 0xa68d85df56e733a06443306a095646317b5fa633
          // HermezWithdrawalDelayerAddress: 0x392361427ef5e17b69cfdd1294f31ab555c86124
          // HEZTokenAddress: 0xeef9f339514298c6a857efcfc1a762af84438dee
        ],
        risks: [],
      },
    },
    technologyName: 'ZK Rollup',
    technologyDetails: 'zk-SNARK',
    purpose: 'Payments',
    riskView: {
      stateCorrectness: RISK.SNARK_PROOFS,
      dataAvailability: RISK.DATA_ON_CHAIN,
      censorshipResistance: RISK.UNKNOWN,
      upgradeability: RISK.UPGRADABLE,
      owner: RISK.UNKNOWN,
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
        sentiment: 'warning',
        pointers: [
          {
            name: 'Bridge contract - source on Etherscan',
            href: 'https://etherscan.io/address/0xA68D85dF56E733A06443306A095646317B5Fa633#code',
          },
        ],
        value: 'Yes, through contract upgrade',
      },
      {
        name: 'Permissionless?',
        sentiment: 'bad',
        tooltip:
          'After initial bootstraping period anyone could bid for a slot time to forge new batches and update the state root',
        pointers: [
          {
            name: 'HermezAuctionProtocol.sol#L515 - Hermez source code',
            href: 'https://github.com/hermeznetwork/contracts/blob/master/contracts/auction/HermezAuctionProtocol.sol#L515',
          },
          {
            name: 'HermezAuctionProtocol.sol#L571 - Hermez source code',
            href: 'https://github.com/hermeznetwork/contracts/blob/master/contracts/auction/HermezAuctionProtocol.sol#L571',
          },
          {
            name: 'Hermez documentation',
            href: 'https://docs.hermez.io/#/developers/protocol/consensus/consensus',
          },
        ],
        value: 'No',
      },
      {
        name: 'Force TX mechanism?',
        sentiment: 'good',
        tooltip:
          'Transaction can be forced via smart contract. Coordinators must process them',
        pointers: [
          {
            name: 'Hermez.sol#L361 - Hermez source code',
            href: 'https://github.com/hermeznetwork/contracts/blob/master/contracts/hermez/Hermez.sol#L361',
          },
          {
            name: 'L1 user transactions - Hermez documentation',
            href: 'https://docs.hermez.io/#/developers/protocol/hermez-protocol/protocol?id=l1-user-transactions',
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
        value: 'No',
      },
    ],
    news: [
      {
        date: '2021-07-10',
        name: 'Hermez Coordinator Is Live On Testnet',
        link: 'https://blog.hermez.io/hermez-coordinator-live-on-testnet/',
      },
      {
        date: '2021-03-17',
        name: 'Hermez Network Mainnet Launch',
        link: 'https://blog.hermez.io/hermez-network-mainnet-launch/',
      },
    ],
  },
}
