import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { PRIVACY_ANONYMITY_SET_MINIMUM_AMOUNTS } from '../../common/privacyAnonymitySets'
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

// topic0 of the standard ERC-20 Transfer(address,address,uint256)
const ERC20_TRANSFER_EVENT =
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

const portal = discovery.getContract('ZkMoneyPortal')
const executor = discovery.getContract('PlainWithdrawalExecutor')
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

const descriptionValues = {
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

const anonymitySetMinimumAmounts =
  PRIVACY_ANONYMITY_SET_MINIMUM_AMOUNTS[underlying.symbol]
assert(
  anonymitySetMinimumAmounts,
  `No anonymity set thresholds for ${underlying.symbol}`,
)

// Deposit addresses accept the underlying and, through the Curve 3pool, the
// USDC and USDT constants of the immutable DepositSIPA code.
const DEPOSIT_FUNDING_TOKENS = [
  underlyingAddress,
  EthereumAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'),
  EthereumAddress('0xdAC17F958D2ee523a2206206994597C13D831ec7'),
]

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
        // Deposits arrive from one-time deposit addresses, so the depositor
        // is whoever funded the address.
        anonymitySet: {
          minimumAmounts: anonymitySetMinimumAmounts,
          fundingTokens: DEPOSIT_FUNDING_TOKENS,
        },
        // Deposits are gross transfers into the portal, including the
        // funding cut that is forwarded to the FPC funder.
        deposit: {
          event: ERC20_TRANSFER_EVENT,
          extractor: 'erc20Transfer',
          params: { to: portalAddress },
        },
        // Withdrawals pay out through the default executor. Filtering on it
        // leaves out the funding cuts that also leave the portal.
        withdrawal: {
          event: ERC20_TRANSFER_EVENT,
          extractor: 'erc20Transfer',
          params: {
            from: portalAddress,
            to: ChainSpecificAddress.address(executor.address),
          },
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
      'A private DAI wallet on Aztec by Aztec Labs, with funds escrowed on Ethereum. Transfers and withdrawals require both an Aztec validity proof and an AWS Nitro enclave signature.',
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
    relayerTracking: {
      type: 'onchainEvents',
      sources: [
        {
          address: portal.address,
          sinceTimestamp: PORTAL_SINCE,
          extractor: 'zkMoneyWithdrawal',
        },
      ],
    },
    zkCatalogId: ProjectId('barretenberg'),
    exitWindow: {
      value: 'Infinite',
      sentiment: 'good',
      orderHint: Number.MAX_SAFE_INTEGER,
      description:
        'The core contracts and approved enclave image are fixed. If Aztec moves to a new rollup, anyone can freeze the portal to stop deposits and fix the refund snapshot at the last proven checkpoint. Withdrawals within the frozen bounds remain available. Later L2 transfers do not change refundable ownership.',
      walkawayTest: {
        passed: false,
        reason:
          'Withdrawals and refunds require a live enclave running the approved image published by Aztec Labs. Running one requires AWS Nitro infrastructure. Both released wallets also depend on zk.money services, so independent operation requires a modified desktop build.',
      },
    },
    // TODO: needs a published, reproducible build of the TEE image that matches
    // the approved PCR0, the Noir source of the resolver circuit,
    // the frozen chain snapshot service, the source of the hosted web wallet
    // release, and public source
    // verification of the zk.money contracts on Aztec (token, fee-paying
    // contract, broadcaster) on aztecscan.xyz.
    // TODO: recheck before publishing that the hosted web wallet still runs a
    // release newer than the published source. The live commit is the
    // `[boot] commit` line in https://wallet.zk.money/assets/index-*.js (it was
    // 9f2ef22, obsidion-wallet v0.0.18, while zkmoney-public holds v0.0.13 at
    // fc37a3e). If zkmoney-public contains the live commit, drop that sentence.
    reproducibility: {
      value: 'Partially reproducible',
      sentiment: 'warning',
      description:
        'The contracts, enclave code and desktop app are open source. The deployed zk.money token on Aztec matches its source, and the refund verifiers are reproducible from the published Noir source. The resolver circuit is published only as its onchain verifier. The approved enclave binary has no published build to check against the source. The hosted wallet runs a newer release than the public source, and the resolver service is closed source.',
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
