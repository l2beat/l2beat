import {
  EthereumAddress,
  ProjectId,
  UnixTime,
  formatSeconds,
} from '@l2beat/shared-pure'
import {
  CONTRACTS,
  DA_BRIDGES,
  DA_LAYERS,
  DA_MODES,
  EXITS,
  FORCE_TRANSACTIONS,
  NEW_CRYPTOGRAPHY,
  NUGGETS,
  OPERATOR,
  RISK_VIEW,
  STATE_CORRECTNESS,
  TECHNOLOGY_DATA_AVAILABILITY,
} from '../../common'
import { REASON_FOR_BEING_OTHER } from '../../common'
import { formatDelay } from '../../common/formatDelays'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import {
  getCommittee,
  getProxyGovernance,
  getSHARPVerifierContracts,
  getSHARPVerifierGovernors,
  getSHARPVerifierUpgradeDelay,
} from '../../discovery/starkware'
import type { Layer2 } from '../../types'
import { delayDescriptionFromString } from '../../utils/delayDescription'
import { Badge } from '../badges'
import { StarkexDAC } from '../da-beat/templates/starkex-template'

const discovery = new ProjectDiscovery('apex')

const upgradeDelaySecondsUSDC = discovery.getContractValue<number>(
  'StarkExchangeUSDC',
  'StarkWareDiamond_upgradeDelay',
)
const upgradeDelaySecondsUSDT = discovery.getContractValue<number>(
  'StarkExchangeUSDT',
  'StarkWareDiamond_upgradeDelay',
)
const upgradeDelayUSDC = formatSeconds(upgradeDelaySecondsUSDC)
const upgradeDelayUSDT = formatSeconds(upgradeDelaySecondsUSDT)

const upgradeDelaySeconds = Math.min(
  upgradeDelaySecondsUSDC,
  upgradeDelaySecondsUSDT,
)

const includingSHARPUpgradeDelaySeconds = Math.min(
  upgradeDelaySeconds,
  getSHARPVerifierUpgradeDelay(),
)

const verifierAddressUSDC = discovery.getAddressFromValue(
  'FinalizableGpsFactAdapterUSDC',
  'gpsContract',
)

const verifierAddressUSDT = discovery.getAddressFromValue(
  'FinalizableGpsFactAdapterUSDT',
  'gpsContract',
)

const freezeGracePeriodUSDC = discovery.getContractValue<number>(
  'StarkExchangeUSDC',
  'FREEZE_GRACE_PERIOD',
)

const freezeGracePeriodUSDT = discovery.getContractValue<number>(
  'StarkExchangeUSDT',
  'FREEZE_GRACE_PERIOD',
)

const minFreezeGracePeriod = Math.min(
  freezeGracePeriodUSDC,
  freezeGracePeriodUSDT,
)

const {
  committeePermission: usdcCommittee,
  minSigners: usdcMinSigners,
  minAssumedHonestMembers: usdcMinAssumedHonestMembers,
} = getCommittee(
  discovery,
  'CommitteeUSDC',
  'Data Availability Committee for USDC StarkEx',
)
const {
  committeePermission: usdtCommittee,
  minSigners: usdtMinSigners,
  minAssumedHonestMembers: usdtMinAssumedHonestMembers,
} = getCommittee(
  discovery,
  'CommitteeUSDT',
  'Data Availability Committee for USDT StarkEx',
)

const usdcDacConfig =
  usdcMinAssumedHonestMembers / usdcCommittee.accounts.length
const usdtDacConfig =
  usdtMinAssumedHonestMembers / usdtCommittee.accounts.length

const dacConfig =
  usdcDacConfig < usdtDacConfig
    ? {
        requiredSignatures: usdcMinSigners,
        membersCount: usdcCommittee.accounts.length,
      }
    : {
        requiredSignatures: usdtMinSigners,
        membersCount: usdtCommittee.accounts.length,
      }

