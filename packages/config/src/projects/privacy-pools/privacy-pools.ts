import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { getTokenByAddress } from '../../tokens/getTokenByAddress'
import type { BaseProject, ProjectPrivacyToken } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

const discovery = new ProjectDiscovery('privacy-pools')

const PRIVACY_POOLS_DEPOSIT_EVENT =
  '0xe3b53cd1a44fbf11535e145d80b8ef1ed6d57a73bf5daa7e939b6b01657d6549'
const PRIVACY_POOLS_WITHDRAWAL_EVENT =
  '0x75e161b3e824b114fc1a33274bd7091918dd4e639cede50b78b15a4eea956a21'

function formatBasisPoints(value: number): string {
  return `${Number((value / 100).toFixed(4))}%`
}

interface PrivacyPoolsAssetConfig {
  minimumDepositAmount: string | number
  vettingFeeBPS: number
  maxRelayFeeBPS: number
}

interface PrivacyPoolBucket {
  id: string
  address: ChainSpecificAddress
  tokenAddress: EthereumAddress
  tokenInfo: {
    symbol: string
    decimals: number
    priceId: string
    iconUrl: string | undefined
  }
  sinceTimestamp: UnixTime
  feeConfig: PrivacyPoolsAssetConfig
  depositEvent: string
  withdrawalEvent: string
}

const BUCKETS = getPrivacyPoolBuckets()
const PRIVACY_POOLS_SINCE_TIMESTAMP = UnixTime(
  Math.min(...BUCKETS.map((bucket) => bucket.sinceTimestamp)),
)

const multisigStats = discovery.getMultisigStats('Privacy Pools Multisig')
const feeSummary = formatPrivacyPoolsFeeSummary()

export const privacyPools: BaseProject = {
  id: ProjectId('privacy-pools'),
  slug: 'privacy-pools',
  name: 'Privacy Pools',
  shortName: undefined,
  addedAt: UnixTime(0),
  discoveryInfo: getDiscoveryInfo([discovery]),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'A selective-disclosure privacy system for Ethereum that adds compliance-aware association sets.',
    detailedDescription: readProjectMarkdown(
      'privacy-pools',
      'detailedDescription',
      { multisigStats, feeSummary },
    ),
    links: {
      websites: ['https://privacypools.com'],
    },
    badges: [],
  },
  escrows: BUCKETS.map((bucket) => ({
    address: ChainSpecificAddress.address(bucket.address),
    chain: ChainSpecificAddress.longChain(bucket.address),
    sinceTimestamp: bucket.sinceTimestamp,
    tokens: [bucket.tokenInfo.symbol],
  })),
  tvsInfo: {
    associatedTokens: [],
    warnings: [],
  },
  zkCatalogInfo: {
    creator: '0xbow',
    techStack: {
      zkVM: [ZK_CATALOG_TAGS.curve.BN254, ZK_CATALOG_TAGS.Groth16.Snarkjs],
    },
    proofSystemInfo: '',
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        ...TRUSTED_SETUPS.PrivacyPools,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('privacy-pools'),
        sinceTimestamp: PRIVACY_POOLS_SINCE_TIMESTAMP,
      },
    ],
    verifierHashes: [
      {
        hash: 'Privacy Pools Withdrawal and Ragequit verifiers 03.07.2026',
        name: 'Privacy Pools verifiers v1.2.1',
        sourceLink:
          'https://github.com/0xbow-io/privacy-pools-core/tree/v1.2.1/packages/circuits',
        proofSystem: ZK_CATALOG_TAGS.Groth16.Snarkjs,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0xa45ACa8604a73D80C551fAad6355A5c3A5565eC6',
            ),
          },
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x022891F938Ae7fDC8Ab9Ead0FBf50aBA8C897D6d',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: readProjectMarkdown(
          'privacy-pools',
          'verificationSteps-03.07.2026',
        ),
      },
    ],
  },
  privacyInfo: {
    tokens: getPrivacyTokens(),
    relayers: {
      active30d: 4,
      tooltip:
        'Addresses that appear as relayers in WithdrawalRelayed event on the Privacy Pools entrypoint.',
    },
    exitWindow: {
      value: 'Infinite',
      sentiment: 'good',
      orderHint: Number.MAX_SAFE_INTEGER,
      description:
        'Even if the Entrypoint or ASP turns malicious, users can always ragequit (withdraw tokens) from the immutable pool contracts, at the cost of losing privacy.',
      walkawayTest: {
        passed: false,
        reason:
          'Association Set Providers must explicitly approve deposited funds before private withdrawals.',
      },
    },
    reproducibility: {
      value: 'Reproducible',
      sentiment: 'good',
      description:
        'The contracts, circuits, and supporting software needed to participate in Privacy Pools are publicly available and can be run locally.',
    },
    privacy: {
      value: 'Compliance gated',
      sentiment: 'good',
      description:
        'Compliance is enforced through centralized association set providers, which can refuse deposits into the pool, sending them back to the sender.',
    },
    attributes: [PRIVACY_ATTRIBUTES.zk, PRIVACY_ATTRIBUTES.anyAmount],
    riskSummary: readProjectMarkdown('privacy-pools', 'riskSummary'),
    upgradesAndGovernance: readProjectMarkdown(
      'privacy-pools',
      'upgradesAndGovernance',
      { multisigStats },
    ),
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
  },
}

