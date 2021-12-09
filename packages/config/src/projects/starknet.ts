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

export const starknet: Project = {
  name: 'StarkNet',
  slug: 'starknet',
  bridges: [],
  details: {
    description:
      'StarkNet is a permissionless decentralized Validity-Rollup \
      (also known as a “ZK-Rollup”) operating as an L2 network over Ethereum, where any dApp \
      can achieve unlimited scale for its computation, without compromising Ethereum’s \
      composability and security. StarkNet uses the Cairo programming language both for its \
      infrastructure and for writing StarkNet contracts.',
    purpose: 'ZK Rollup',
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
        'https://medium.com/starkware/starknet/home',
        'https://starkware.co/',
      ],
    },
    // provider: 'StarkNet',
    riskView: {
      stateValidation: RISK_VIEW.STATE_ZKP_ST,
      dataAvailability: RISK_VIEW.DATA_ON_CHAIN,
      upgradeability: RISK_VIEW.UPGRADABLE_YES,
      sequencerFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM,
      validatorFailure: RISK_VIEW.SEQUENCER_NO_MECHANISM, //TODO: remove?
    },
    technology: {
      category: {
        name: 'ZK Rollup',
      },
      stateCorrectness: STATE_CORRECTNESS.VALIDITY_PROOFS,
      newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
      dataAvailability: DATA_AVAILABILITY.STARKNET_ON_CHAIN,
      operator: OPERATOR.CENTRALIZED_OPERATOR,
      forceTransactions: FORCE_TRANSACTIONS.NO_MECHANISM,
      exitMechanisms: [
        {
          ...EXITS.REGULAR('zk', 'zk proof'),
          references: [
            {
              text: ' Withdrawing is based on l2 to l1 messages - StarkNet documentation',
              href: 'https://www.cairo-lang.org/docs/hello_starknet/l1l2.html',
            },
          ],
          risks: [EXITS.RISK_CENTRALIZED_VALIDATOR],
        },
      ],
      contracts: {
        addresses: [
          {
            name: 'StarkNet Core Contract',
            address: '0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4',
            upgradeability: {
              type: 'StarkWare',
              implementation: '0xd8cd77206fcb239bddaaddda8c87cbfe7d67ca2b',
              upgradeDelay: 0,
              isFinal: false,
            },
          },
          {
            name: 'GpsStatementVerifier',
            address: '0x47312450B3Ac8b5b8e247a6bB6d523e7605bDb60',
          },
          {
            name: 'MemoryPageFactRegistry',
            address: '0x96375087b2F6eFc59e5e0dd5111B4d090EBFDD8B',
          },
          {
            name: 'FriStatementContract',
            address: '0xecf98A84EEa8F83d8510C19488c1bBc2dB9EDA6d',
          },
          {
            name: 'MerkleStatementContract',
            address: '0xFC359d4565a5F09A7B534ce8ADC049Eb99902607',
          },
        ],
        risks: [
          CONTRACTS.UPGRADE_NO_DELAY_RISK,
          EXITS.RISK_CENTRALIZED_VALIDATOR,
          CONTRACTS.UNVERIFIED_RISK,
        ],
      },
    },
    news: [
      {
        date: '2021-11-29',
        name: 'StarkNet alpha is on Mainnet',
        link: 'https://medium.com/starkware/starknet-alpha-now-on-mainnet-4cf35efd1669',
      },
    ],
  },
}
