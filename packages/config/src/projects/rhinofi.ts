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

export const rhinofi: Project = {
  name: 'rhino.fi',
  slug: 'rhinofi',
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
    warning: 'DeversiFi has rebranded to rhino.fi on Jul 14 2022.',
    description:
      'rhino.fi (formerly DeversiFi) claims to be the easiest way to access DeFi opportunities on Ethereum: invest, trade, and send tokens without paying gas fees.',
    purpose: 'Exchange',
    links: {
      websites: ['https://rhino.fi/'],
      apps: ['https://app.rhino.fi/'],
      documentation: [
        'https://docs.rhino.fi/',
        'https://support.rhino.fi/en/',
        'https://docs.starkware.co/starkex-docs-v2/',
      ],
      explorers: [],
      repositories: [
        'https://github.com/starkware-libs/starkex-contracts',
        'https://github.com/rhinofi',
      ],
      socialMedia: [
        'https://rhino.fi/blog',
        'https://twitter.com/rhinofi',
        'https://linkedin.com/company/rhinofi/',
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
      permissions: [
        {
          name: 'Governor',
          accounts: [
            {
              address: '0x3a74010f2b37C02A249bd539EaE6b90Ba7CcD8aA',
              type: 'EOA',
            },
          ],
          description:
            'Can upgrade the implementation of the system, potentially gaining access to all funds stored in the bridge. Currently there is no delay before the upgrade, so the users will not have time to migrate.',
        },
        {
          name: 'Data Availability Committee',
          accounts: [
            {
              address: '0x6a8ea587133c1aa4b3ba0417b6d8ae38e61fd1e',
              type: 'EOA',
            },
            {
              address: '0x3bf2562178ea0cef6b3f66d971494d65561efd3',
              type: 'EOA',
            },
            {
              address: '0xf872cf881873029b8955b582c29b66347f3f132',
              type: 'EOA',
            },
            {
              address: '0x70eeaa8b7cbf7124e349e94eade6188ddd2d617',
              type: 'EOA',
            },
            {
              address: '0x51abde72a4542500a7b1cb32b18b13fbe1f9ff2',
              type: 'EOA',
            },
            {
              address: '0x2b6593fcfbfded663d7a6448d45b12c16df6b64',
              type: 'EOA',
            },
            {
              address: '0xfbd7599fe0c3735b94c369adf0f0045d8d4f6cb9',
              type: 'EOA',
            },
          ],
          description:
            'Validity proof must be signed by at least 4 of these addresses to approve state update.',
        },
        {
          name: 'SHARP Verifier Governor',
          accounts: [
            {
              address: '0x3DE55343499f59CEB3f1dE47F2Cd7Eab28F2F5C6',
              type: 'EOA',
            },
          ],
          description:
            'Can upgrade implementation of SHARP Verifier, potentially with code approving fraudulent state. Currently there is no delay before the upgrade, so the users will not have time to migrate.',
        },
        {
          name: 'Operator',
          accounts: [
            {
              address: '0x8A6c80Aab6497E2DB35817817b593b79D78f6ae5',
              type: 'EOA',
            },
          ],
          description:
            'Allowed to update the state of the system. When the Operator is down the state cannot be updated.',
        },
      ],
    },
    news: [
      {
        date: '2022-07-14',
        name: 'Today DeversiFi becomes rhino.fi: the first multi-chain platform to bring you all the best DeFi opportunities in one place.',
        link: 'https://rhino.fi/blog/beat-the-stampede-with-our-breaking-news-and-win-a-share-of-5k/',
      },
      {
        date: '2022-07-20',
        name: "Noah's Ark moment for DeFi",
        link: 'https://rhino.fi/blog/noahs-ark-moment-defi/',
      },
    ],
  },
}
