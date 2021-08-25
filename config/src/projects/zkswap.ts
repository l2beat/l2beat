import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { Project } from './types'

export const zkswap: Project = {
  name: 'ZKSwap',
  slug: 'zkswap',
  associatedToken: 'ZKS',
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
        'ZKS',
      ],
    },
  ],
  details: {
    purpose: 'Payments, Exchange',
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
    riskView: {
      stateValidation: RISK_VIEW.STATE_ZKP_SN,
      dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
      upgradeability: RISK_VIEW.UPGRADE_DELAY('8 days'),
      operatorCensoring: RISK_VIEW.CENSORING_FORCE_EXIT_L1,
      operatorDown: RISK_VIEW.DOWN_ESCAPE_ZKP,
    },
    technology: {
      category: {
        name: 'ZK Rollup',
      },
      stateCorrectness: {
        ...STATE_CORRECTNESS.VALIDITY_PROOFS,
        references: [
          {
            text: 'ZKSwap Introduces Practical ZK-Rollups - Medium blog',
            href: 'https://medium.com/zkswap/zkswap-introduces-practical-zk-rollups-zkspeed-achieving-high-tps-and-low-gas-fees-in-real-6effe4e789e0',
          },
        ],
      },
      newCryptography: {
        ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
        references: [
          {
            text: 'ZKSwap Whitepaper - Medium blog',
            href: 'https://medium.com/zkswap/zkswap-whitepaper-a-layer-2-token-swap-protocol-based-on-zk-rollup-113671ef3e6d',
          },
        ],
      },
      dataAvailability: {
        ...DATA_AVAILABILITY.ON_CHAIN,
        references: [
          {
            text: 'ZKSwap Introduces Practical ZK-Rollups - Medium blog',
            href: 'https://medium.com/zkswap/zkswap-introduces-practical-zk-rollups-zkspeed-achieving-high-tps-and-low-gas-fees-in-real-6effe4e789e0',
          },
        ],
      },
      operator: {
        ...OPERATOR.CENTRALIZED_OPERATOR,
        references: [
          {
            text: 'ZKSwap Validator - ZKSwap wiki',
            href: 'https://en.wiki.zks.org/techonology#3-validator',
          },
        ],
      },
      forceTransactions: {
        ...FORCE_TRANSACTIONS.WITHDRAW_OR_HALT,
        references: [
          {
            text: 'ZkSync.sol - ZKSwap source code',
            href: 'https://github.com/l2labs/zkswap-contracts-v2/blob/master/contracts/ZkSync.sol#L404',
          },
        ],
      },
      exitMechanisms: [
        {
          ...EXITS.REGULAR('zk', 'no proof'),
          references: [
            {
              text: 'Make Transaction',
              href: 'https://en.wiki.zks.org/interact-with-zkswap/make-transaction#withdraw',
            },
          ],
        },
        {
          ...EXITS.FORCED,
          references: [
            {
              text: 'ZkSync.sol - ZKSwap source code',
              href: 'https://github.com/l2labs/zkswap-contracts-v2/blob/master/contracts/ZkSync.sol#L404',
            },
          ],
        },
        {
          ...EXITS.EMERGENCY('Exodus Mode', 'zero knowledge proof'),
        },
      ],
      contracts: {
        addresses: [
          {
            address: '0x714B2D10210f2A3a7AA614F949259C87613689aB',
            name: 'UpgradeGatekeeper',
            description:
              'This is the contract that implements the upgrade mechanism for Governance, Verifier and ZkSync. It relies on the ZkSync contract to enforce upgrade delays.',
          },
          {
            address: '0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad',
            name: 'ZkSync',
            description:
              'This contract defines the upgrade delay. Unfortunately this information is stored in an internal constant and not exposed as a public view method. The UPGRADE_NOTICE_PERIOD constant is currently set to 691200 seconds which equals 8 days. Every time the contract upgrades this information has to be verified again.',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x714B2D10210f2A3a7AA614F949259C87613689aB',
              implementation: '0x2F70F6D864F8F597a0ef57aDDf24323DFAb5797f',
            },
          },
          {
            address: '0x02ecef526f806f06357659fFD14834fe82Ef4B04',
            name: 'Governance',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x714B2D10210f2A3a7AA614F949259C87613689aB',
              implementation: '0x9d3fdf9b4782753d12f6262bf22B6322608962b8',
            },
          },
          {
            address: '0x661121AE41edE3f6FECDed922c59acC19A3ea9B3',
            name: 'Unknown1',
            description: CONTRACTS.UNVERIFIED_DESCRIPTION,
            upgradeability: {
              type: 'EIP1967',
              admin: '0x714B2D10210f2A3a7AA614F949259C87613689aB',
              implementation: '0x65Fab217f1948af2D7A8eEB11fF111B0993C5Df8',
            },
          },
          {
            address: '0x27C229937745d697d28FC7853d1bFEA7331Edf56',
            name: 'Unknown2',
            description: CONTRACTS.UNVERIFIED_DESCRIPTION,
            upgradeability: {
              type: 'EIP1967',
              admin: '0x714B2D10210f2A3a7AA614F949259C87613689aB',
              implementation: '0x165dFA76DFD3F6ad6Ad614aE4566C2E9262E532F',
            },
          },
          {
            address: '0x961369d347EF7A6896BDD39cBE2B89e3911f521f',
            name: 'Unknown3',
            description: CONTRACTS.UNVERIFIED_DESCRIPTION,
            upgradeability: {
              type: 'EIP1967',
              admin: '0x714B2D10210f2A3a7AA614F949259C87613689aB',
              implementation: '0xd12F4D8329584F36aEd67f807F42D9a02bEb9534',
            },
          },
        ],
        risks: [
          CONTRACTS.UPGRADE_WITH_DELAY_RISK('8 days'),
          CONTRACTS.UNVERIFIED_RISK,
        ],
      },
    },
    news: [
      {
        date: '2021-03-22',
        name: 'ZKSwap 100% ZK-Rollup Update Completed ',
        link: 'https://zkswapofficial.medium.com/zkswap-100-zk-rollup-update-completed-and-announces-gzks-governance-tokens-to-further-support-3e4b113f4f49',
      },
      {
        date: '2021-03-02',
        name: 'ZKSwap Sets Out Roadmap for 2021',
        link: 'https://zkswapofficial.medium.com/zkswap-sets-out-roadmap-for-2021-1fb39be999b3',
      },
      {
        date: '2021-03-02',
        name: 'Defying the stigma, ZKSwap’s Clarification on Bad Rumours',
        link: 'https://zkswapofficial.medium.com/defying-the-stigma-zkswaps-clarification-on-bad-rumours-b9cc29ba87b4',
      },
      {
        date: '2021-02-25',
        name: 'Few Thoughts about Keeping L2 Data Off-Chain: A Trade-Off between L2 Efficiency and Data Availability',
        link: 'https://zkswapofficial.medium.com/few-thoughts-about-keeping-l2-data-off-chain-a-trade-off-between-l2-efficiency-and-data-95800e960e1b',
      },
      {
        date: '2021-02-14',
        name: 'ZKSwap Live on Ethereum, Layer2 Assets Exceeding $40 Million, and Liquidity over $27 Million 1 Hour after Launch',
        link: 'https://medium.com/zkswap/zkswap-live-on-ethereum-layer2-assets-exceeding-40-million-and-liquidity-over-27-million-1-3af96eb42768',
      },
    ],

    // DEPRECATED ITEMS BELOW

    technologyName: 'Validium',
    technologyDetails: 'ZKSpeed',
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
          'Contracts are upgradable BUT on the upside there is a 14 days timelock',
        sentiment: 'good',
        pointers: [
          {
            name: 'Bridge contract - source on Etherscan',
            href: 'https://etherscan.io/address/0x8eca806aecc86ce90da803b080ca4e3a9b8097ad#code',
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
            href: 'https://github.com/l2labs/zkswap-contracts/blob/e0686dfd40d92ab56425cb760fe342921f228d9f/contracts/ZkSyncCommitBlock.sol#L46',
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
            href: 'https://github.com/l2labs/zkswap-contracts/blob/main/contracts/ZkSyncExit.sol',
          },
          {
            name: 'ZkSyncCommitBlock.sol#L224 - ZKSwap source code',
            href: 'https://github.com/l2labs/zkswap-contracts/blob/e0686dfd40d92ab56425cb760fe342921f228d9f/contracts/ZkSyncCommitBlock.sol#L224',
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
    notes: {
      text: 'Spikes in TVL are caused by liquidity mining events',
      pointers: [
        {
          name: 'Liquidity Mining - ZKSwap Medium blog',
          href: 'https://zkswapofficial.medium.com/proof-of-liquidity-mining-upcoming-with-9-million-zks-rewards-218eaa1843a2',
        },
      ],
    },
  },
}