export const apex: Layer2 = {
  type: 'layer2',
  id: ProjectId('apex'),
  addedAt: new UnixTime(1663927910), // 2022-09-23T10:11:50Z
  capability: 'appchain',
  badges: [
    Badge.VM.AppChain,
    Badge.DA.DAC,
    Badge.Stack.StarkEx,
    Badge.Infra.SHARP,
  ],
  reasonsForBeingOther: [REASON_FOR_BEING_OTHER.LOW_DAC_THRESHOLD],
  display: {
    name: 'ApeX',
    slug: 'apex',
    description: `ApeX Pro is a non-custodial trading platform that delivers
      limitless cross-margined perpetual contracts trading.`,
    detailedDescription: `ApeX Pro is running
      two independent StarkEx instances, one for USDC and one for USDT, but that
      technical distinction is not visible to the user.`,
    purposes: ['Exchange'],
    stack: 'StarkEx',
    category: 'Validium',
    links: {
      websites: ['https://apex.exchange/'],
      apps: ['https://pro.apex.exchange/'],
      documentation: ['https://apex-pro.gitbook.io/apex-pro?lang=en-US'],
      repositories: ['https://github.com/ApeX-Protocol/core'],
      socialMedia: [
        'https://twitter.com/OfficialApeXdex',
        'https://apexdex.medium.com/',
        'https://t.me/ApeXdex',
        'https://discord.com/invite/apexprotocol',
        'https://youtube.com/@apexprotocol',
      ],
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    associatedTokens: ['APEX'],
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xA1D5443F2FB80A5A55ac804C948B45ce4C52DCbb'),
        sinceTimestamp: new UnixTime(1660252039),
        tokens: ['USDC'],
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xe53A6eD882Eb3f90cCe0390DDB04c876C5482E6b'),
        tokens: ['USDT'],
      }),
    ],
    transactionApi: {
      type: 'starkex',
      product: ['apex_usdc', 'apex_usdt'],
      sinceTimestamp: new UnixTime(1660252039),
      resyncLastDays: 7,
    },
  },
  dataAvailability: {
    layer: DA_LAYERS.DAC,
    bridge: DA_BRIDGES.DAC_MEMBERS(dacConfig),
    mode: DA_MODES.STATE_DIFFS,
  },
  riskView: {
    stateValidation: RISK_VIEW.STATE_ZKP_ST,
    dataAvailability: RISK_VIEW.DATA_EXTERNAL_DAC(dacConfig),
    exitWindow: RISK_VIEW.EXIT_WINDOW(
      includingSHARPUpgradeDelaySeconds,
      minFreezeGracePeriod,
    ),
    sequencerFailure: {
      ...RISK_VIEW.SEQUENCER_FORCE_VIA_L1_STARKEX_PERPETUAL(
        minFreezeGracePeriod,
      ),
      secondLine: formatDelay(minFreezeGracePeriod),
    },
    proposerFailure: RISK_VIEW.PROPOSER_USE_ESCAPE_HATCH_MP_AVGPRICE,
  },
  technology: {
    stateCorrectness: STATE_CORRECTNESS.STARKEX_VALIDITY_PROOFS,
    newCryptography: NEW_CRYPTOGRAPHY.ZK_STARKS,
    dataAvailability: TECHNOLOGY_DATA_AVAILABILITY.STARKEX_OFF_CHAIN,
    operator: OPERATOR.STARKEX_OPERATOR,
    forceTransactions:
      FORCE_TRANSACTIONS.STARKEX_PERPETUAL_WITHDRAW(minFreezeGracePeriod),
    exitMechanisms: EXITS.STARKEX_PERPETUAL,
  },
  contracts: {
    addresses: {
      [discovery.chain]: [
        discovery.getContractDetails(
          'StarkExchangeUSDC',
          'Main contract of ApeX exchange for USDC collateral. Updates state and verifies its integrity using STARK Verifier. Allows users to deposit and withdraw tokens via normal and emergency modes.',
        ),
        discovery.getContractDetails(
          'StarkExchangeUSDT',
          'Main contract of ApeX exchange for USDT collateral. Updates state and verifies its integrity using STARK Verifier. Allows users to deposit and withdraw tokens via normal and emergency modes.',
        ),
        discovery.getContractDetails(
          'CommitteeUSDC',
          'Data Availability Committee (DAC) contract for USDC StarkEx instance, verifying data availability claim from DAC Members (via multisig check).',
        ),
        discovery.getContractDetails(
          'CommitteeUSDT',
          'Data Availability Committee (DAC) contract for USDT StarkEx instance, verifying data availability claim from DAC Members (via multisig check).',
        ),
        discovery.getContractDetails('MultiSigPoolUSDC', {
          description:
            'Allows deposits in different tokens and swaps them to USDC. Allows fast withdrawals after the agreement of at least 2 designated signers.',
        }),
        discovery.getContractDetails('MultiSigPoolUSDT', {
          description:
            'Allows deposits in different tokens and swaps them to USDT. Allows fast withdrawals after the agreement of at least 2 designated signers.',
        }),
        discovery.getContractDetails('PerpetualEscapeVerifier', {
          description:
            'Contract responsible for validating force withdrawal requests. Used by both USDC and USDT StarkEx instances.',
        }),
        ...getSHARPVerifierContracts(discovery, verifierAddressUSDC),
        ...(verifierAddressUSDT !== verifierAddressUSDC
          ? getSHARPVerifierContracts(discovery, verifierAddressUSDT)
          : []),
      ],
    },
    risks: [
      CONTRACTS.UPGRADE_WITH_DELAY_SECONDS_RISK(
        includingSHARPUpgradeDelaySeconds,
      ),
    ],
  },
  permissions: {
    [discovery.chain]: {
      actors: [
        discovery.getPermissionDetails(
          'Governors for USDC StarkEx',
          getProxyGovernance(discovery, 'StarkExchangeUSDC'),
          'Allowed to upgrade the implementation of the StarkExchange (USDC) contract, potentially maliciously gaining control over the system or stealing funds.' +
            delayDescriptionFromString(upgradeDelayUSDC),
        ),
        discovery.getPermissionDetails(
          'Governors for USDT StarkEx',
          getProxyGovernance(discovery, 'StarkExchangeUSDT'),
          'Allowed to upgrade the implementation of the StarkExchange (USDT) contract, potentially maliciously gaining control over the system or stealing funds.' +
            delayDescriptionFromString(upgradeDelayUSDT),
        ),
        discovery.getPermissionDetails(
          'Operators for USDC StarkEx',
          discovery.getPermissionedAccounts('StarkExchangeUSDC', 'OPERATORS'),
          'Allowed to update state of the system and verify DA proofs for USDC StarkEx instance. When Operator is down the state cannot be updated.',
        ),
        discovery.getPermissionDetails(
          'Operators for USDT StarkEx',
          discovery.getPermissionedAccounts('StarkExchangeUSDT', 'OPERATORS'),
          'Allowed to update state of the system and verify DA proofs for USDT StarkEx instance. When Operator is down the state cannot be updated.',
        ),
        usdcCommittee,
        usdtCommittee,
        ...getSHARPVerifierGovernors(discovery, verifierAddressUSDC),
        ...(verifierAddressUSDT !== verifierAddressUSDC
          ? getSHARPVerifierGovernors(discovery, verifierAddressUSDT)
          : []),
      ],
    },
  },
  milestones: [
    {
      title: 'ApeX Pro public beta launched',
      date: '2022-11-21T00:00:00Z',
      url: 'https://twitter.com/officialapexdex/status/1564917523401052162?s=21&t=c-SqpS1PL2KOns-2K7myJA',
      description:
        'ApeX Pro beta is launched, with incentives program for users.',
      type: 'general',
    },
    {
      title: 'ApeX Pro live on Mainnet',
      date: '2022-08-31T00:00:00Z',
      url: 'https://twitter.com/officialapexdex/status/1594722304537288706?s=21&t=c-SqpS1PL2KOns-2K7myJA',
      description:
        'ApeX Pro, a non-custodial decentralized exchange is now live on Mainnet.',
      type: 'general',
    },
  ],
  knowledgeNuggets: [...NUGGETS.STARKWARE],
  customDa: StarkexDAC({
    dac: {
      requiredMembers: dacConfig.requiredSignatures,
      membersCount: dacConfig.membersCount,
    },
  }),
}
