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
import { zkMoneyV6Adversaries } from './adversaries'

const discovery = new ProjectDiscovery('zkmoneyv6')

// Portal events measure credited deposits and payouts, excluding prover tips.
// ERC-20 transfers would also count direct donations.
const DEPOSIT_EVENT =
  '0x8154af7b1b360f500640de68c82af19c52c4ad4189d7a7c7a41506e19a1fdd6c'
const WITHDRAWAL_EVENT =
  '0x0ef2e2e9f18042ca214d1bee833209f28326ffa8f4a6b0dc92172caf71bc5433'

const portal = discovery.getContract('OxidePortal')
assert(portal.sinceTimestamp !== undefined, 'OxidePortal needs sinceTimestamp')
const PORTAL_SINCE = UnixTime(portal.sinceTimestamp)
const susdsPortal = discovery.getContract('OxidePortal_sUSDS')
const underlying = getTokenByAddress(
  ChainSpecificAddress.address(
    discovery.getContractValue<ChainSpecificAddress>(
      'OxidePortal',
      'UNDERLYING',
    ),
  ).toString(),
)
const susdsUnderlying = getTokenByAddress(
  ChainSpecificAddress.address(
    discovery.getContractValue<ChainSpecificAddress>(
      'OxidePortal_sUSDS',
      'UNDERLYING',
    ),
  ).toString(),
)

for (const name of ['OxidePortal', 'OxidePortal_sUSDS']) {
  assert(
    !discovery.getContractValue<boolean>(name, '_$frozen'),
    'zk.money v6 portal froze, review the exit and refund texts',
    { portal: name },
  )
}
// keccak256 of PCR0 4d28e5b1…, an image absent from the public downloads.
assert(
  discovery.getContractValue<string>('TeeRegistry', 'PCR0_HASH') ===
    '0xf8c74ed4c30d08100cf653c802123b07a6880f3e2601e23d6bfd498d9db0423a',
  'zk.money approves a new enclave image, review the enclave texts',
)
const resolverOperators = discovery.getContractValue<
  Record<string, ContractValue>
>('AccountMetadataRegistry', 'resolverOperators')
assert(
  Object.keys(resolverOperators).length === 1 &&
    'eth:0x4748f1359c4dFf0cfB7A36968C05cc314016b664' in resolverOperators,
  'Resolver operators changed, review the operator trust assumptions',
)

const depositSipa = discovery.getContract('DepositSIPA')
const registrationSipa = discovery.getContract('RegistrationSIPA')
assert(
  discovery.getContractValue<ChainSpecificAddress>(
    'SIPAFactory',
    'depositImplementation',
  ) === depositSipa.address &&
    discovery.getContractValue<ChainSpecificAddress>(
      'SIPAFactory',
      'registrationImplementation',
    ) === registrationSipa.address,
  'SIPAFactory blessed a new deposit address implementation, review the deposit texts and funding attribution',
)
// Hardcoded in the verified sources, which the hashes below pin.
const SOURCE_HASHES: Record<string, string> = {
  DepositSIPA:
    '0x53b4469d59472a86285da196c2e9315df903b89c1ade8e0bef2a811f291b7283',
  RegistrationSIPA:
    '0x81098092c2a870fb7e6279307b64c9f0ab5f0825fe4836220f45fd386897180f',
  OperationExecutor:
    '0x37951947292f98cb2e0d8e7f0ed54cfae10a62185fb2436fe251346ee75b6601',
  PlainWithdrawalExecutor:
    '0x557fd23f0fa02460a25d8aaf0bf6c04e809f799d3defe2fae4ddd084dee51e2a',
}
for (const [name, sourceHash] of Object.entries(SOURCE_HASHES)) {
  assert(
    discovery.getContract(name).sourceHashes?.includes(sourceHash),
    'zk.money source changed, recheck funding and relayer attribution',
    { contract: name },
  )
}

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

const transactionAmountCap = discovery.getContractValueBigInt(
  'OxidePortal',
  'TX_AMOUNT_CAP',
)
const depositLimit = discovery.getContractValueBigInt(
  'OxidePortal',
  'GLOBAL_LIMIT',
)
const depositRate = discovery.getContractValueBigInt('OxidePortal', 'RATE')
const susdsDepositLimit = discovery.getContractValueBigInt(
  'OxidePortal_sUSDS',
  'GLOBAL_LIMIT',
)
const susdsDepositRate = discovery.getContractValueBigInt(
  'OxidePortal_sUSDS',
  'RATE',
)

