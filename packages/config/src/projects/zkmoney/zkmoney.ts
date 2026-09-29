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
import { getOssification } from '../../ossification/getOssification'
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
  ossification: getOssification('zkmoney'),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'A private DAI wallet built on Aztec Network by Aztec Labs. The escrow is on Ethereum L1, and every transfer and withdrawal must be co-signed by an AWS Nitro enclave, in addition to the ZK validity proof of the L2.',
    detailedDescription: readProjectMarkdown(
      'zkmoney',
      'detailedDescription',
      descriptionValues,
    ),
    links: {
      websites: ['https://zk.money'],
      documentation: ['https://docs.zk.money/docs'],
      // TODO: both repositories are private until launch.
      repositories: [
        'https://github.com/aztec-labs-eng/oxide',
        'https://github.com/aztec-labs-eng/obsidion-wallet',
      ],
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
        'The portal, the zk.money token contract on Aztec and the fee-paying contract have no owner and cannot be upgraded, and the approved enclave image is fixed. Aztec governance can only move the network to a new rollup, which lets anyone freeze the portal into an exit-only mode.',
      walkawayTest: {
        passed: false,
        reason:
          'Every withdrawal and every refund needs a signature from a live enclave running the one approved image. L2BEAT could not rebuild that image from the published source. Even with a reproducible image, exits would still depend on an AWS Nitro TEE, which is not freely available.',
      },
    },
    // TODO: needs a reproducible build of the TEE image that matches the
    // approved PCR0 from published source, and public source verification of
    // the zk.money contracts on Aztec (token, fee-paying contract, broadcaster)
    // on aztecscan.xyz.
    reproducibility: {
      value: 'Partially reproducible',
      sentiment: 'warning',
      description:
        'The contracts, circuits, enclave, wallet and desktop app are open source, and L2BEAT matched the deployed zk.money token contract on Aztec L2 to its source. The approved enclave image could not be rebuilt from the published source, so it cannot be checked that the enclaves run the published code.',
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
