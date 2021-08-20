import {
  DATA_AVAILABILITY,
  FORCE_TRANSACTIONS,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
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
    purpose: 'Payments',
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
    riskView: {
      stateValidation: RISK_VIEW.STATE_ZKP_SN,
      dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
      upgradeability: RISK_VIEW.UPGRADABLE_YES,
      operatorCensoring: RISK_VIEW.CENSORING_WITHDRAW_L1,
      operatorDown: RISK_VIEW.DOWN_PROPOSE_BLOCKS,
    },
    technology: {
      category: {
        name: 'ZK Rollup',
      },
      stateCorrectness: {
        ...STATE_CORRECTNESS.VALIDITY_PROOFS,
        references: [
          {
            text: 'ZK-Proofs - Hermez documentation',
            href: 'https://docs.hermez.io/#/about/security?id=zk-proofs',
          },
        ],
      },
      newCryptography: {
        ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
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
      dataAvailability: {
        ...DATA_AVAILABILITY.ON_CHAIN,
        references: [
          {
            text: 'Data Availability - Hermez documentation',
            href: 'https://docs.hermez.io/#/developers/glossary?id=data-availability',
          },
        ],
      },
      operator: {
        ...OPERATOR.DECENTRALIZED_OPERATOR,
        description:
          'The system runs an auction in which anyone can bid to become the operator for a set number of blocks. The operator will be able to propose blocks and collect fees during this window. Hermez will also run a operator known as boot coordinator that will propose blocks in case no one bids in the auction. This operator can be removed by the governance.',
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
        ...FORCE_TRANSACTIONS.PROPOSE_OWN_BLOCKS,
        references: [
          {
            text: 'Can coordinators censor transactions? - Hermez documentation',
            href: 'https://docs.hermez.io/#/faq/end-users?id=can-coordinators-censor-transactions',
          },
        ],
      },
      exitMechanisms: [
        {
          name: 'Regular withdraw',
          description:
            'The user initiates a withdrawal request on L2. When the block containing the request is proved on L1, the user can withdraw the funds with an L1 transaction. This operation requires the user to submit a merkle proof of their funds. This operation cannot be performed if the withdrawal exceeds certain threshold.',
          risks: [],
          references: [
            {
              text: 'Withdrawing Funds from Hermez - Hermez documentation',
              href: 'https://docs.hermez.io/#/developers/sdk?id=withdrawing-funds-from-hermez',
            },
          ],
        },
        {
          name: 'Forced withdraw',
          description:
            'The user submits the withdrawal request on L1. This forces the operators to pick up the request before other L2 transactions. A block still needs to be proved, the user still submits a merkle proof, and the funds threshold still cannot be exceeded.',
          risks: [],
          references: [
            {
              text: 'Force Exit - Hermez documentation',
              href: 'https://docs.hermez.io/#/developers/sdk?id=force-exit',
            },
          ],
        },
        {
          name: 'Delayed withdraw',
          description:
            'When the user does a regular or forced withdraw and their funds exceed a certain threshold a timer activates. After a specified time has passed and the emergency mode has not been activated the funds can be withdrawn.',
          risks: [],
          references: [
            {
              text: 'Withdrawal Delayer Mechanism - Hermez documentation',
              href: 'https://docs.hermez.io/#/developers/protocol/withdrawal-delayer/withdrawal-delayer?id=mechanism',
            },
          ],
        },
        {
          name: 'Emergency mode',
          description:
            "When the user does a regular or forced withdraw and their funds exceed a certain threshold a timer activates. The operators can now trigger emergency mode and transfer the user's funds to the governance.",
          risks: [],
          references: [
            {
              text: 'Withdrawal Delayer Mechanism - Hermez documentation',
              href: 'https://docs.hermez.io/#/developers/protocol/withdrawal-delayer/withdrawal-delayer?id=mechanism',
            },
          ],
        },
      ],
      contracts: {
        addresses: [
          {
            name: 'HermezAuctionProtocol',
            address: '0x15468b45ed46c8383f5c0b1b6cf2ecf403c2aec2',
            upgradeability: {
              type: 'EIP1967',
              implementation: '0x9D62Cdc389caaB35ada830A7C6Ae847D5E8512C6',
              admin: '0x07a00a617e1DaB02Aa31887Eb5d521d4529a32E3',
            },
          },
          {
            name: 'Hermez',
            address: '0xa68d85df56e733a06443306a095646317b5fa633',
            upgradeability: {
              type: 'EIP1967',
              implementation: '0x6D85D79D69b7e190E671C16e8611997152bD3e95',
              admin: '0x07a00a617e1DaB02Aa31887Eb5d521d4529a32E3',
            },
          },
          {
            name: 'WithdrawalDelayer',
            address: '0x392361427ef5e17b69cfdd1294f31ab555c86124',
          },
          {
            name: 'HEZ',
            address: '0xeef9f339514298c6a857efcfc1a762af84438dee',
          },
        ],
        risks: [],
      },
    },
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

    // DEPRECATED ITEMS BELOW

    technologyName: 'ZK Rollup',
    technologyDetails: 'zk-SNARK',
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
  },
}
