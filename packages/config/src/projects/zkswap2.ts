import { ProjectId, UnixTime } from '@l2beat/types'

import { CONTRACTS, NEW_CRYPTOGRAPHY, RISK_VIEW } from './common'
import { Project } from './types'
import { zkswap } from './zkswap'

export const zkswap2: Project = {
  name: 'ZKSwap 2.0',
  slug: 'zkswap2',
  id: ProjectId('zkswap2'),
  associatedTokens: ['ZKS'],
  bridges: [
    {
      address: '0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3',
      sinceTimestamp: new UnixTime(1626059966),
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
            address: '0xC0221a4Dfb792AA71CE84C2687b1D2b1E7D3eea0',
            name: 'ZkSyncExit',
            description: CONTRACTS.UNVERIFIED_DESCRIPTION,
          },
          {
            address: '0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B',
            name: 'Governance',
            description:
              'Keeps a list of block producers and whitelisted tokens.',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7',
              implementation: '0x95269f9E76540459c797089034dc74b48dF780a2',
            },
          },
          {
            address: '0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D',
            name: 'PairManager',
            description: CONTRACTS.UNVERIFIED_DESCRIPTION,
            upgradeability: {
              type: 'EIP1967',
              admin: '0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7',
              implementation: '0xB2639bA16c7A5b0C55cA22D77CdA3D7ED88A5c89',
            },
          },
          {
            address: '0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef',
            name: 'Verifier',
            description: 'zk-SNARK Plonk Verifier.',
            upgradeability: {
              type: 'EIP1967',
              admin: '0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7',
              implementation: '0x94b9401945a9bc06CE5B69e6dB3c6B671aABc829',
            },
          },
          {
            address: '0xb56878d21F6b101f48bb55f1AA9D3F624f04E513',
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
      permissions: [
        {
          name: 'zkSwap 2.0 Admin',
          accounts: [
            {
              type: 'EOA',
              address: '0x9D7397204F32e0Ee919Ea3475630cdf131086255',
            },
          ],
          description:
            'This address is the master of Upgrade Gatekeeper contract, which is allowed to perform upgrades for Governance, Verifier, VerifierExit, PairManager and ZkSync contracts.',
        },
        {
          name: 'Active validator',
          accounts: [
            {
              address: '0x38101ae98196C8BCf7dF1835Bf3983B384272ae4',
              type: 'EOA',
            },
          ],
          description:
            'This actor is allowed to propose, revert and execute L2 blocks on L1. A list of active validators is kept inside Governance contract and can be updated by zkSwap 2.0 Admin.',
        },
      ],
    },
    news: zkswap.details.news,
  },
}
