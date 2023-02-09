import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import {
  CONTRACTS,
  DATA_AVAILABILITY,
  EXITS,
  FORCE_TRANSACTIONS,
  makeBridgeCompatible,
  NEW_CRYPTOGRAPHY,
  OPERATOR,
  RISK_VIEW,
  SHARP_VERIFIER_CONTRACT,
  STATE_CORRECTNESS,
} from './common'
import { Layer2 } from './types'

export const apex: Layer2 = {
  type: 'layer2',
  id: ProjectId('apex'),
  display: {
    name: 'ApeX',
    slug: 'apex',
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
  },
  config: {
    escrows: [
      {
        address: '0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb',
        sinceTimestamp: new UnixTime(1660252039),
        tokens: ['USDC'],
      },
    ],
    events: [],
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_ST,
    dataAvailability: RISK_VIEW.DATA_EXTERNAL,
    upgradeability: RISK_VIEW.UPGRADABLE_YES,
    sequencerFailure: RISK_VIEW.SEQUENCER_STARKEX_PERPETUAL,
    validatorFailure: RISK_VIEW.VALIDATOR_ESCAPE_STARKEX_PERPETUAL,
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    destinationToken: RISK_VIEW.CANONICAL_USDC,
  }),
  technology: {
    provider: 'StarkEx',
    category: 'Validium',
    stateCorrectness: STATE_CORRECTNESS.STARKEX_VALIDITY_PROOFS,
    newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
    dataAvailability: {
      ...DATA_AVAILABILITY.GENERIC_OFF_CHAIN,
    },
    operator: OPERATOR.STARKEX_OPERATOR,
    forceTransactions: FORCE_TRANSACTIONS.STARKEX_PERPETUAL_WITHDRAW,
    exitMechanisms: EXITS.STARKEX,
  },
  contracts: {
    addresses: [
      {
        name: 'StarkPerpetual',
        address: '0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb',
        description:
          'Main contract of ApeX exchange. Updates state and verifies its integrity using STARK Verifier. Allows users to deposit and withdraw tokens via normal and emergency modes.',
        upgradeability: {
          type: 'StarkWare proxy',
          implementation: EthereumAddress(
            '0x67bC2461000cfbe67e9b623EC8B460168BdEC5F0',
          ),
          upgradeDelay: 0,
          isFinal: false,
        },
      },
      {
        name: 'MultiSigPool',
        address: '0xe95b3Dc78c0881dEa17A69BaFC6cFeB8d891e9DE',
        description:
          'Allows deposits in different tokens and swaps them to USDC. Allows fast withdrawals after the agreement of at least 2 designated signers.',
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
          address: '0x5751a83170BeA11fE7CdA5D599B04153C021f21A',
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
      name: 'Allowed signers',
      accounts: [
        {
          address: '0x015155D9f7bb601FbF25084C106531c759c05379',
          type: 'EOA',
        },
        {
          address: '0x321072F3Ce95EDa4cc87F42FA483a5822a8A7A92',
          type: 'EOA',
        },
        {
          address: '0xfA85BEA9B0F2D9540040118BeacbaD7258f45d81',
          type: 'EOA',
        },
      ],
      description:
        'Can approve fast withdrawal from the bridge. At least 2 signatures are needed in order for the withdrawal to be valid.',
    },
  ],
  milestones: [
    {
      name: 'ApeX Pro public beta launched',
      date: '2022-11-21T00:00:00Z',
      link: 'https://twitter.com/officialapexdex/status/1564917523401052162?s=21&t=c-SqpS1PL2KOns-2K7myJA',
      description:
        'ApeX Pro beta is launched, with incentives program for users.',
    },
    {
      name: 'ApeX Pro live on Mainnet',
      date: '2022-08-31T00:00:00Z',
      link: 'https://twitter.com/officialapexdex/status/1594722304537288706?s=21&t=c-SqpS1PL2KOns-2K7myJA',
      description:
        'ApeX Pro, a non-custodial decentralized exchange is now live on Mainnet.',
    },
  ],
}
