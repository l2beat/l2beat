import type { ContractValue } from '@l2beat/discovery'
import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
  formatSeconds,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { utils } from 'ethers'
import { PRIVACY_ANONYMITY_SET_MINIMUM_AMOUNTS } from '../../common/privacyAnonymitySets'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { PRIVACY_CATEGORIES } from '../../common/privacyCategories'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { getTokenByAddress } from '../../tokens/getTokenByAddress'
import type {
  BaseProject,
  ProjectPrivacyToken,
  ZkMoneyDepositParams,
  ZkMoneyFundingParams,
} from '../../types'
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
const susdsPortal = discovery.getContract('ZkMoneyPortal_sUSDS')
const susdsUnderlying = getTokenByAddress(
  ChainSpecificAddress.address(
    discovery.getContractValue<ChainSpecificAddress>(
      susdsPortal.address,
      'UNDERLYING',
    ),
  ).toString(),
)

const underlyingAddress = ChainSpecificAddress.address(
  discovery.getContractValue<ChainSpecificAddress>(
    'ZkMoneyPortal',
    'UNDERLYING',
  ),
)
const underlying = getTokenByAddress(underlyingAddress.toString())

const teeSigners = discovery.getContractValue<ChainSpecificAddress[]>(
  'ZkMoneyPortal',
  'teeSigners',
)
for (const name of ['ZkMoneyPortal', 'ZkMoneyPortal_sUSDS']) {
  const owner = discovery.getContractValue<ChainSpecificAddress>(name, 'owner')
  assert(
    ChainSpecificAddress.address(owner) === EthereumAddress.ZERO,
    'zk.money portal ownership is no longer renounced, review the project texts',
    { portal: name },
  )
  assert(
    discovery.getContractValue<string[]>(name, 'approvedPcr0Hashes').length ===
      1,
    'zk.money portal approves more than one enclave image, review the project texts',
    { portal: name },
  )
  assert(
    !discovery.getContractValue<boolean>(name, '_$frozen'),
    'zk.money portal is frozen, review the exit and recovery descriptions',
    { portal: name },
  )
}
const resolverOperators = discovery.getContractValue<
  Record<string, ContractValue>
>('AccountMetadataRegistry', 'resolverOperators')
assert(
  Object.keys(resolverOperators).length === 1 &&
    'eth:0x4748f1359c4dFf0cfB7A36968C05cc314016b664' in resolverOperators,
  'Resolver operators changed, review the operator trust assumptions',
)

const fpcFundingCut = discovery.getContractValueBigInt(
  'ZkMoneyPortal',
  'FPC_FUNDING_CUT',
)
const depositLimit = discovery.getContractValueBigInt(
  'ZkMoneyPortal',
  'GLOBAL_LIMIT',
)
const depositRate = discovery.getContractValueBigInt('ZkMoneyPortal', 'RATE')
const susdsDepositLimit = discovery.getContractValueBigInt(
  susdsPortal.address,
  'GLOBAL_LIMIT',
)
const susdsDepositRate = discovery.getContractValueBigInt(
  susdsPortal.address,
  'RATE',
)
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
assert(
  susdsPortal.sourceHashes?.includes(
    '0x7020e3729f66f6c8ddada17eeb82b33ae8b7f623c0ffb3bb6c921bf966a7f6a8',
  ),
  'ZkMoneyPortal_sUSDS source changed, recheck TX_AMOUNT_CAP',
)
const transactionAmountCap = 2_583n * 10n ** BigInt(underlying.decimals)

function formatToken(
  amount: bigint,
  token: ReturnType<typeof getTokenByAddress> = underlying,
): string {
  const value = Number(utils.formatUnits(amount, token.decimals))
  const digits = value.toLocaleString('en-US', {
    maximumFractionDigits: token.decimals,
  })
  return `${digits} ${token.symbol}`
}

const descriptionValues = {
  transactionAmountCap: formatToken(transactionAmountCap),
  fpcFundingCut: formatToken(fpcFundingCut),
  depositLimit: formatToken(depositLimit),
  depositRefillTime,
  depositFee: formatToken(depositFee),
  registrationSweepFee: formatToken(registrationSweepFee),
  registrationFee: formatToken(registrationFee),
  susdsTransactionAmountCap: formatToken(transactionAmountCap, susdsUnderlying),
  susdsFpcFundingCut: formatToken(
    discovery.getContractValueBigInt(susdsPortal.address, 'FPC_FUNDING_CUT'),
    susdsUnderlying,
  ),
  susdsDepositLimit: formatToken(susdsDepositLimit, susdsUnderlying),
  susdsDepositRefillTime: formatSeconds(
    Number(susdsDepositLimit / susdsDepositRate),
    { fullUnit: true },
  ),
}

const governanceValues = {
  attestationMaxAge,
  teeSignerCount: teeSigners.length,
  susdsTeeSignerCount: discovery.getContractValue<ChainSpecificAddress[]>(
    susdsPortal.address,
    'teeSigners',
  ).length,
}

