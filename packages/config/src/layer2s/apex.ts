import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import {
  getCommittee,
  getProxyGovernance,
  getSHARPVerifierContracts,
  getSHARPVerifierGovernors,
} from '../discovery/starkware'
import { delayDescriptionFromString } from '../utils/delayDescription'
import { formatSeconds } from '../utils/formatSeconds'
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
  STATE_CORRECTNESS,
} from './common'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('apex')

const delaySeconds = discovery.getContractUpgradeabilityParam(
  'StarkExchange',
  'upgradeDelay',
)
const delay = formatSeconds(delaySeconds)

const verifierAddress = discovery.getAddressFromValue(
  'FinalizableGpsFactAdapter',
  'gpsContract',
)

const freezeGracePeriod = discovery.getContractValue<number>(
  'StarkExchange',
  'FREEZE_GRACE_PERIOD',
)

export const apex: Layer2 = {
  type: 'layer2',
  id: ProjectId('apex'),
  display: {
    name: 'ApeX',
    slug: 'apex',
    description:
      'ApeX Pro is a non-custodial trading platform that delivers limitless cross-margined perpetual contracts trading.',
    purpose: 'Exchange',
    provider: 'StarkEx',
    category: 'Validium',
    links: {
      websites: ['https://apex.exchange/'],
      apps: ['https://pro.apex.exchange/'],
      documentation: ['https://apex-pro.gitbook.io/apex-pro?lang=en-US'],
      explorers: [],
      repositories: ['https://github.com/ApeX-Protocol/core'],
      socialMedia: ['https://twitter.com/OfficialApeXdex'],
    },
    activityDataSource: 'Closed API',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb'),
        sinceTimestamp: new UnixTime(1660252039),
        tokens: ['USDC'],
      }),
    ],
    transactionApi: {
      type: 'starkex',
      product: 'apex',
      sinceTimestamp: new UnixTime(1660252039),
      resyncLastDays: 7,
    },
  },
  riskView: makeBridgeCompatible({
    stateValidation: RISK_VIEW.STATE_ZKP_ST,
    dataAvailability: {
      ...RISK_VIEW.DATA_EXTERNAL_DAC,
      sources: [
        {
          contract: 'StarkExchange',
          references: [
            'https://etherscan.io/address/0xdD5f42B087C1D2F73a2b443249b7D3DbE148a859#code#F36#L174',
          ],
        },
        {
          contract: 'Committee',
          references: [
            'https://etherscan.io/address/0x23cab3cf1aa7b929df5e9f3712aca3a6fb9494e4#code#F1#L84',
          ],
        },
      ],
    },
    upgradeability: RISK_VIEW.UPGRADE_DELAY_SECONDS(delaySeconds),
    sequencerFailure:
      RISK_VIEW.SEQUENCER_FORCE_VIA_L1_STARKEX_PERPETUAL(freezeGracePeriod),
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP_AVGPRICE,
    validatedBy: RISK_VIEW.VALIDATED_BY_ETHEREUM,
    destinationToken: RISK_VIEW.CANONICAL_USDC,
  }),
  technology: {
    stateCorrectness: STATE_CORRECTNESS.STARKEX_VALIDITY_PROOFS,
    newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
    dataAvailability: DATA_AVAILABILITY.STARKEX_OFF_CHAIN,
    operator: OPERATOR.STARKEX_OPERATOR,
    forceTransactions:
      FORCE_TRANSACTIONS.STARKEX_PERPETUAL_WITHDRAW(freezeGracePeriod),
    exitMechanisms: EXITS.STARKEX_PERPETUAL,
  },
  contracts: {
    addresses: [
      discovery.getContractDetails(
        'StarkExchange',
        'Main contract of ApeX exchange. Updates state and verifies its integrity using STARK Verifier. Allows users to deposit and withdraw tokens via normal and emergency modes.',
      ),
      discovery.getContractDetails(
        'Committee',
        'Data Availability Committee (DAC) contract verifying data availability claim from DAC Members (via multisig check).',
      ),
      {
        name: 'MultiSigPool',
        address: EthereumAddress('0xe95b3Dc78c0881dEa17A69BaFC6cFeB8d891e9DE'),
        description:
          'Allows deposits in different tokens and swaps them to USDC. Allows fast withdrawals after the agreement of at least 2 designated signers.',
      },
      discovery.getContractDetails('PerpetualEscapeVerifier', {
        description:
          'Contract responsible for validating force withdrawal requests.',
      }),
      ...getSHARPVerifierContracts(discovery, verifierAddress),
    ],
    risks: [CONTRACTS.UPGRADE_WITH_DELAY_SECONDS_RISK(delaySeconds)],
  },
  permissions: [
    {
      name: 'Governors',
      accounts: getProxyGovernance(discovery, 'StarkExchange'),
      description:
        'Allowed to upgrade the implementation of the StarkExchange contract, potentially maliciously gaining control over the system or stealing funds.' +
        delayDescriptionFromString(delay),
    },
    {
      name: 'Operators',
      accounts: discovery.getPermissionedAccounts('StarkExchange', 'OPERATORS'),
      description:
        'Allowed to update state of the system and verify DA proofs. When Operator is down the state cannot be updated.',
    },
    getCommittee(discovery),
    ...getSHARPVerifierGovernors(discovery, verifierAddress),
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
