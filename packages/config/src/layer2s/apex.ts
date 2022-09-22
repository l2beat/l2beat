import { ProjectId, UnixTime } from '@l2beat/types'

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

export const apex: Layer2 = {
  name: 'ApeX',
  slug: 'apex',
  id: ProjectId('apex'),
  escrows: [
    {
      address: '0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb',
      sinceTimestamp: new UnixTime(1660252039),
      tokens: ['USDC'],
    },
  ],
  details: {
    description:
      'ApeX Pro is a non-custodial trading platform that delivers limitless cross-margined perpetual contracts trading.',
    warning:
      'Smart Contracts on L1 do not enforce at the moment availability of data in DAC.',
    purpose: 'Exchange',
    links: {
      websites: ['https://apex.exchange/'],
      apps: ['https://pro.apex.exchange/'],
      documentation: ['https://apex-pro.gitbook.io/apex-pro?lang=en-US'],
      explorers: [],
      repositories: ['https://github.com/ApeX-Protocol/core'],
      socialMedia: ['https://twitter.com/OfficialApeXdex'],
    },
    provider: 'StarkEx',
    riskView: {
      stateValidation: RISK_VIEW.STATE_ZKP_ST,
      dataAvailability: RISK_VIEW.DATA_EXTERNAL,
      upgradeability: RISK_VIEW.UPGRADABLE_YES,
      sequencerFailure: RISK_VIEW.SEQUENCER_STARKEX_PERPETUAL,
      validatorFailure: RISK_VIEW.VALIDATOR_ESCAPE_STARKEX_PERPETUAL,
    },
    technology: {
      category: {
        name: 'Validium',
        details:
          'StarkEx deployment in Validium mode without DAC. Proceed with caution.',
      },
      stateCorrectness: STATE_CORRECTNESS.STARKEX_VALIDITY_PROOFS,
      newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
      dataAvailability: {
        ...DATA_AVAILABILITY.GENERIC_OFF_CHAIN,
      },
      operator: OPERATOR.STARKEX_OPERATOR,
      forceTransactions: FORCE_TRANSACTIONS.STARKEX_PERPETUAL_WITHDRAW,
      exitMechanisms: EXITS.STARKEX,
      contracts: {
        addresses: [
          {
            name: 'StarkPerpetual',
            address: '0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb',
            description:
              'Main contract of ApeX exchange. Updates state and verifies its integrity using STARK Verifier. Allows users to deposit and withdraw tokens via normal and emergency modes.',
            upgradeability: {
              type: 'StarkWare',
              implementation: '0x67bC2461000cfbe67e9b623EC8B460168BdEC5F0',
              upgradeDelay: 0,
              isFinal: false,
            },
          },
          SHARP_VERIFIER_CONTRACT,
        ],
        risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
      },
      permissions: [],
    },
    news: [
      {
        date: '2022-09-01',
        name: 'Introducing ApeXPro',
        link: 'https://twitter.com/OfficialApeXdex/status/1565282539463270400',
      },
    ],
  },

  events: [],
}
