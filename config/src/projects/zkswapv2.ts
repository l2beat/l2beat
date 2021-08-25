import { CONTRACTS, RISK_VIEW } from './common'
import { Project } from './types'
import { zkswap } from './zkswap'

export const zkswapv2: Project = {
  name: 'ZKSwap V2',
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
      category: zkswap.details.technology.category,
      stateCorrectness: zkswap.details.technology.stateCorrectness,
      newCryptography: zkswap.details.technology.newCryptography,
      dataAvailability: zkswap.details.technology.dataAvailability,
      operator: zkswap.details.technology.operator,
      forceTransactions: zkswap.details.technology.forceTransactions,
      exitMechanisms: zkswap.details.technology.exitMechanisms,
      contracts: {
        addresses: [
          {
            address: '0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7',
            name: 'UpgradeGatekeeper',
            description:
              'This is most likely the contract that implements the upgrade mechanism for Governance and ZkSync. It relies on the ZkSync contract to enforce upgrade delays. The source code of this contract is not verified on Etherscan.',
          },
          {
            address: '0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3',
            name: 'ZkSync',
            description:
              'This contract defines the upgrade delay. Unfortunately this information is stored in an internal constant and not exposed as a public view method. The UPGRADE_NOTICE_PERIOD constant is currently set to 691200 seconds which equals 8 days. Every time the contract upgrades this information has to be verified again.',
            upgradeability: {
              type: 'EIP1967',
              implementation: '0xf2c351f22b148A9fF583a0F81701471a74E7338e',
              admin: '0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7',
            },
          },
          {
            address: '0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B',
            name: 'Governance',
            upgradeability: {
              type: 'EIP1967',
              implementation: '0x95269f9E76540459c797089034dc74b48dF780a2',
              admin: '0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7',
            },
          },
          {
            address: '0x94b9401945a9bc06CE5B69e6dB3c6B671aABc829',
            name: 'Verifier',
          },
          {
            address: '0xC0221a4Dfb792AA71CE84C2687b1D2b1E7D3eea0',
            name: 'ZkSyncExit',
            description: CONTRACTS.UNVERIFIED_DESCRIPTION,
            upgradeability: {
              type: 'Reference',
              base: 'ZkSync',
              method: 'function zkSyncExitAddress() view returns(address)',
            },
          },
          {
            address: '0xE26Ebb18144CD2d8DCB14cE87fdCfbEb81baCAD4',
            name: 'ZkSyncCommitBlock',
            upgradeability: {
              type: 'Reference',
              base: 'ZkSync',
              method:
                'function zkSyncCommitBlockAddress() view returns(address)',
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

    // DEPRECATED ITEMS BELOW

    technologyName: 'ZK Rollup',
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
  },
}
