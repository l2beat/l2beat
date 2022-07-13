import { ProjectId, UnixTime } from '@l2beat/common'

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
  name: 'ZKSwap 1.0',
  slug: 'zkswap',
  id: ProjectId('zkswap'),
  associatedTokens: ['ZKS'],
  bridges: [
    {
      address: '0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad',
      sinceTimestamp: new UnixTime(1613135194),
      tokens: '*',
    },
  ],
  details: {
    warning:
      'Version 3 of the protocol called ZkSpace is available and users are encouraged to move their assets there.',
    description:
      'ZKSwap is a fork of ZkSync with added AMM functionality. Based on ZK-Rollup technology, ZKSwap aims to execute the full functionality of Uniswap on Layer 2, while ensuring the core value of decentralized exchange. ZKSwap aims to increase the TPS by multiple orders of magnitude compared to Uniswap, and make transaction processing hardly consume any gas fees.',
    purpose: 'Payments, AMM',
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
      sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_EXIT_L1,
      validatorFailure: RISK_VIEW.VALIDATOR_ESCAPE_ZKP,
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
            text: 'ZkSync.sol#L404 - ZKSwap source code',
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
              text: 'ZkSync.sol#L404 - ZKSwap source code',
              href: 'https://github.com/l2labs/zkswap-contracts-v2/blob/master/contracts/ZkSync.sol#L404',
            },
          ],
        },
        {
          ...EXITS.EMERGENCY('Exodus Mode', 'zero knowledge proof'),
          references: [
            {
              text: 'ZkSyncCommitBlock.sol#L230-L246 - ZKSwap source code',
              href: 'https://github.com/l2labs/zkswap-contracts-v2/blob/3f650d28a266a56d49a3b3d2049cde34112efb14/contracts/ZkSyncCommitBlock.sol#L230-L246',
            },
          ],
        },
      ],
      contracts: {
        addresses: [
          {
            address: '0x8ECa806Aecc86CE90Da803b080Ca4E3A9b8097ad',
            name: 'ZkSync',
            description:
              'The main Rollup contract. Operator commits blocks, provides zkProof which is validated by the Verifier \
              contract and process withdrawals (executes blocks). Users deposit ETH and ERC20 tokens. This contract defines \
              the upgrade delay in the UPGRADE_NOTICE_PERIOD constant that is currently set to 8 days.',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x714B2D10210f2A3a7AA614F949259C87613689aB',
              implementation: '0x2F70F6D864F8F597a0ef57aDDf24323DFAb5797f',
            },
          },
          {
            address: '0x2c543eBd91DAB7Be40eDB671D48CeDF35A75e157',
            name: 'ZkSyncCommitBlock',
            description:
              'Additional contract to store implementation details of the main ZkSync contract.',
          },
          {
            address: '0x2c543eBd91DAB7Be40eDB671D48CeDF35A75e157',
            name: 'ZkSyncExit',
            description: CONTRACTS.UNVERIFIED_DESCRIPTION,
          },
          {
            address: '0x02ecef526f806f06357659fFD14834fe82Ef4B04',
            name: 'Governance',
            description:
              'Keeps a list of block producers and whitelisted tokens.',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x714B2D10210f2A3a7AA614F949259C87613689aB',
              implementation: '0x9d3fdf9b4782753d12f6262bf22B6322608962b8',
            },
          },
          {
            address: '0x661121AE41edE3f6FECDed922c59acC19A3ea9B3',
            name: 'PairManager',
            description: CONTRACTS.UNVERIFIED_DESCRIPTION,
            upgradeability: {
              type: 'EIP1967',
              admin: '0x714B2D10210f2A3a7AA614F949259C87613689aB',
              implementation: '0x65Fab217f1948af2D7A8eEB11fF111B0993C5Df8',
            },
          },
          {
            address: '0x27C229937745d697d28FC7853d1bFEA7331Edf56',
            name: 'Verifier',
            description: CONTRACTS.UNVERIFIED_DESCRIPTION,
            upgradeability: {
              type: 'EIP1967',
              admin: '0x714B2D10210f2A3a7AA614F949259C87613689aB',
              implementation: '0x165dFA76DFD3F6ad6Ad614aE4566C2E9262E532F',
            },
          },
          {
            address: '0x961369d347EF7A6896BDD39cBE2B89e3911f521f',
            name: 'VerifierExit',
            description: CONTRACTS.UNVERIFIED_DESCRIPTION,
            upgradeability: {
              type: 'EIP1967',
              admin: '0x714B2D10210f2A3a7AA614F949259C87613689aB',
              implementation: '0xd12F4D8329584F36aEd67f807F42D9a02bEb9534',
            },
          },
          {
            address: '0x714B2D10210f2A3a7AA614F949259C87613689aB',
            name: 'UpgradeGatekeeper',
            description:
              'This is the contract that implements the upgrade mechanism for Governance, Verifier and ZkSync. It relies on the ZkSync contract to enforce upgrade delays.',
          },
        ],
        risks: [
          CONTRACTS.UPGRADE_WITH_DELAY_RISK('8 days'),
          CONTRACTS.UNVERIFIED_RISK,
        ],
      },
      permissions: [
        {
          name: 'zkSwap 1.0 Admin',
          accounts: [
            {
              type: 'EOA',
              address: '0x7D1a14eeD7af8e26f24bf08BA6eD7A339AbcF037',
            },
          ],
          description:
            'This address is the master of Upgrade Gatekeeper contract, which is allowed to perform upgrades for Governance, Verifier, VerifierExit, PairManager and ZkSync contracts.',
        },
        {
          name: 'Active validator',
          accounts: [
            {
              address: '0x042147Bd43d3f59B3133eE08322B67E4e9f2fDb3',
              type: 'EOA',
            },
          ],
          description:
            'This actor is allowed to propose, revert and execute L2 blocks on L1. A list of active validators is kept inside Governance contract and can be updated by zkSwap 1.0 Admin.',
        },
      ],
    },
    news: [
      {
        date: '2021-120-20',
        name: 'L2 Labs Launches All-in-One Layer2 Platform ZKSpace, Featuring ZKSwap v3.0, NFTs, & Payments',
        link: 'https://medium.com/zkswap/l2-labs-launches-all-in-one-layer2-platform-zkspace-featuring-zkswap-v3-0-nfts-payments-82dae7d9207c',
      },
      {
        date: '2021-08-25',
        name: 'ZKSwap Announces Deployment of V2 on BSC Mainnet',
        link: 'https://medium.com/zkswap/zkswap-announces-deployment-of-v2-on-bsc-mainnet-53395c15a856',
      },
      {
        date: '2021-08-23',
        name: 'PoS Mining is Back',
        link: 'https://medium.com/zkswap/pos-mining-is-back-5732c3975f5c',
      },
      {
        date: '2021-08-23',
        name: 'ZKSwap Tech Review: SKALE — An Elastic, Decentralized Sidechain Network',
        link: 'https://medium.com/zkswap/zkswap-tech-review-skale-an-elastic-decentralized-sidechain-network-978a6e7167e3',
      },
    ],
  },
}
