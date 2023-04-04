import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { getProxyGovernance } from '../discovery/starkware/getProxyGovernance'
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
        address: discovery.getContract('StarkPerpetual').address,
        sinceTimestamp: new UnixTime(1660252039),
        tokens: ['USDC'],
      },
    ],
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
      discovery.getMainContractDetails(
        'StarkPerpetual',
        'Main contract of ApeX exchange. Updates state and verifies its integrity using STARK Verifier. Allows users to deposit and withdraw tokens via normal and emergency modes.',
      ),
      discovery.getMainContractDetails(
        'Committee',
        'Data Availability Committee (DAC) contract verifying data availability claim from DAC Members (via multisig check).',
      ),
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
      name: 'Governors',
      accounts: getProxyGovernance(discovery, 'StarkPerpetual'),
      description:
        'Allowed to upgrade the implementation of the StarkPerpetual contract, potentially maliciously gaining control over the system or stealing funds.',
    },
    {
      name: 'Perpetual Governance Multisig',
      accounts: [
        {
          address: discovery.getContract('PerpetualGovernanceMultisig').address,
          type: 'MultiSig',
        },
      ],
      description:
        'Allowed to upgrade the implementation of the StarkPerpetual contract, potentially maliciously gaining control over the system or stealing funds.',
    },
    {
      name: 'Operators',
      accounts: discovery
        .getContractValue<string[]>('StarkPerpetual', 'OPERATORS')
        .map(discovery.formatPermissionedAccount.bind(discovery)),
      description:
        'Allowed to update state of the system and verify DA proofs. When Operator is down the state cannot be updated.',
    },
    {
      name: 'Data Availability Committee',
      accounts: discovery
        .getConstructorArg<string[]>('Committee', 0)
        .map(discovery.formatPermissionedAccount.bind(discovery)),
      description: `Validity proof must be signed by at least ${discovery.getConstructorArg<string>(
        'Committee',
        1,
      )} of these addresses to approve state update.`,
    },
    {
      name: 'SHARP Verifier Governors',
      accounts: getProxyGovernance(discovery, 'CallProxy'),
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
  knowledgeNuggets: [...NUGGETS.STARKWARE],
}
