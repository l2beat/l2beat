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

export const layer2financezk: Project = {
  name: 'Layer2.Finance-zk',
  slug: 'layer2financezk',
  bridges: [
    {
      address: '0x82123571C8a5e0910280C066bc634c4945FFcbC8',
      sinceBlock: 14225869,
      tokens: ['*'], //?
    },
  ],
  details: {
    description:
      'Celer’s Layer2.finance in ZK Proofs Mode Built with StarkEx from StarkWare.',
    purpose: 'DeFi protocols',
    links: {
      websites: ['https://layer2.finance/'], //?
      apps: ['https://zk.layer2.finance'],
      documentation: [],
      explorers: [],
      repositories: ['https://github.com/starkware-libs/starkex-contracts'],
      socialMedia: [
        'https://discord.gg/uGx4fjQ',
        'https://t.me/celernetwork',
        'https://twitter.com/CelerNetwork',
      ],
    },
    provider: 'StarkEx',
    riskView: {
      stateValidation: RISK_VIEW.STATE_ZKP_ST, //?
      dataAvailability: RISK_VIEW.DATA_EXTERNAL_DAC, //?
      upgradeability: RISK_VIEW.UPGRADE_DELAY('0 days'), 
      sequencerFailure: RISK_VIEW.SEQUENCER_STARKEX_SPOT, //?
      validatorFailure: RISK_VIEW.VALIDATOR_ESCAPE_STARKEX_NFT, //? 
    },
    technology: {
      category: {
        name: 'Validium',
        details: "Powered by StarkWare's StarkEx",
      },
      stateCorrectness: STATE_CORRECTNESS.STARKEX_VALIDITY_PROOFS,
      newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
      dataAvailability: DATA_AVAILABILITY.STARKEX_OFF_CHAIN,
      operator: OPERATOR.STARKEX_OPERATOR,
      forceTransactions: FORCE_TRANSACTIONS.STARKEX_SPOT_WITHDRAW,
      exitMechanisms: EXITS.STARKEX_NFT, //?
      contracts: {
        addresses: [
          {
            name: 'StarkExchange',
            address: '0x82123571C8a5e0910280C066bc634c4945FFcbC8',
            upgradeability: {
              type: 'StarkWare',
              implementation: '0x4EDD62189732e9fF476ABa880b48c29432A7AC9B',
              upgradeDelay: 0,
              isFinal: false,
            },
          },
          {
            name: 'Committee',
            description:
              'Data Availability Committee (DAC) contract verifing data availability claim from DAC Members (via multisig check).',
            address: '',//?
          },
          SHARP_VERIFIER_CONTRACT,
        ],
        risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
      },
    },
    news: [
      {
        date: '2022-04-27',
        name: 'Celer’s Layer2.finance Launches in ZK Proofs Mode Built with StarkEx from StarkWare.',
        link: 'https://blog.celer.network/2022/04/27/celers-layer2-finance-launches-in-zk-proofs-mode-built-with-starkex-from-starkware/',
      },

    ],
  },
}
