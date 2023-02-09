import { ProjectId, UnixTime } from '@l2beat/shared'

import {
  CONTRACTS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  RISK_VIEW,
} from './common'
import { ProjectDiscovery } from './common/ProjectDiscovery'
import { Layer2 } from './types'
import { zkswap } from './zkswap'

const discovery = new ProjectDiscovery('zkswap2')

export const zkswap2: Layer2 = {
  type: 'layer2',
  id: ProjectId('zkswap2'),
  display: {
    name: 'ZKSwap 2.0',
    slug: 'zkswap2',
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
  },
  config: {
    associatedTokens: ['ZKS'],
    escrows: [
      {
        address: '0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3',
        sinceTimestamp: new UnixTime(1626059966),
        tokens: '*',
      },
    ],
    events: [],
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_SN,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    upgradeability: RISK_VIEW.UPGRADE_DELAY('8 days'),
    sequencerFailure: RISK_VIEW.SEQUENCER_FORCE_EXIT_L1,
    validatorFailure: RISK_VIEW.VALIDATOR_ESCAPE_ZKP,
    destinationToken: RISK_VIEW.NATIVE_AND_CANONICAL(),
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {
    provider: 'zkSync',
    category: zkswap.technology.category,
    stateCorrectness: zkswap.technology.stateCorrectness,
    newCryptography: {
      ...NEW_CRYPTOGRAPHY.ZK_SNARKS,
      references: [
        {
          text: 'ZKSpace Whitepaper',
          href: 'https://github.com/l2labs/zkspace-whitepaper',
        },
      ],
    },
    dataAvailability: zkswap.technology.dataAvailability,
    operator: zkswap.technology.operator,
    forceTransactions: zkswap.technology.forceTransactions,
    exitMechanisms: zkswap.technology.exitMechanisms,
  },
  contracts: {
    addresses: [
      {
        address: '0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3',
        name: 'ZkSync',
        description:
          'The main Rollup contract. Operator commits blocks, provides zkProof which is validated by the Verifier \
              contract and process withdrawals (executes blocks). Users deposit ETH and ERC20 tokens. This contract defines \
              the upgrade delay in the UPGRADE_NOTICE_PERIOD constant that is currently set to 8 days.',
        upgradeability: discovery.getContract(
          '0x6dE5bDC580f55Bc9dAcaFCB67b91674040A247e3',
        ).upgradeability,
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
      },
      {
        address: '0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B',
        name: 'Governance',
        description: 'Keeps a list of block producers and whitelisted tokens.',
        upgradeability: discovery.getContract(
          '0x86E527BC3C43E6Ba3eFf3A8CAd54A7Ed09cD8E8B',
        ).upgradeability,
      },
      {
        address: '0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D',
        name: 'PairManager',
        upgradeability: discovery.getContract(
          '0xD2cbDcd7C6b3152BdFf6549C208052E4DBcd575D',
        ).upgradeability,
      },
      {
        address: '0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef',
        name: 'Verifier',
        description: 'zk-SNARK Plonk Verifier.',
        upgradeability: discovery.getContract(
          '0x42F15EFE22993C88441EF3467f2E6Fa8FFA9ADef',
        ).upgradeability,
      },
      {
        address: '0xb56878d21F6b101f48bb55f1AA9D3F624f04E513',
        name: 'VerifierExit',
        upgradeability: discovery.getContract(
          '0xb56878d21F6b101f48bb55f1AA9D3F624f04E513',
        ).upgradeability,
      },
      {
        address: '0x0DCCe462ddEA102D3ecf84A991d3ecFC251e02C7',
        name: 'UpgradeGatekeeper',
      },
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK('8 days')],
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
}