function getPrivacyTokens(): ProjectPrivacyToken[] {
  const grouped = new Map<string, ProjectPrivacyToken>()

  for (const bucket of BUCKETS) {
    let token = grouped.get(bucket.tokenInfo.symbol)
    if (!token) {
      token = {
        token: {
          address: bucket.tokenAddress,
          iconUrl: bucket.tokenInfo.iconUrl,
          symbol: bucket.tokenInfo.symbol,
          decimals: bucket.tokenInfo.decimals,
          priceId: bucket.tokenInfo.priceId,
          sinceTimestamp: bucket.sinceTimestamp,
        },
        buckets: [],
      }
      grouped.set(bucket.tokenInfo.symbol, token)
    }

    token.token.sinceTimestamp = UnixTime(
      Math.min(
        token.token.sinceTimestamp ?? Number.MAX_SAFE_INTEGER,
        bucket.sinceTimestamp,
      ),
    )

    token.buckets.push({
      id: bucket.id,
      type: 'pool',
      label: `${bucket.tokenInfo.symbol} pool`,
      address: bucket.address,
      sinceTimestamp: bucket.sinceTimestamp,
      deposit: {
        event: bucket.depositEvent,
        extractor: 'privacyPoolsValue',
        params: {},
      },
      withdrawal: {
        event: bucket.withdrawalEvent,
        extractor: 'privacyPoolsValue',
        params: {},
      },
    })
  }

  return Array.from(grouped.values()).sort((a, b) =>
    a.token.symbol.localeCompare(b.token.symbol, undefined, {
      numeric: true,
    }),
  )
}

function getPrivacyPoolBuckets(): PrivacyPoolBucket[] {
  const pools = discovery
    .getContracts()
    .filter((entry) => entry.template?.startsWith('privacy-pools/PrivacyPool'))

  return pools.map((pool) => {
    const asset = pool.values?.ASSET?.toString()
    const isNativeEth =
      asset === 'eth:0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

    const tokenAddress = isNativeEth
      ? EthereumAddress('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
      : EthereumAddress(
          ChainSpecificAddress.address(asset as ChainSpecificAddress),
        )
    const resolved = getTokenByAddress(tokenAddress.toString())
    assert(resolved, `Unknown asset ${asset}`)
    const feeConfig = pool.values
      ?.assetConfigFromEntrypoint as unknown as PrivacyPoolsAssetConfig
    assert(feeConfig, `Missing fee config for ${pool.name}`)

    return {
      id: `privacy-pools-${resolved.symbol}`,
      address: pool.address,
      tokenAddress,
      tokenInfo: {
        symbol: resolved.symbol,
        decimals: resolved.decimals,
        priceId: resolved.coingeckoId,
        iconUrl: resolved.iconUrl,
      },
      sinceTimestamp: UnixTime(pool.sinceTimestamp ?? 0),
      feeConfig,
      depositEvent: PRIVACY_POOLS_DEPOSIT_EVENT,
      withdrawalEvent: PRIVACY_POOLS_WITHDRAWAL_EVENT,
    }
  })
}

function formatPrivacyPoolsFeeSummary(): string {
  const grouped = new Map<string, string[]>()

  for (const bucket of BUCKETS) {
    const key = `${formatBasisPoints(
      bucket.feeConfig.vettingFeeBPS,
    )} vetting fee, ${formatBasisPoints(
      bucket.feeConfig.maxRelayFeeBPS,
    )} maximum relayer fee`
    const symbols = grouped.get(key) ?? []
    symbols.push(bucket.tokenInfo.symbol)
    grouped.set(key, symbols)
  }

  return Array.from(grouped.entries())
    .map(([key, symbols]) => {
      const sortedSymbols = symbols.sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true }),
      )
      return `- ${key}: ${sortedSymbols.join(', ')}.`
    })
    .join('\n')
}