type ForwardingRow = {
  token: ChainSpecificAddress
  portal: ChainSpecificAddress
  /** [intent, beneficiary fee, sweep tip] */
  intents: [number, string | number, string | number][]
}
const forwardingRows = discovery.getContractValue<ForwardingRow[]>(
  'ForwardingTable',
  'rows',
)
function intentFees(portalAddress: ChainSpecificAddress, intent: number) {
  const row = forwardingRows.find((r) => r.portal === portalAddress)
  const fees = row?.intents.find(([id]) => id === intent)
  assert(fees !== undefined, 'ForwardingTable is missing a reviewed intent', {
    portal: portalAddress,
    intent,
  })
  return { beneficiaryFee: BigInt(fees[1]), sweepTip: BigInt(fees[2]) }
}
const daiDeposit = intentFees(portal.address, 1)
const daiRegistration = intentFees(portal.address, 2)
const susdsDeposit = intentFees(susdsPortal.address, 1)

const descriptionValues = {
  transactionAmountCap: formatToken(transactionAmountCap),
  susdsTransactionAmountCap: formatToken(
    discovery.getContractValueBigInt('OxidePortal_sUSDS', 'TX_AMOUNT_CAP'),
    susdsUnderlying,
  ),
  depositLimit: formatToken(depositLimit),
  depositRefillTime: formatSeconds(Number(depositLimit / depositRate), {
    fullUnit: true,
  }),
  susdsDepositLimit: formatToken(susdsDepositLimit, susdsUnderlying),
  susdsDepositRefillTime: formatSeconds(
    Number(susdsDepositLimit / susdsDepositRate),
    { fullUnit: true },
  ),
  depositFee: formatToken(daiDeposit.beneficiaryFee + daiDeposit.sweepTip),
  registrationSweepFee: formatToken(
    daiRegistration.beneficiaryFee + daiRegistration.sweepTip,
  ),
  susdsDepositFee: formatToken(
    susdsDeposit.beneficiaryFee + susdsDeposit.sweepTip,
    susdsUnderlying,
  ),
  registrationFee: formatToken(
    discovery.getContractValueBigInt(
      'RegistrationController',
      'REGISTRATION_FEE',
    ),
  ),
  withdrawalFee: formatToken(
    discovery.getContractValueBigInt('PlainWithdrawalExecutor', 'FEE'),
  ),
}

const governanceValues = {
  attestationMaxAge: formatSeconds(
    discovery.getContractValue<number>(
      'TeeRegistry',
      'TEE_ATTESTATION_MAX_AGE',
    ),
    { fullUnit: true },
  ),
  teeSignerCount: discovery.getContractValue<ChainSpecificAddress[]>(
    'TeeRegistry',
    'teeSigners',
  ).length,
}

const factory = discovery.getContract('SIPAFactory')
assert(factory.sinceBlock !== undefined, 'SIPAFactory needs sinceBlock')
// Hardcoded in the verified SIPA sources, which the hashes above pin.
const USDC = EthereumAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48')
const USDT = EthereumAddress('0xdAC17F958D2ee523a2206206994597C13D831ec7')
const CURVE_3POOL = EthereumAddress(
  '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7',
)
const underlyingAddress = ChainSpecificAddress.address(
  discovery.getContractValue<ChainSpecificAddress>('OxidePortal', 'UNDERLYING'),
)
// The v6 portal credits the full transferred amount.
const depositLocation: ZkMoneyDepositParams = {
  tokenAddress: underlyingAddress,
  fundingCut: '0',
  factoryAddress: ChainSpecificAddress.address(factory.address),
  depositImplementation: ChainSpecificAddress.address(depositSipa.address),
  registrationImplementation: ChainSpecificAddress.address(
    registrationSipa.address,
  ),
}
const funderTracing: ZkMoneyFundingParams = {
  ...depositLocation,
  fundingTokens: [underlyingAddress, USDC, USDT],
  exchangeAddress: CURVE_3POOL,
  historyFromBlock: factory.sinceBlock,
  migrationExecutors: [
    ChainSpecificAddress.address(
      discovery.getContract('MigrationExecutor').address,
    ),
  ],
  internalEscrowFactories: [
    ChainSpecificAddress.address(
      discovery.getContract('SkyEscrowFactory').address,
    ),
  ],
}
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
        id: `zkmoneyv6-${underlying.symbol}`,
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

