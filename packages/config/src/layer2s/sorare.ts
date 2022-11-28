import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/types'

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

export const sorare: Layer2 = {
  type: 'layer2',
  id: ProjectId('sorare'),
  display: {
    name: 'Sorare',
    slug: 'sorare',
    description:
      'Sorare is a global fantasy football game where you can play with officially licensed digital cards and earn prizes every week.',
    purpose: 'NFT, Exchange',
    links: {
      websites: ['https://sorare.com/'],
      apps: [],
      documentation: ['https://docs.starkware.co/starkex-docs-v2/'],
      explorers: [],
      repositories: ['https://github.com/starkware-libs/starkex-contracts'],
      socialMedia: [
        'https://discord.gg/TSjtHaM',
        'https://reddit.com/r/Sorare/',
        'https://twitter.com/sorarehq',
        'https://instagram.com/sorare_official/',
      ],
    },
    activityDataSource: 'Closed API',
  },
  config: {
    escrows: [
      {
        address: '0xF5C9F957705bea56a7e806943f98F7777B995826',
        sinceTimestamp: new UnixTime(1626352527),
        tokens: ['ETH'],
      },
    ],
    events: [
      {
        name: 'LogStateTransitionFact',
        abi: 'event LogStateTransitionFact(bytes32 stateTransitionFact)',
        emitter: EthereumAddress('0xF5C9F957705bea56a7e806943f98F7777B995826'),
        type: 'state',
        sinceTimestamp: new UnixTime(1626352527),
      },
    ],
    transactionApiV2: {
      type: 'starkex',
      product: 'sorare',
      sinceTimestamp: new UnixTime(1626352527),
      resyncLastDays: 7,
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_ST,
    dataAvailability: RISK_VIEW.DATA_EXTERNAL_DAC,
    upgradeability: RISK_VIEW.UPGRADE_DELAY('14 days'),
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
        address: '0xF5C9F957705bea56a7e806943f98F7777B995826',
        upgradeability: {
          type: 'StarkWare',
          implementation: '0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC',
          upgradeDelay: 1209600,
          isFinal: false,
        },
      },
      {
        name: 'Committee',
        description: CONTRACTS.UNVERIFIED_DESCRIPTION,
        address: '0x879cD57975d596004863D30c59d579ef78BBbe32',
      },
      SHARP_VERIFIER_CONTRACT,
    ],
    risks: [
      CONTRACTS.UPGRADE_WITH_DELAY_RISK('14 days'),
      CONTRACTS.UNVERIFIED_RISK,
    ],
  },
  permissions: [
    {
      name: 'Governor',
      accounts: [
        {
          address: '0x5918481F777dBe437De249492B90AffB4e655de4',
          type: 'EOA',
        },
      ],
      description:
        'Can upgrade implementation of the system, potentially gaining access to all funds stored in the bridge. Currently there is no delay before the upgrade, so the users will not have time to migrate.',
    },
    {
      name: 'Data Availability Committee',
      accounts: [],
      description:
        'There exists a Data Availability Committee with unknown members and an unverified smart contract.',
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
          address: '0x63881ac44293E22F3c3183a0C4113586ABb3e653',
          type: 'EOA',
        },
      ],
      description:
        'Allowed to update state of the system. When Operator is down the state cannot be updated.',
    },
  ],
}
