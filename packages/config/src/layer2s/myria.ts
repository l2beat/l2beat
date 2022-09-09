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

export const myria: Layer2 = {
  name: 'Myria',
  slug: 'myria',
  id: ProjectId('myria'),
  escrows: [
    {
      address: '0x3071BE11F9e92A9eb28F305e1Fa033cD102714e7',
      sinceTimestamp: new UnixTime(1659542607),
      tokens: ['ETH'],
    },
  ],
  details: {
    description:
      'Myria is an expansive blockchain gaming ecosystem, comprised of a blockchain gaming hub and Myriaverse metaverse, underpinned by a full suite of Myria infrastructure. Myria will also offer B2B services to enable third-party studios and developers to onboard onto the Myria chain.',
    purpose: 'NFT, Exchange',
    links: {
      websites: ['https://myria.com/'],
      apps: ['https://market.x.immutable.com/'],
      documentation: ['https://docs.starkware.co/starkex-docs-v2/'],
      explorers: [],
      repositories: ['https://github.com/starkware-libs/starkex-contracts'],
      socialMedia: [
        'https://medium.com/@myriagames',
        'https://twitter.com/myria',
      ],
    },
    provider: 'StarkEx',
    riskView: {
      stateValidation: RISK_VIEW.STATE_ZKP_ST,
      dataAvailability: RISK_VIEW.DATA_EXTERNAL_DAC,
      upgradeability: RISK_VIEW.UPGRADABLE_YES,
      sequencerFailure: RISK_VIEW.SEQUENCER_STARKEX_SPOT,
      validatorFailure: RISK_VIEW.VALIDATOR_ESCAPE_STARKEX_NFT,
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
      exitMechanisms: EXITS.STARKEX_NFT,
      contracts: {
        addresses: [
          {
            name: 'StarkExchange',
            address: '0x3071BE11F9e92A9eb28F305e1Fa033cD102714e7',
            upgradeability: {
              type: 'StarkWare',
              implementation: '0xe6785C3AfF4292C9d7c6b039f649672C45CAfFee',
              upgradeDelay: 0,
              isFinal: false,
            },
          },
          {
            name: 'Committee',
            description:
              'Data Availability Committee (DAC) contract verifing data availability claim from DAC Members (via multisig check).',
            address: '0x1e601435E181423e7A8430813d7500012a6169cB',
          },
          SHARP_VERIFIER_CONTRACT,
        ],
        risks: [CONTRACTS.UPGRADE_NO_DELAY_RISK],
      },
      permissions: [
        {
          name: 'Governor',
          accounts: [
            {
              address: '0xc49Ec6Bb817E17a9Ca5B738ca330db403cc74245',
              type: 'EOA',
            },
          ],
          description:
            'Can upgrade implementation of the system, potentially gaining access to all funds stored in the bridge. Currently there is no delay before the upgrade, so the users will not have time to migrate.',
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
              address: '0xe997ece81cb8A686206ea6042886B594Ecf6DdED',
              type: 'EOA',
            },
          ],
          description:
            'Allowed to update the state. When the Operator is down the state cannot be updated.',
        },
        {
          name: 'Data Availability Committee',
          accounts: [
            {
              address: '0x30cf77fc391b4feba1ab31b01fed442bc759c0a8',
              type: 'EOA',
            },
            {
              address: '0x52e6ecb50d8c89fe9cbad2ef44ce962a430d8714',
              type: 'EOA',
            },
            {
              address: '0xc7544ad893710bd0bf780bf78de5547706da75c5',
              type: 'EOA',
            },
            {
              address: '0xf365cdb8c33849d3684acff5475e7b6f075f9f0f',
              type: 'EOA',
            },
            {
              address: '0xfba93b5f744c853648d62c1357532582f77ed394',
              type: 'EOA',
            },
          ],
          description:
            'Validity proof must be signed by at least 2 of these 5 addresses to approve state update.',
        },
      ],
    },
    news: [
      {
        date: '2022-08-26',
        name: 'Myria’s Layer 2 launch has arrived',
        link: 'https://medium.com/@myriagames/myrias-layer-2-launch-has-arrived-6a3c3da9561f',
      },
      {
        date: '2021-12-17',
        name: 'Welcome to Myria',
        link: 'https://medium.com/@myriagames/myria-is-born-4c4a05018c2',
      },
    ],
  },

  events: [],
}
