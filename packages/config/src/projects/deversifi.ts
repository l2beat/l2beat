import { ProjectId, UnixTime } from '@l2beat/common'

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

export const deversifi: Project = {
  name: 'DeversiFi',
  slug: 'deversifi',
  id: ProjectId('deversifi'),
  bridges: [
    {
      address: '0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b',
      sinceTimestamp: new UnixTime(1590491810),
      tokens: '*',
    },
  ],
  associatedTokens: ['DVF'],
  details: {
    description:
      'DeversiFi claims to be the easiest way to access DeFi opportunities on Ethereum: invest, trade, and send tokens without paying gas fees.',
    purpose: 'Exchange',
    links: {
      websites: ['https://www.deversifi.com/'],
      apps: ['https://app.deversifi.com/'],
      documentation: [
        'https://docs.deversifi.com/',
        'https://support.deversifi.com/en/',
        'https://docs.starkware.co/starkex-docs-v2/',
      ],
      explorers: [],
      repositories: [
        'https://github.com/starkware-libs/starkex-contracts',
        'https://github.com/deversifi',
      ],
      socialMedia: [
        'https://blog.deversifi.com/',
        'https://twitter.com/deversifi',
        'https://linkedin.com/company/deversifi/',
        'https://youtube.com/c/deversifi',
      ],
    },
    provider: 'StarkEx',
    riskView: {
      stateValidation: RISK_VIEW.STATE_ZKP_ST,
      dataAvailability: RISK_VIEW.DATA_EXTERNAL_DAC,
      upgradeability: RISK_VIEW.UPGRADE_DELAY('14 days'),
      sequencerFailure: RISK_VIEW.SEQUENCER_STARKEX_SPOT,
      validatorFailure: RISK_VIEW.VALIDATOR_ESCAPE_MP,
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
      exitMechanisms: EXITS.STARKEX,
      contracts: {
        addresses: [
          {
            name: 'StarkExchange',
            address: '0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b',
            upgradeability: {
              type: 'StarkWare',
              implementation: '0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC',
              useConstantDelay: true,
              // TODO: figure out the double proxy
              upgradeDelay: 1209600,
              // upgradeDelay: 2419200,
              isFinal: false,
            },
          },
          {
            name: 'Committee',
            description:
              'Data Availability Committee (DAC) contract verifing data availability claim from DAC Members (via multisig check).',
            address: '0x28780349A33eEE56bb92241bAAB8095449e24306',
          },
          SHARP_VERIFIER_CONTRACT,
        ],
        risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK('14 days')],
      },
    },
    news: [
      {
        date: '2021-08-11',
        name: "It's here. The launch of DVF Governance.",
        link: 'https://blog.deversifi.com/its-here-the-launch-of-dvf-governance/',
      },
      {
        date: '2021-08-03',
        name: 'DeversiFi launches first Layer 2 bridge between Polygon for instant transfers',
        link: 'https://blog.deversifi.com/deversifi-launches-first-layer-2-bridge-between-polygon-for-instant-transfers',
      },
      {
        date: '2021-07-20',
        name: 'Introducing the DVF DAO Treasury',
        link: 'https://blog.deversifi.com/dvf-dao-treasury/',
      },
    ],
  },
}
