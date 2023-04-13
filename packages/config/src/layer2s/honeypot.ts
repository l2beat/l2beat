import { EthereumAddress, ProjectId } from '@l2beat/shared'

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
      'Honeypot is a DApp designed to challenge the security of Cartesi Rollups.\
       Bug hunters are incentivized to hack the application to obtain the funds locked in the rollup contract.\
       Honeypot holds real assets with a dual objective: setting a financial benchmark for secure asset management\
       and providing a gamified battlefield for the community to help audit and test Cartesi Rollups.\
       Crack the Honeypot, and the spoils are yours – no strings attached.',
    purpose: 'Bug bounty',
    links: {
      websites: ['https://docs.cartesi.io/cartesi-rollups/'], // TODO
      apps: [], // Ok
      documentation: ['https://docs.cartesi.io/cartesi-rollups/'], // Ok
      explorers: [], // Ok
      repositories: [], // TODO
      socialMedia: ['https://discord.gg/du7emFSt'], // Ok
    },
  },
  config: {
    escrows: [],
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_EXITS_ONLY, // Ok
    dataAvailability: RISK_VIEW.DATA_ON_CHAIN, // Ok
    upgradeability: RISK_VIEW.UPGRADABLE_NO, // Ok
    sequencerFailure: RISK_VIEW.SEQUENCER_TRANSACT_L1, // Ok
    validatorFailure: RISK_VIEW.VALIDATOR_ESCAPE_U, // Ok
    destinationToken: RISK_VIEW.VALIDATED_BY_ETHEREUM, // Ok
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM, // OK
  }),
  technology: {
    provider: 'Cartesi',
    category: 'Optimistic Rollup',
    stateCorrectness: {
      ...STATE_CORRECTNESS.FRAUD_PROOFS,
      references: [],
    },
    dataAvailability: {
      ...DATA_AVAILABILITY.ON_CHAIN,
      references: [],
    },
    operator: {
      ...OPERATOR.CENTRALIZED_OPERATOR,
      references: [],
    },
    forceTransactions: {
      ...FORCE_TRANSACTIONS.CANONICAL_ORDERING,
      references: [],
    },
    exitMechanisms: [
      {
        ...EXITS.REGULAR('optimistic', 'merkle proof'),
        references: [],
        risks: [EXITS.RISK_CENTRALIZED_VALIDATOR],
      },
    ],
  },
  contracts: {
    addresses: [
      {
        address: EthereumAddress('0x6880f6Fd960D1581C2730a451A22EED1081cfD72'), //TODO: This should be the address of the Honeypot DApp! The Portals now just verify the deposit, but forward the assets themselves to the address of the DApp.
        name: 'Honeypot DApp Address',
      },
    ],
    risks: [],
  },
  milestones: [
    {
      name: 'Honeypot DApp announcement',
      link: 'https://medium.com/cartesi/cartesi-ecosystem-update-2023-124b384401cc#:~:text=Honeypot%20DApp%20on%20Mainnet',
      date: '2023-04-11T00:00:00Z',
      description: 'Honeypot DApp first announced to the community.',
    },
  ],
}
