import { ProjectId } from '@l2beat/common'

import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  SHARP_VERIFIER_CONTRACT,
  STATE_CORRECTNESS,
} from './common'
import { Project } from './types'

export const starknet: Project = {
  name: 'StarkNet',
  slug: 'starknet',
  id: ProjectId('starknet'),
  bridges: [
    {
      address: '0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419',
      sinceBlock: 14429055,
      tokens: ['ETH'],
    },
    {
      address: '0x0437465dfb5B79726e35F08559B0cBea55bb585C',
      sinceBlock: 14742549,
      tokens: ['DAI'],
    },
  ],
  details: {
    warning:
      'Currently only whitelisted contracts can be deployed on StarkNet.',
    description:
      'StarkNet is a general purpose ZK-Rollup built using STARK cryptographic proof system. StarkNet uses the Cairo programming language both for its \
      infrastructure and for writing StarkNet contracts. L2 <--> L1 messaging infrastructure \
      is available and contracts are fully composable. It is currently launched \
      with a single Sequencer.',
    purpose: 'Universal',
    links: {
      apps: [],
      websites: [
        'https://starknet.io/',
        'https://starkware.co/starknet/',
        'https://starkware.co/ecosystem/',
        'https://community.starknet.io/',
      ],
      documentation: ['https://https://starknet.io/what-is-starknet/'],
      explorers: ['https://voyager.online/'],
      repositories: ['https://github.com/starkware-libs'],
      socialMedia: [
        'https://discord.gg/uJ9HZTUk2Y',
        'https://twitter.com/StarkWareLtd',
        'https://medium.com/starkware',
        'https://starkware.co/',
      ],
    },
    // provider: 'StarkNet',
    riskView: {
      stateValidation: RISK_VIEW.STATE_ZKP_ST,
      dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
      upgradeability: RISK_VIEW.UPGRADABLE_YES,
      sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM,
      validatorFailure: RISK_VIEW.PROVER_DOWN,
    },
    technology: {
      category: {
        name: 'ZK Rollup',
      },
      stateCorrectness: {
        ...STATE_CORRECTNESS.VALIDITY_PROOFS,
        references: [
          {
            text: 'What is StarkNet',
            href: 'https://starkware.co/starknet/',
          },
        ],
      },
      newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
      dataAvailability: DATA_AVAILABILITY.STARKNET_ON_CHAIN,
      operator: {
        ...OPERATOR.CENTRALIZED_OPERATOR,
        description:
          OPERATOR.CENTRALIZED_OPERATOR.description +
          ' Typically, the Operator is the hot wallet of the StarkNet service submitting state updates for which proofs have been already submitted and verified.',
        references: [
          {
            text: 'StarkNet operator Etherscan address',
            href: 'https://etherscan.io/address/0x2C169DFe5fBbA12957Bdd0Ba47d9CEDbFE260CA7',
          },
        ],
      },
      forceTransactions: {
        ...FORCE_TRANSACTIONS.NO_MECHANISM,
        references: [
          {
            text: 'Censorship resistance of StarkNet - Forum Discussion',
            href: 'https://community.starknet.io/t/censorship-resistance/196',
          },
        ],
      },
      exitMechanisms: EXITS.STARKNET,
      contracts: {
        addresses: [
          {
            name: 'StarkNet Core Contract',
            description:
              'StarkNet contract receives (verified) state roots from the Sequencer, allows users to read L2 -> L1 messages and send L1 -> L2 message.',
            address: '0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4',
            upgradeability: {
              type: 'StarkWare',
              implementation: '0xD8Cd77206fCb239BdDaaDDdA8C87CBFe7d67Ca2b',
              upgradeDelay: 0,
              isFinal: false,
            },
          },
          SHARP_VERIFIER_CONTRACT,
          {
            name: 'MemoryPageFactRegistry',
            description:
              'MemoryPageFactRegistry is one of the many contracts used by SHARP verifier. This one is important as it registers all necessary on-chain data such as StarkNet contracts state diffs.',
            address: '0x96375087b2F6eFc59e5e0dd5111B4d090EBFDD8B',
          },
          {
            name: 'Eth Bridge',
            description: 'Starkgate bridge for ETH.',
            address: '0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419',
            upgradeability: {
              type: 'StarkWare',
              implementation: '0x5e70F3301bbBBB1DFA2c8d20D75b162aFa6Dbe37',
              upgradeDelay: 0,
              isFinal: false,
            },
          },
          {
            name: 'L1DaiGateway',
            description:
              'Custom DAI Gateway, main entry point for users depositing DAI to L2 where "canonical" L2 DAI token managed by MakerDAO will be minted. Managed by MakerDAO.',
            address: '0x659a00c33263d9254Fed382dE81349426C795BB6',
          },
          {
            name: 'L1Escrow',
            description:
              'DAI Vault for custom DAI Gateway managed by MakerDAO.',
            address: '0x0437465dfb5B79726e35F08559B0cBea55bb585C',
          },
        ],
        risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
      },
    },
    news: [
      {
        date: '2022-05-09',
        name: 'StarkGate Alpha is live on Mainnet',
        link: 'https://medium.com/starkware/starkgate-alpha-35d01d21e3af',
      },
      {
        date: '2022-01-18',
        name: 'StarkNet Alpha 0.7.0',
        link: 'https://medium.com/starkware/starknet-alpha-0-7-0-26e04db03509',
      },
      {
        date: '2021-11-29',
        name: 'StarkNet alpha is on Mainnet',
        link: 'https://medium.com/starkware/starknet-alpha-now-on-mainnet-4cf35efd1669',
      },
      {
        date: '2021-01-26',
        name: 'StarkNet RoadMap',
        link: 'https://medium.com/starkware/on-the-road-to-starknet-a-permissionless-stark-powered-l2-zk-rollup-83be53640880',
      },
    ],
  },
}
