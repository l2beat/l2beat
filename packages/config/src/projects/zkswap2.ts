import { CONTRACTS, NEW_CRYPTOGRAPHY, RISK_VIEW } from './common'
import { Project } from './types'
import { zkswap } from './zkswap'

export const zkswap2: Project = {
  name: 'ZKSwap 2.0',
  slug: 'zkswap2',
  associatedTokens: ['ZKS'],
  bridges: [
    {
      address: '0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3',
      sinceBlock: 12810001,
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
        'https://medium.com/@zkspaceofficial',
        'https://twitter.com/ZKSpaceOfficial',
        'https://discord.gg/UbjmQfUVvf',
        'https://t.me/ZKSpaceOfficial',
        'https://reddit.com/r/ZKSwap_Official/',
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
      category: zkswap.details.technology.category,
      stateCorrectness: zkswap.details.technology.stateCorrectness,
      newCryptography: {
        ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
        references: [
          {
            text: 'ZKSpace Whitepaper',
            href: 'https://github.com/l2labs/zkspace-whitepaper',
          },
        ],
      },
      dataAvailability: zkswap.details.technology.dataAvailability,
      operator: zkswap.details.technology.operator,
      forceTransactions: zkswap.details.technology.forceTransactions,
      exitMechanisms: zkswap.details.technology.exitMechanisms,
      contracts: {
        addresses: [
          {
            address: '0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3',
            name: 'ZkSync',
            description:
              'The main Rollup contract. Operator commits blocks, provides zkProof which is validated by the Verifier \
              contract and process withdrawals (executes blocks). Users deposit ETH and ERC20 tokens. This contract defines \
              the upgrade delay in the UPGRADE_NOTICE_PERIOD constant that is currently set to 8 days.',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7',
              implementation: '0xf2c351f22b148A9fF583a0F81701471a74E7338e',
            },
          },
          {
            address: '0xE26Ebb18144CD2d8DCB14cE87fdCfbEb81baCAD4',
            name: 'ZkSyncCommitBlock',
            description:
              'Additional contract to store implementation details of the main ZkSync contract.',
          },
          {
            address: 'c0221a4dfb792aa71ce84c2687b1d2b1e7d3eea0',
            name: 'ZkSyncExit',
            description: CONTRACTS.UNVERIFIED_DESCRIPTION,
          },
          {
            address: '86e527bc3c43e6ba3eff3a8cad54a7ed09cd8e8b',
            name: 'Governance',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7',
              implementation: '0x95269f9E76540459c797089034dc74b48dF780a2',
            },
          },
          {
            address: 'd2cbdcd7c6b3152bdff6549c208052e4dbcd575d',
            name: 'PairManager',
            description: CONTRACTS.UNVERIFIED_DESCRIPTION,
            upgradeability: {
              type: 'EIP1967',
              admin: '0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7',
              implementation: '0xB2639bA16c7A5b0C55cA22D77CdA3D7ED88A5c89',
            },
          },
          {
            address: '42f15efe22993c88441ef3467f2e6fa8ffa9adef',
            name: 'Verifier',
            description: 'zk-SNARK Plonk Verifier',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7',
              implementation: '0x94b9401945a9bc06ce5b69e6db3c6b671aabc829',
            },
          },
          {
            address: 'b56878d21f6b101f48bb55f1aa9d3f624f04e513',
            name: 'VerifierExit',
            description: CONTRACTS.UNVERIFIED_DESCRIPTION,
            upgradeability: {
              type: 'EIP1967',
              admin: '0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7',
              implementation: '0x17e51B3659884d70a306906B5BDD73D1c64a3892',
            },
          },
          {
            address: '0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7',
            name: 'UpgradeGatekeeper',
            description: CONTRACTS.UNVERIFIED_DESCRIPTION,
          },
        ],
        risks: [
          CONTRACTS.UPGRADE_WITH_DELAY_RISK('8 days'),
          CONTRACTS.UNVERIFIED_RISK,
        ],
      },
    },
    news: zkswap.details.news,
  },
}
