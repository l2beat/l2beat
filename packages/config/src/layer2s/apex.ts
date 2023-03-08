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
import { ProjectDiscovery } from './common/ProjectDiscovery'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('apex')

export const apex: Layer2 = {
  type: 'layer2',
  id: ProjectId('apex'),
  display: {
    name: 'ApeX',
    slug: 'apex',
    description:
      'ApeX Pro is a non-custodial trading platform that delivers limitless cross-margined perpetual contracts trading.',
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
        address: EthereumAddress('0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb'),
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
        address: EthereumAddress('0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb'),
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
        name: 'Committee',
        address: EthereumAddress('0x23Cab3CF1aa7B929Df5e9f3712aCA3A6Fb9494E4'),
        description:
          'Data Availability Committee (DAC) contract verifying data availability claim from DAC Members (via multisig check).',
      },
      {
        name: 'MultiSigPool',
        address: EthereumAddress('0xe95b3Dc78c0881dEa17A69BaFC6cFeB8d891e9DE'),
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
          address: EthereumAddress(
            '0xef75e1199B0599BA823b7770AcE8eb34864a1D55',
          ),
          type: 'EOA',
        },
      ],
      description:
        'Allowed to upgrade the implementation of the StarkPerpetual contract, potentially maliciously gaining control over the system or stealing funds.',
    },
    {
      name: 'Governance Multisig',
      accounts: [
        {
          address: discovery.getContract('GnosisSafe').address,
          type: 'MultiSig',
        },
      ],
      description:
        'Allowed to upgrade the implementation of the StarkPerpetual contract, potentially maliciously gaining control over the system or stealing funds.',
    },
    {
      name: 'MultiSig participants',
      accounts: discovery
        .getContractValue<string[]>('GnosisSafe', 'getOwners')
        .map((owner) => ({ address: EthereumAddress(owner), type: 'EOA' })),
      description: `These addresses are the participants of the ${discovery.getContractValue<number>(
        'GnosisSafe',
        'getThreshold',
      )}/${
        discovery.getContractValue<string[]>('GnosisSafe', 'getOwners').length
      } ApeX MultiSig.`,
    },
    {
      name: 'Operator',
      accounts: [
        {
          address: EthereumAddress(
            '0x78e802d42Bbc1834f962A11B54e0F8e07f52d4Fb',
          ),
          type: 'EOA',
        },
      ],
      description:
        'Allowed to update state of the system and verify DA proofs. When Operator is down the state cannot be updated.',
    },
    {
      name: 'Data Availability Committee',
      accounts: [
        {
          address: EthereumAddress(
            '0x81165b6504520416487E5b4935865b4D3eeaa6e5',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xA6d068DE0da2Dc1BeCaB509B118CB88723f72b6A',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x0cbb676d12745948f75aF3A172cb7E4A4f8546e8',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xB0d71Ff040A941bB9CA8453044634EebCE5A053D',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x8f3310cc6951AC11F2B125fC8AC2dfA133A9498c',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x696cC7615A50CF12d1d1B38bF18A5606e9708296',
          ),
          type: 'EOA',
        },
      ],
      description:
        'Validity proof must be signed by at least 3 of these addresses to approve state update.',
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
      name: 'Allowed signers',
      accounts: [
        {
          address: EthereumAddress(
            '0x015155D9f7bb601FbF25084C106531c759c05379',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0x321072F3Ce95EDa4cc87F42FA483a5822a8A7A92',
          ),
          type: 'EOA',
        },
        {
          address: EthereumAddress(
            '0xfA85BEA9B0F2D9540040118BeacbaD7258f45d81',
          ),
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
  knowledgeNuggets: [...NUGGETS.STARKEX_NUGGETS],
}
