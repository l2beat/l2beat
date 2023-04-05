import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
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

const discovery = new ProjectDiscovery('deversifi')

export const rhinofi: Layer2 = {
  type: 'layer2',
  id: ProjectId('deversifi'),
  display: {
    name: 'rhino.fi',
    slug: 'rhinofi',
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
        'https://youtube.com/c/rhinofi',
      ],
    },
    activityDataSource: 'Closed API',
  },
  config: {
    associatedTokens: ['DVF'],
    escrows: [
      {
        address: EthereumAddress('0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b'),
        sinceTimestamp: new UnixTime(1590491810),
        tokens: '*',
      },
    ],
    transactionApi: {
      type: 'starkex',
      product: 'deversifi',
      sinceTimestamp: new UnixTime(1590491810),
      resyncLastDays: 7,
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_ST,
    dataAvailability: RISK_VIEW.DATA_EXTERNAL_DAC,
    upgradeability: RISK_VIEW.UPGRADE_DELAY('14 days'),
    sequencerFailure: RISK_VIEW.SEQUENCER_STARKEX_SPOT,
    validatorFailure: RISK_VIEW.VALIDATOR_ESCAPE_MP,
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
    exitMechanisms: EXITS.STARKEX,
  },
  contracts: {
    addresses: [
      {
        name: 'StarkExchange',
        address: EthereumAddress('0x5d22045DAcEAB03B158031eCB7D9d06Fad24609b'),
        upgradeability: {
          type: 'StarkWare proxy',
          implementation: EthereumAddress(
            '0xB8563AD5aF1F79dd04937BE8B572318c8e6f43AC',
          ),
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
          'Data Availability Committee (DAC) contract verifying data availability claim from DAC Members (via multisig check).',
        address: EthereumAddress('0x28780349A33eEE56bb92241bAAB8095449e24306'),
      },
      SHARP_VERIFIER_CONTRACT,
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_RISK('14 days')],
  },
  permissions: [
    {
      name: 'Governors',
      accounts: discovery
        .getContractValue<string[]>('Proxy', 'GOVERNORS')
        .map((governor) => ({
          address: EthereumAddress(governor),
          type: 'EOA',
        })),
      description:
        'Can upgrade the implementation of the system, potentially gaining access to all funds stored in the bridge. Currently there is no delay before the upgrade, so the users will not have time to migrate.',
    },
    {
      name: 'Data Availability Committee',
      accounts: discovery
        .getConstructorArg<string[]>('Committee', 0)
        .map((a) => ({ address: EthereumAddress(a), type: 'EOA' })),
      description: `Validity proof must be signed by at least ${discovery.getConstructorArg<string>(
        'Committee',
        1,
      )} of these addresses to approve state update.`,
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
      name: 'Operators',
      accounts: discovery
        .getContractValue<string[]>('Proxy', 'OPERATORS')
        .map((operator) => ({
          address: EthereumAddress(operator),
          type: 'EOA',
        })),
      description:
        'Allowed to update the state of the system. When the Operator is down the state cannot be updated.',
    },
  ],
  milestones: [
    {
      name: 'Rebranding',
      date: '2022-07-13T00:00:00Z',
      link: 'https://rhino.fi/blog/introducing-rhino-fi-the-first-frictionless-gateway-to-multi-chain-defi/',
      description:
        'DeversiFi becomes rhino.fi: multi-chain platform gathering DeFi in one place.',
    },
    {
      name: 'DeversiFi Relaunched using Starkware',
      date: '2020-06-03T00:00:00Z',
      link: 'https://rhino.fi/blog/introducing-rhino-fi-the-first-frictionless-gateway-to-multi-chain-defi/',
      description:
        'DeversiFi is live, bringing first STARKex Validium for spot trading.',
    },
  ],
  knowledgeNuggets: [...NUGGETS.STARKWARE],
}
