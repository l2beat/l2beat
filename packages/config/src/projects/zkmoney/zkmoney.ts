import type { ContractValue } from '@l2beat/discovery'
import {
  assert,
  ChainSpecificAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { PRIVACY_CATEGORIES } from '../../common/privacyCategories'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { getTokenByAddress } from '../../tokens/getTokenByAddress'
import type { BaseProject, ProjectPrivacyToken } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'
import { zkMoneyAdversaries } from './adversaries'

const discovery = new ProjectDiscovery('zkmoney')

// Portal events measure credited deposits and payouts, excluding sponsorship
// cuts and prover tips. ERC-20 transfers would also count direct donations.
const DEPOSIT_EVENT =
  '0x8154af7b1b360f500640de68c82af19c52c4ad4189d7a7c7a41506e19a1fdd6c'
const WITHDRAWAL_EVENT =
  '0x0ef2e2e9f18042ca214d1bee833209f28326ffa8f4a6b0dc92172caf71bc5433'

const portal = discovery.getContract('ZkMoneyPortal')
assert(
  portal.sinceTimestamp !== undefined,
  'ZkMoneyPortal needs sinceTimestamp',
)
const PORTAL_SINCE = UnixTime(portal.sinceTimestamp)
const portalAddress = ChainSpecificAddress.address(portal.address)

const underlyingAddress = ChainSpecificAddress.address(
  discovery.getContractValue<ChainSpecificAddress>(
    'ZkMoneyPortal',
    'UNDERLYING',
  ),
)
const underlying = getTokenByAddress(underlyingAddress.toString())

const approvedPcr0Hashes = discovery.getContractValue<string[]>(
  'ZkMoneyPortal',
  'approvedPcr0Hashes',
)
const teeSigners = discovery.getContractValue<ChainSpecificAddress[]>(
  'ZkMoneyPortal',
  'teeSigners',
)
const portalOwner = discovery.getContractValue<ChainSpecificAddress>(
  'ZkMoneyPortal',
  'owner',
)
assert(
  ChainSpecificAddress.address(portalOwner).toString() ===
    '0x0000000000000000000000000000000000000000',
  'ZkMoneyPortal ownership is no longer renounced, review the project texts',
)
assert(
  approvedPcr0Hashes.length === 1,
  'ZkMoneyPortal approves more than one enclave image, review the project texts',
)
assert(
  !discovery.getContractValue<boolean>('ZkMoneyPortal', '_$frozen'),
  'ZkMoneyPortal is frozen, review the exit and recovery descriptions',
)
const resolverOperators = discovery.getContractValue<
  Record<string, ContractValue>
>('AccountMetadataRegistry', 'resolverOperators')
assert(
  Object.keys(resolverOperators).length === 1 &&
    'eth:0x4748f1359c4dFf0cfB7A36968C05cc314016b664' in resolverOperators,
  'Resolver operators changed, review the operator trust assumptions',
)

function formatDai(wei: bigint): string {
  const scale = 10n ** BigInt(underlying.decimals)
  const whole = wei / scale
  const cents = ((wei % scale) * 100n) / scale
  const fraction =
    cents > 0n ? `.${cents.toString().padStart(2, '0').replace(/0$/, '')}` : ''
  return `${whole.toLocaleString('en-US')}${fraction} ${underlying.symbol}`
}

const fpcFundingCut = discovery.getContractValueBigInt(
  'ZkMoneyPortal',
  'FPC_FUNDING_CUT',
)
const depositLimit = discovery.getContractValueBigInt(
  'ZkMoneyPortal',
  'GLOBAL_LIMIT',
)
const depositRate = discovery.getContractValueBigInt('ZkMoneyPortal', 'RATE')
const depositRefillTime = formatSeconds(Number(depositLimit / depositRate), {
  fullUnit: true,
})
const depositFee = discovery.getContractValueBigInt(
  'DepositSIPA',
  'DEPOSIT_FEE',
)
const registrationSweepFee = discovery.getContractValueBigInt(
  'RegistrationSIPA',
  'DEPOSIT_FEE',
)
const registrationFee = discovery.getContractValueBigInt(
  'RegistrationController',
  'REGISTRATION_FEE',
)
const attestationMaxAge = formatSeconds(
  discovery.getContractValue<number>(
    'ZkMoneyPortal',
    'TEE_ATTESTATION_MAX_AGE',
  ),
  { fullUnit: true },
)

// TX_AMOUNT_CAP is an internal constant with no getter. Guard its value
// against the verified portal source, which includes OxideConstants.
assert(
  portal.sourceHashes?.includes(
    '0x4abb439f2218670904cdae29f2663f412a1ca4d63284a05120c764dc8eed141e',
  ),
  'ZkMoneyPortal source changed, recheck TX_AMOUNT_CAP',
)
const transactionAmountCap = 2_583n * 10n ** BigInt(underlying.decimals)

const descriptionValues = {
  transactionAmountCap: formatDai(transactionAmountCap),
  fpcFundingCut: formatDai(fpcFundingCut),
  depositLimit: formatDai(depositLimit),
  depositRefillTime,
  depositFee: formatDai(depositFee),
  registrationSweepFee: formatDai(registrationSweepFee),
  registrationFee: formatDai(registrationFee),
}

const governanceValues = {
  attestationMaxAge,
  teeSignerCount: String(teeSigners.length),
}

const privacyTokens: ProjectPrivacyToken[] = [
  {
    token: {
      address: underlyingAddress.toString(),
      iconUrl: underlying.iconUrl,
      symbol: underlying.symbol,
      decimals: underlying.decimals,
      priceId: underlying.coingeckoId,
      sinceTimestamp: PORTAL_SINCE,
    },
    buckets: [
      {
        id: `zkmoney-${underlying.symbol}`,
        type: 'pool',
        label: underlying.symbol,
        address: portal.address,
        sinceTimestamp: PORTAL_SINCE,
        // Depositor and relayer counts remain untracked: SIPAs can be reused
        // or have multiple funders, and finalization callers need not be relayers.
        deposit: {
          event: DEPOSIT_EVENT,
          extractor: 'zkMoneyDeposit',
          params: {},
        },
        withdrawal: {
          event: WITHDRAWAL_EVENT,
          extractor: 'zkMoneyWithdrawal',
          params: {},
        },
      },
    ],
  },
]

export const zkmoney: BaseProject = {
  id: ProjectId('zkmoney'),
  slug: 'zkmoney',
  name: 'zk.money',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2026-09-29')),
  discoveryInfo: getDiscoveryInfo([discovery]),
  ossification: discovery.getOssification(),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'A private DAI wallet on Aztec Network, with funds escrowed on Ethereum.',
    detailedDescription: readProjectMarkdown(
      'zkmoney',
      'detailedDescription',
      descriptionValues,
    ),
    links: {
      websites: ['https://zk.money'],
      documentation: ['https://docs.zk.money/docs'],
      repositories: ['https://github.com/aztec-labs-eng/zkmoney-public'],
      explorers: [
        'https://aztecscan.xyz/contracts/instances/0x015ca4a43f83d08a038c36c06ca92527f120dc1f9176ea85d1ea347decaf444d',
      ],
    },
    badges: [],
  },
  escrows: [
    {
      address: portalAddress,
      chain: ChainSpecificAddress.longChain(portal.address),
      sinceTimestamp: PORTAL_SINCE,
      tokens: [underlying.symbol],
    },
  ],
  tvsInfo: {
    associatedTokens: [],
    warnings: [],
  },
  privacyInfo: {
    category: PRIVACY_CATEGORIES.shieldedLedger,
    trackedOn: ['ethereum'],
    tokens: privacyTokens,
    zkCatalogId: ProjectId('barretenberg'),
    exitWindow: {
      value: 'Infinite',
      sentiment: 'good',
      orderHint: Number.MAX_SAFE_INTEGER,
      description:
        'The escrow and approved enclave image cannot be upgraded. Every withdrawal and refund still needs a proof and a live approved enclave. If Aztec changes its canonical rollup, anyone can freeze deposits and fix refundable ownership at the last proven checkpoint. Later L2 transfers do not change it.',
      walkawayTest: {
        passed: false,
        reason:
          'Withdrawals and refunds require a live enclave running the approved image published by Aztec Labs. Running one requires AWS Nitro infrastructure. Both released wallets also depend on zk.money services, so independent operation requires a modified desktop build.',
      },
    },
    // Recheck the hosted wallet's [boot] commit before publication. On
    // 2026-09-30 it was 2236b3fd7350c09fcb938f8a1aa6895ab26ef42e,
    // which is absent from the public source at 1ac7d607.
    reproducibility: {
      value: 'Partially reproducible',
      sentiment: 'warning',
      description:
        'The contract, desktop wallet and enclave sources are public. The deployed refund verifiers match the published Solidity. The approved enclave binary has not been reproduced. The resolver circuit and service, frozen-chain snapshot service and hosted wallet release source are unpublished. Verification instructions cover the refund circuits and the Aztec token pinned by the Ethereum portal.',
    },
    attributes: [
      PRIVACY_ATTRIBUTES.zk,
      PRIVACY_ATTRIBUTES.tee,
      PRIVACY_ATTRIBUTES.transfers,
      PRIVACY_ATTRIBUTES.anyAmount,
    ],
    adversaries: zkMoneyAdversaries,
    riskSummary: readProjectMarkdown('zkmoney', 'riskSummary'),
    upgradesAndGovernance: {
      content: readProjectMarkdown(
        'zkmoney',
        'upgradesAndGovernance',
        governanceValues,
      ),
    },
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
    zkVerifiers: [
      discovery.getContract('FrozenNotesRefundVerifier').address,
      discovery.getContract('FrozenDepositRefundVerifier').address,
      discovery.getContract('UnprocessedDepositRefundVerifier').address,
      discovery.getContract('ResolverVerifier').address,
    ],
  },
}