export const zkmoneyv6: BaseProject = {
  id: ProjectId('zkmoneyv6'),
  slug: 'zkmoneyv6',
  name: 'zk.money',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2026-10-28')),
  discoveryInfo: getDiscoveryInfo([discovery]),
  // Shared registries deployed for v5 count from the v6 portal deployment.
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
      'zkmoneyv6',
      'detailedDescription',
      descriptionValues,
    ),
    links: {
      websites: ['https://zk.money'],
      documentation: ['https://docs.zk.money/docs'],
      repositories: ['https://github.com/aztec-labs-eng/zkmoney-public'],
      explorers: [
        `https://aztecscan.xyz/contracts/instances/${discovery.getContractValue<string>('OxidePortal', 'L2_TOKEN')}`,
      ],
    },
    badges: [],
  },
  milestones: [
    {
      // OxidePortal deployed 2026-10-26 12:38 UTC, first deposit 16:57 UTC.
      title: 'zk.money moves to Aztec v6',
      url: 'https://etherscan.io/tx/0xb63523f6de8ab744acb279878b8f0bdccd759af3af2adf344479239c4567a0db',
      date: '2026-10-26T00:00:00Z',
      description:
        'New portals on Aztec v6 take their first deposits, and v5 balances migrate into them.',
      type: 'general',
    },
  ],
  escrows: [
    discovery.getEscrowDetails({
      address: portal.address,
      tokens: [underlying.symbol],
    }),
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
    referenceApp: {
      name: 'zk.money Desktop',
      url: 'https://github.com/aztec-labs-eng/zkmoney-public/releases/tag/desktop-v0.8.0',
      since: '2026-10-28',
      version: '0.8.0',
      source: {
        repository: 'https://github.com/aztec-labs-eng/zkmoney-public',
        commit: '8fd198412a956f214639b5782d3a86e3d47ca60e',
      },
      checkedApps: [
        {
          name: 'zk.money web wallet',
          icon: 'zkmoney',
          finding:
            "Runs whatever code Aztec Labs' server sends on each visit, so a changed build could read the user's viewing keys.",
          fix: 'Serve each build under an onchain pin, such as an ENS contenthash, so every code change shows onchain.',
          source: 'https://wallet.zk.money',
          checked: '2026-10-28',
        },
      ],
    },
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
            operationExecutor: ChainSpecificAddress.address(
              discovery.getContract('OperationExecutor').address,
            ),
            feeBeneficiary: ChainSpecificAddress.address(
              discovery.getContractValue<ChainSpecificAddress>(
                'PlainWithdrawalExecutor',
                'BENEFICIARY',
              ),
            ),
          },
        },
      ],
    },
    trackedOn: ['ethereum'],
    scalingProjects: [ProjectId('aztecnetworkv6')],
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
          'Withdrawals and refunds need a live AWS Nitro enclave running the approved image, which is absent from the public downloads.',
      },
    },
    reproducibility: {
      value: 'Partially reproducible',
      sentiment: 'warning',
      description:
        'The Ethereum contracts, the wallet, the enclave software and the circuit sources are public. The refund and resolver verifiers, the L2 contracts and the Desktop app reproduce from them. The approved enclave image and its build files are unpublished.',
    },
    attributes: [
      PRIVACY_ATTRIBUTES.zk,
      PRIVACY_ATTRIBUTES.tee,
      PRIVACY_ATTRIBUTES.transfers,
      PRIVACY_ATTRIBUTES.anyAmount,
    ],
    adversaries: zkMoneyV6Adversaries,
    riskSummary: readProjectMarkdown('zkmoneyv6', 'riskSummary'),
    upgradesAndGovernance: {
      content: readProjectMarkdown(
        'zkmoneyv6',
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
      discovery.getContract('FrozenDepositsRefundVerifier').address,
      discovery.getContract('UnprocessedDepositRefundVerifier').address,
      discovery.getContract('ResolverVerifier').address,
    ],
  },
}
