import { RISK } from './common'
import { Project } from './types'

export const zkswapv2: Project = {
  name: 'ZKSwap (v2)',
  slug: 'zkswapv2',
  associatedToken: 'ZKS',
  bridges: [
    {
      address: '0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3',
      sinceBlock: 12810001,
      tokens: [
        '1INCH',
        'AAVE',
        'ETH',
        'GT',
        'LRC',
        'OKB',
        'SNX',
        'SUSHI',
        'UNI',
        'USDC',
        'USDT',
        'WBTC',
        'ZKS',
      ],
    },
  ],
  details: {
    links: {
      websites: ['https://zks.org/'],
      apps: ['https://zks.app'],
      documentation: ['https://en.wiki.zks.org/'],
      explorers: ['https://zkswap.info'],
      repositories: ['https://github.com/l2labs/zkswap-contracts'],
      socialMedia: [
        'https://medium.com/@zkswapofficial',
        'https://twitter.com/ZKSwapOfficial',
        'https://discord.gg/rpjpeq4Y47',
        'https://t.me/zkswapofficial',
        'https://reddit.com/r/ZKSwap_Official/',
        'https://zks.org/en/blog',
      ],
    },
    technologyName: 'ZK Rollup',
    technology: {
      category: {
        name: 'ZK Rollup',
        references: [
          {
            text: 'a Layer-2 Token Swap Protocol based on ZK-Rollups Technology',
            href: 'https://medium.com/zkswap/zkswap-whitepaper-a-layer-2-token-swap-protocol-based-on-zk-rollup-113671ef3e6d',
          },
        ],
      },
      stateCorrectness: {
        name: 'ZK proofs ensure state correctness',
        description:
          'The published state root is correct ensured by zk_snark proofs',
        risks: [],
        references: [
          {
            text: 'ZKSwap Introduces Practical ZK-Rollups',
            href: 'https://medium.com/zkswap/zkswap-introduces-practical-zk-rollups-zkspeed-achieving-high-tps-and-low-gas-fees-in-real-6effe4e789e0',
          },
        ],
      },
      dataAvailability: {
        name: 'All transaction data is recorded on chain',
        description:
          'All transactions executed on the ZK-Rollups chain are submitted to the layer1 smart contract. The execution of the chain is based entirely on the submitted transactions, so anyone monitoring the layer1 contracts can know the correct state of the zkrollup chain.',
        risks: [],
        references: [
          {
            text: 'ZKSwap Introduces Practical ZK-Rollups',
            href: 'https://medium.com/zkswap/zkswap-introduces-practical-zk-rollups-zkspeed-achieving-high-tps-and-low-gas-fees-in-real-6effe4e789e0',
          },
        ],
      },
      exitMechanisms: [
        {
          name: 'Full Exit',
          description:
            'When a user initiates a full exit to layer1 contract, ZKSwap will include this transaction in a block and process. Then all the funds will be withdrawn to L1.',
          risks: [],
          references: [
            {
              text: 'ZkSync.sol - ZKSwap source code',
              href: 'https://github.com/l2labs/zkswap-contracts-v2/blob/master/contracts/ZkSync.sol#L404',
            },
          ],
        },
        {
          name: 'Partial Exit (Withdraw)',
          description:
            'When a user makes a withdraw transaction on layer2, ZKSwap will include this transaction in a block and process. Then the requested funds will be withdrawn to L1.',
          risks: [],
          references: [
            {
              text: 'Make Transaction',
              href: 'https://en.wiki.zks.org/interact-with-zkswap/make-transaction#withdraw',
            },
          ],
        },
      ],
      contracts: {
        addresses: [
          {
            address: '0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3',
            name: 'Bridge',
            upgradable: true,
            owner: {
              address: '0x0dcce462ddea102d3ecf84a991d3ecfc251e02c7 ',
              type: 'governance',
            },
          },
          {
            address: '0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B',
            name: 'Governance Bridge',
            upgradable: true,
            owner: {
              address: '0x0dcce462ddea102d3ecf84a991d3ecfc251e02c7',
              type: 'governance',
            },
          },
          {
            address: '0xf2c351f22b148A9fF583a0F81701471a74E7338e',
            name: 'ZkSync',
            upgradable: false,
            owner: {
              address: '0x9D7397204F32e0Ee919Ea3475630cdf131086255',
              type: 'other',
            },
          },
          {
            address: '0xE26Ebb18144CD2d8DCB14cE87fdCfbEb81baCAD4',
            name: 'ZkSyncCommitBlock',
            upgradable: false,
            owner: {
              address: '0x9D7397204F32e0Ee919Ea3475630cdf131086255',
              type: 'other',
            },
          },
          {
            address: '0x94b9401945a9bc06CE5B69e6dB3c6B671aABc829',
            name: 'Verifier',
            upgradable: false,
            owner: {
              address: '0x9D7397204F32e0Ee919Ea3475630cdf131086255',
              type: 'other',
            },
          },
          {
            address: '0x95269f9E76540459c797089034dc74b48dF780a2',
            name: 'Governance',
            upgradable: false,
            owner: {
              address: '0x9D7397204F32e0Ee919Ea3475630cdf131086255',
              type: 'other',
            },
          },
        ],
        risks: [],
      },
      operator: {
        name: 'The validator is centralized.',
        description:
          'In the beginning ZKSwap is asking users to trust its centralized sequencer. Will be decentraliazed at later stage.',
        risks: [],
        references: [
          {
            text: 'ZKSwap Validator',
            href: 'https://en.wiki.zks.org/techonology#3-validator',
          },
        ],
      },
      forceTransactions: {
        name: 'Users can force submit any withdraw transaction',
        description:
          'Because the state of ZKSwap is based on transactions submitted to the layer1 smart contract and anyone can submit their withdraw transactions there it allows the users to circumvent censorship by interacting with the smart contract directly.',
        risks: [],
        references: [
          {
            text: 'ZkSync.sol - ZKSwap source code',
            href: 'https://github.com/l2labs/zkswap-contracts-v2/blob/master/contracts/ZkSync.sol#L404',
          },
        ],
      },
    },
    purpose: 'Payments, Exchange',
    riskView: {
      stateValidation: RISK.STATE_ZKP_SN,
      dataAvailability: RISK.DATA_ON_CHAIN,
      upgradeability: RISK.UPGRADE_DELAY('8 days'),
      operatorCensoring: RISK.CENSORING_WITHDRAW_L1,
      operatorDown: RISK.DOWN_ESCAPE_ZKP,
    },
    parameters: [
      {
        name: 'Primary use case',
        value: 'Payments, Exchange',
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
          'Contracts are upgradable BUT on the upside there is a 8 days timelock',
        sentiment: 'warning',
        pointers: [
          {
            name: 'Bridge contract - source on Etherscan',
            href: 'https://etherscan.io/address/0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3#code',
          },
        ],
        value: 'Yes',
      },
      {
        name: 'Permissionless?',
        sentiment: 'bad',
        tooltip: 'Only whitelisted actors can produce new blocks',
        pointers: [
          {
            name: 'ZkSyncCommitBlock.sol#L46 - ZKSwap source code',
            href: 'https://github.com/l2labs/zkswap-contracts-v2/blob/master/contracts/ZkSyncCommitBlock.sol#L46',
          },
        ],
        value: 'No',
      },
      {
        name: 'Force TX mechanism?',
        sentiment: 'good',
        tooltip:
          'Tx can be forced into a rollup state or rollup goes into "exodus" mode and everyone can exit.',
        pointers: [
          {
            name: 'ZkSyncExit.sol - ZKSwap source code',
            href: 'https://github.com/l2labs/zkswap-contracts-v2/blob/master/contracts/ZkSyncExit.sol',
          },
          {
            name: 'ZkSyncCommitBlock.sol#L224 - ZKSwap source code',
            href: 'https://github.com/l2labs/zkswap-contracts-v2/blob/master/contracts/ZkSyncCommitBlock.sol#234',
          },
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
        date: '2021-08-10',
        name: 'ZKSwap To Launch 1,993 NFT Artworks Soon Amid NFT Boom, Says Lead Developer Alex Lee',
        link: 'https://zkswapofficial.medium.com/zkswap-to-launch-1-993-nft-artworks-soon-amid-nft-boom-says-lead-developer-alex-lee-4f2b09ffbc2d',
      },
      {
        date: '2021-08-06',
        name: 'ZKSwap Reveals 28311 Burnt ZKS Token in July',
        link: 'https://medium.com/zkswap/zkswap-reveals-28311-burnt-zks-token-in-july-a78b4aa92c5f',
      },
      {
        date: '2021-06-23',
        name: 'ZKSwap Launches V2 Testnet, Enabling Unlimited Token Listing',
        link: 'https://zkswapofficial.medium.com/zkswap-launches-v2-testnet-enabling-unlimited-token-listing-bf0c03a718e6',
      },
    ],
  },
}
