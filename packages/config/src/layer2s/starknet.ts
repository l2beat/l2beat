import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/types'

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
import { Layer2 } from './types'

export const starknet: Layer2 = {
  id: ProjectId('starknet'),
  display: {
    name: 'StarkNet',
    slug: 'starknet',
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
      documentation: ['https://starknet.io/what-is-starknet/'],
      explorers: ['https://voyager.online/'],
      repositories: ['https://github.com/starkware-libs'],
      socialMedia: [
        'https://discord.gg/uJ9HZTUk2Y',
        'https://twitter.com/StarkWareLtd',
        'https://medium.com/starkware',
        'https://starkware.co/',
      ],
    },
  },
  config: {
    escrows: [
      {
        address: '0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419',
        sinceTimestamp: new UnixTime(1647857148),
        tokens: ['ETH'],
      },
      {
        address: '0x0437465dfb5B79726e35F08559B0cBea55bb585C',
        sinceTimestamp: new UnixTime(1652101033),
        tokens: ['DAI'],
      },
      {
        address: '0x283751A21eafBFcD52297820D27C1f1963D9b5b4',
        sinceTimestamp: new UnixTime(1657137600),
        tokens: ['WBTC'],
      },
      {
        address: '0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816',
        sinceTimestamp: new UnixTime(1657137639),
        tokens: ['USDC'],
      },
      {
        address: '0xbb3400F107804DFB482565FF1Ec8D8aE66747605',
        sinceTimestamp: new UnixTime(1657137615),
        tokens: ['USDT'],
      },
    ],
    events: [
      // {
      //   name: 'LogMemoryPageFactRegular',
      //   abi: 'event LogMemoryPageFactRegular (bytes32 factHash, uint256 memoryHash, uint256 prod)',
      //   emitter: EthereumAddress('0x96375087b2F6eFc59e5e0dd5111B4d090EBFDD8B'),
      //   type: 'data',
      //   sinceTimestamp: new UnixTime(1635077814),
      // },
      {
        name: 'LogStateUpdate',
        abi: 'event LogStateUpdate(uint256 globalRoot, int256 blockNumber)',
        emitter: EthereumAddress('0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4'),
        type: 'state',
        sinceTimestamp: new UnixTime(1636978914),
      },
      {
        name: 'LogMemoryPageFactRegular',
        abi: 'event LogMemoryPageFactRegular (bytes32 factHash, uint256 memoryHash, uint256 prod)',
        emitter: EthereumAddress('0x28067505E54b7Ac2A5F860b343340Be8E73edECD'),
        type: 'data',
        sinceTimestamp: new UnixTime(1657029433),
      },
    ],
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_ZKP_ST,
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
    upgradeability: RISK_VIEW.UPGRADABLE_YES,
    sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM,
    validatorFailure: RISK_VIEW.PROVER_DOWN,
  },
  technology: {
    // provider: 'StarkNet',
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
  },
  contracts: {
    addresses: [
      {
        name: 'StarkNet Core Contract',
        description:
          'StarkNet contract receives (verified) state roots from the Sequencer, allows users to read L2 -> L1 messages and send L1 -> L2 message.',
        address: '0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4',
        upgradeability: {
          type: 'StarkWare',
          implementation: '0xE267213B0749Bb94c575F6170812c887330d9cE3',
          upgradeDelay: 0,
          isFinal: false,
        },
      },
      SHARP_VERIFIER_CONTRACT,
      {
        name: 'MemoryPageFactRegistry',
        description:
          'MemoryPageFactRegistry is one of the many contracts used by SHARP verifier. This one is important as it registers all necessary on-chain data such as StarkNet contracts state diffs.',
        address: '0x28067505E54b7Ac2A5F860b343340Be8E73edECD',
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
        description: 'DAI Vault for custom DAI Gateway managed by MakerDAO.',
        address: '0x0437465dfb5B79726e35F08559B0cBea55bb585C',
      },
      {
        name: 'WBTC Bridge',
        description: 'Starkgate bridge for WBTC.',
        address: '0x283751A21eafBFcD52297820D27C1f1963D9b5b4',
        upgradeability: {
          type: 'StarkWare',
          implementation: '0x56e233d613743297CdD27fafc5c1f5c1DC2a381b',
          upgradeDelay: 0,
          isFinal: false,
        },
      },
      {
        name: 'USDC Bridge',
        description: 'Starkgate bridge for USDC.',
        address: '0xF6080D9fbEEbcd44D89aFfBFd42F098cbFf92816',
        upgradeability: {
          type: 'StarkWare',
          implementation: '0x56e233d613743297CdD27fafc5c1f5c1DC2a381b',
          upgradeDelay: 0,
          isFinal: false,
        },
      },
      {
        name: 'USDT Bridge',
        description: 'Starkgate bridge for USDT.',
        address: '0xbb3400F107804DFB482565FF1Ec8D8aE66747605',
        upgradeability: {
          type: 'StarkWare',
          implementation: '0x56e233d613743297CdD27fafc5c1f5c1DC2a381b',
          upgradeDelay: 0,
          isFinal: false,
        },
      },
    ],
    risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
  },
  permissions: [
    {
      name: 'Governor',
      accounts: [
        {
          address: '0x3DE55343499f59CEB3f1dE47F2Cd7Eab28F2F5C6',
          type: 'EOA',
        },
      ],
      description:
        'Can upgrade implementation of the system, potentially gaining access to all funds stored in the bridge. Can also upgrade implementation of SHARP Verifier, potentially with code approving fraudulent state. Currently there is no delay before the upgrade, so the users will not have time to migrate. ',
    },
    {
      name: 'StarknetCore Governor',
      accounts: [
        {
          address: '0xD5fB66CaEE881367Df4409B17Fd53a2Ef0D9B263',
          type: 'EOA',
        },
      ],
      description:
        'Can upgrade implementation of the StarknetCore contract, potentially allowing fraudulent state to be posted.',
    },
    {
      name: 'Operator',
      accounts: [
        {
          address: '0x2C169DFe5fBbA12957Bdd0Ba47d9CEDbFE260CA7',
          type: 'EOA',
        },
      ],
      description:
        'Allowed to post state updates. When the operator is down the state cannot be updated.',
    },
    {
      name: 'MakerDAO Governance',
      accounts: [
        {
          address: '0x0a3f6849f78076aefaDf113F5BED87720274dDC0',
          type: 'Contract',
        },
      ],
      description:
        'In DAI bridge it can set max deposit per bridge and per user. In DAI escrow it can approve token transfers.',
    },
  ],
  news: [
    {
      date: '2022-07-13',
      name: 'Part 3: StarkNet Token Design',
      link: 'https://medium.com/starkware/part-3-starknet-token-design-5cc17af066c6',
    },
    {
      date: '2022-07-13',
      name: 'Part 2: A Decentralization and Governance Proposal for StarkNet',
      link: 'https://medium.com/starkware/part-2-a-decentralization-and-governance-proposal-for-starknet-23e335645778',
    },
    {
      date: '2022-07-13',
      name: 'Part 1: StarkNet Sovereignty: A Decentralization Proposal',
      link: 'https://medium.com/starkware/part-1-starknet-sovereignty-a-decentralization-proposal-bca3e98a01ef',
    },
    {
      date: '2022-07-04',
      name: 'Regenesis: StarkNet’s No-Sweat State Reset',
      link: 'https://medium.com/starkware/regenesis-starknets-no-sweat-state-reset-e296b12b80ae',
    },
    {
      date: '2022-06-06',
      name: 'StarkNet Alpha 0.9.0',
      link: 'https://medium.com/starkware/starknet-alpha-0-9-0-dce43cf13490',
    },
    {
      date: '2022-05-09',
      name: 'StarkGate Alpha is live on Mainnet',
      link: 'https://medium.com/starkware/starkgate-alpha-35d01d21e3af',
    },
  ],
}
