import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  SHARP_VERIFIER_CONTRACT,
  STATE_CORRECTNESS,
} from './common'
import { Layer2 } from './types'

export const canvasconnect: Layer2 = {
  type: 'layer2',
  id: ProjectId('canvasconnect'),
  display: {
    name: 'Canvas Connect',
    slug: 'canvasconnect',
    warning: 'Canvas Connect is initially open only to whitelisted institutional clients.',
    description:
      'Canvas Connect is a Layer 2 ZK network built on the StarkEx technology that aims to offer privacy-focused solutions for the finance and digital economy. It aims to enable the transfer, trade, and investment of tokenized real-world assets, stablecoins, CBDCs, and digital assets with assurances of privacy, low cost, and high speed.',
    purpose: 'Privacy, Finance',
    links: {
      websites: ['https://canvas.co/'],
      apps: [],
      documentation: ['https://docs.starkware.co/starkex/index.html'],
      explorers: [],
      repositories: ['https://github.com/starkware-libs/starkex-contracts'],
      socialMedia: [
        'https://twitter.com/canvas_defi',
        'https://www.youtube.com/@canvas_defi',
        'https://canvasdefi.medium.com/',
        'https://www.linkedin.com/company/canvasblockchaingroup',
        'https://www.canvas.co/content',
      ],
    },
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x7A7f9c8fe871cd50f6Ce935d7c7caD2e89987f9d'),
        sinceTimestamp: new UnixTime(1675209600),
        tokens: ['ETH', 'USDC'],
      },

    ],
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_ST,
    dataAvailability: RISK_VIEW.DATA_EXTERNAL_DAC,
    upgradeability: RISK_VIEW.UPGRADABLE_YES,
    sequencerFailure: RISK_VIEW.SEQUENCER_STARKEX_SPOT,
    validatorFailure: RISK_VIEW.VALIDATOR_ESCAPE_STARKEX_NFT,
    destinationToken: RISK_VIEW.CANONICAL,
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
  }),
  technology: {
    provider: 'StarkEx',
    category: 'Validium',
    stateCorrectness: STATE_CORRECTNESS.STARKEX_VALIDITY_PROOFS,
    newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
    dataAvailability: DATA_AVAILABILITY.STARKEX_OFF_CHAIN,
    operator: OPERATOR.STARKEX_OPERATOR,
    forceTransactions: FORCE_TRANSACTIONS.STARKEX_SPOT_WITHDRAW,
    exitMechanisms: EXITS.STARKEX_NFT,
  },
  contracts: {
    addresses: [
      {
        name: 'StarkExchange',
        address: EthereumAddress('0x7A7f9c8fe871cd50f6Ce935d7c7caD2e89987f9d'),
        upgradeability: {
          type: 'StarkWare proxy',
          implementation: EthereumAddress(
            '0xdF2f24751F7e84ccDCD39e7b49904FAB0Fb0f583',
          ),
          upgradeDelay: 0,
          isFinal: false,
        },
      },
      {
        name: 'Committee',
        address: EthereumAddress('0x8B3A6662809195453645e37C2005d655f57ca818'),
        description:
          'Data Availability Committee (DAC) contract verifying data availability claim from DAC Members (via multisig check).',
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
          address: EthereumAddress(
            '0x5751a83170BeA11fE7CdA5D599B04153C021f21A',
          ),
          type: 'EOA',
        },
      ],
      description:
        'Can upgrade implementation of the system, potentially gaining access to all funds stored in the bridge. Currently there is no delay before the upgrade, so the users will not have time to migrate.',
    },
    {
      name: 'Data Availability Committee', // add one more member if exists.
      accounts: [
        {
          address: EthereumAddress(
            '0x7e1BBDbE450e9f5988AE3d10a99911A20C138063',
          ),
          type: 'EOA',
        },
      ],
      description:
        'Validity proof must be signed by at least 2 of these addresses to approve state update.',
    },
    {
      name: 'SHARP Verifier Governor',
      accounts: [
        {
          address: EthereumAddress(
            '0x3DE55343499f59CEB3f1dE47F2Cd7Eab28F2F5C6',
          ),
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
          address: EthereumAddress(
            '0x107691bD4F590270B9793c807cB912DD278e8cB5',
          ),
          type: 'EOA',
        },
      ],
      description:
        'Allowed to update state of the system. When Operator is down the state cannot be updated.',
    },
  ],
  milestones: [],
  knowledgeNuggets: [...NUGGETS.STARKWARE],
}
