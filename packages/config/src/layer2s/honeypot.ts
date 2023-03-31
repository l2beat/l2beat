import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import {
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
} from './common'
import { Layer2 } from './types'

export const honeypot: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('honeypot'),
  display: {
    name: 'Honeypot',
    slug: 'honeypot',
    description:
      'A Honeypot DApp developed using Cartesi DApp specific Optimistic Rollups SDK in order to battle test the SDKs security assumptions.',
    purpose: 'Bug bounty',
    links: {
      websites: ['https://honeypot.io'], // TODO: Confirm.
      apps: [], // It will be empty
      documentation: ['https://honeypot.io/docs'], // TODO: Confirm.
      explorers: [ 'https://goerli.etherscan.io/address/0x951a21a412b0281190643c17fa24bc42d5386dd6' ], // TODO: Random address.
      repositories: [ 'https://github.com/honeypot' ], // TODO: Confirm
      socialMedia: [
        'https://discord.gg/honeypot',
        'https://twitter.com/honeypot',
      ], // TODO: We can point here to specific announcements on our social medias.
    },
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x6880f6Fd960D1581C2730a451A22EED1081cfD72'), // TODO: This should be the address of the Honeypot DApp! The Portals now just verify the deposit, but forward the assets themselves to the address of the DApp.
        sinceTimestamp: new UnixTime(1612414780),
        tokens: ['DAI'],
      },
    ],
  },
  riskView: makeBridgeCompatible({   // TODO: Review all entries
    stateValidation: RISK_VIEW.STATE_EXITS_ONLY,          // TO BE CONFIRMED
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN,            // Ok
    upgradeability: RISK_VIEW.UPGRADABLE_YES,             // TO BE CONFIRMED
    sequencerFailure: RISK_VIEW.SEQUENCER_TRANSACT_L1,    // TO BE CONFIRNED
    validatorFailure: RISK_VIEW.VALIDATOR_NO_MECHANISM,   // TO BE CONFIRMED 
    destinationToken: RISK_VIEW.VALIDATED_BY_ETHEREUM,    // TO BE CONFIRMED
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,         // OK
  }),
  technology: {
    provider: 'Cartesi',
    category: 'Optimistic Rollup',
    stateCorrectness: {
      ...STATE_CORRECTNESS.FRAUD_PROOFS,
      references: [], // TODO: Add link to article explaining the mainnet launch for cartesi rollups
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.ON_CHAIN,
      references: [], // TODO: Add link to article explaining the mainnet launch for cartesi rollups
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [], // TODO: Add link to article explaining the mainnet launch for cartesi rollups
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.CANONICAL_ORDERING,
      references: [], // TODO: Add link to article explaining the mainnet launch for cartesi rollups
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('optimistic', 'merkle proof'),
        references: [], // TODO: Add link to article explaining the mainnet launch for cartesi rollups
        risks: [EXITS.RISK_CENTRALIZED_VALIDATOR],
      },
    ],
  },
  contracts: {
    addresses: [
      {
        address: EthereumAddress('0x6880f6Fd960D1581C2730a451A22EED1081cfD72'), //TODO: This should be the address of the Honeypot DApp! The Portals now just verify the deposit, but forward the assets themselves to the address of the DApp
        name: 'Honeypot Cartesi Address',
      },
    ],
    risks: [],
  },
  milestones: [
    {
      name: 'Honeypot DApp live on Mainnet',
      link: 'https://twitter.com/honeypot/status/1344707195250896899', // To update with launch announcement
      date: '2020-12-31T00:00:00Z', // To update with launch date
      description: 'Honeypot DApp live on Mainnet.',
    },
  ],
}