const factory = discovery.getContract('SIPAFactory')
assert(factory.sinceBlock !== undefined, 'SIPAFactory needs sinceBlock')
// Hardcoded in the verified SIPA sources, which the hashes below pin.
const USDC = EthereumAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48')
const USDT = EthereumAddress('0xdAC17F958D2ee523a2206206994597C13D831ec7')
const CURVE_3POOL = EthereumAddress(
  '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7',
)
const SIPA_SOURCE_HASHES: Record<string, string> = {
  DepositSIPA:
    '0x41c845473c02b812629402016668d06e82153233892bc7f22f03f64308dde979',
  RegistrationSIPA:
    '0xa7b397e987e86f54ad05cdab6542e576fa6dda31466b5da09bb56ad2f0590dbe',
}
const depositLocation: ZkMoneyDepositParams = {
  tokenAddress: underlyingAddress,
  fundingCut: fpcFundingCut.toString(),
  factoryAddress: ChainSpecificAddress.address(factory.address),
  depositImplementation: ChainSpecificAddress.address(
    discovery.getContract('DepositSIPA').address,
  ),
  registrationImplementation: ChainSpecificAddress.address(
    discovery.getContract('RegistrationSIPA').address,
  ),
}
const funderTracing: ZkMoneyFundingParams = {
  ...depositLocation,
  fundingTokens: [underlyingAddress, USDC, USDT],
  exchangeAddress: CURVE_3POOL,
  historyFromBlock: factory.sinceBlock,
}
const operationExecutor = ChainSpecificAddress.address(
  discovery.getContract('OperationExecutor').address,
)
for (const [name, sourceHash] of Object.entries(SIPA_SOURCE_HASHES)) {
  assert(
    discovery.getContract(name).sourceHashes?.includes(sourceHash),
    `${name} source changed, recheck funding attribution`,
  )
}
assert(
  discovery
    .getContract('OperationExecutor')
    .sourceHashes?.includes(
      '0x24befa5b26bdd108306046f44b47342a9326d9611f779b223a2ff299f324c3bd',
    ),
  'OperationExecutor source changed, recheck fee forwarding',
)
const minimumAmounts = (
  PRIVACY_ANONYMITY_SET_MINIMUM_AMOUNTS[underlying.symbol] ?? []
).filter((amount) => BigInt(amount) <= transactionAmountCap)
assert(
  minimumAmounts.length > 0,
  'zk.money needs an applicable funding-address threshold',
)

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
        anonymitySet: { minimumAmounts },
        deposit: {
          event: DEPOSIT_EVENT,
          extractor: 'zkMoneyDeposit',
          params: funderTracing,
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
  // The project starts with the portal. CertManager and NitroValidator were
  // deployed 37 days earlier.
  ossificationHistory: discovery.getOssificationHistory(PORTAL_SINCE),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'A shielded ledger on Aztec Network for DAI payments and sUSDS savings, with funds escrowed on Ethereum.',
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
    discovery.getEscrowDetails({
      address: susdsPortal.address,
      tokens: [susdsUnderlying.symbol],
    }),
  ],
  tvsInfo: {
    associatedTokens: [],
    warnings: [],
  },
  privacyInfo: {
    category: PRIVACY_CATEGORIES.shieldedLedger,
    anonymitySet: { type: 'partially-attributed' },
    relayerTracking: {
      type: 'onchainEvents',
      sources: [
        {
          address: portal.address,
          sinceTimestamp: PORTAL_SINCE,
          extractor: 'zkMoneyWithdrawalRelayer',
          params: {
            tokenAddress: underlyingAddress,
            executorAddress: ChainSpecificAddress.address(
              discovery.getContract('PlainWithdrawalExecutor').address,
            ),
            operationExecutor,
          },
        },
      ],
    },
    trackedOn: ['ethereum'],
    tokens: privacyTokens,
    zkCatalogId: ProjectId('barretenberg'),
    exitWindow: {
      value: 'Infinite',
      sentiment: 'good',
      orderHint: Number.MAX_SAFE_INTEGER,
      description: 'The escrow and the approved enclave image are immutable.',
      walkawayTest: {
        passed: false,
        reason:
          'Withdrawals and refunds need a live AWS Nitro enclave running the approved image. The approved sUSDS image is absent from the documented public downloads. The assessed DAI wallet requires modification to replace zk.money services.',
      },
    },
    // Hosted wallet boot commit on 2026-10-14:
    // 9d00f197e392d3846e7bc2fa3aff037b93d76030. It remains unmatched to the
    // public mirror at 835f7260. The DAI privacy reference stays Desktop v0.1.0.
    reproducibility: {
      value: 'Partially reproducible',
      sentiment: 'warning',
      description:
        'The Ethereum contracts, desktop wallet, enclave and circuit sources are public. The refund and resolver verifiers match the published circuits. The complete enclave image build, resolver service and frozen-chain snapshot service are unpublished. The hosted wallet release is ahead of the to public source and thus unreproduced. Verification instructions cover the refund and resolver circuits and the DAI token pinned by its Ethereum portal.',
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
      discovery.getContract('FrozenNotesRefundVerifier_sUSDS').address,
      discovery.getContract('FrozenDepositRefundVerifier_sUSDS').address,
      discovery.getContract('UnprocessedDepositRefundVerifier_sUSDS').address,
      discovery.getContract('ResolverVerifier').address,
    ],
  },
}
