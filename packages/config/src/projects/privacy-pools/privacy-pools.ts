import {
  assert,
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { formatBasisPoints } from '../../common/formatBasisPoints'
import { PRIVACY_ANONYMITY_SET_MINIMUM_AMOUNTS } from '../../common/privacyAnonymitySets'
import { PRIVACY_ATTRIBUTES } from '../../common/privacyAttributes'
import { PRIVACY_CATEGORIES } from '../../common/privacyCategories'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { generateDiscoveryDrivenContracts } from '../../templates/generateDiscoveryDrivenSections'
import { getDiscoveryInfo } from '../../templates/getDiscoveryInfo'
import { getTokenByAddress } from '../../tokens/getTokenByAddress'
import type { BaseProject, ProjectPrivacyToken } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'
import { privacyPoolsAdversaries } from './adversaries'

const discovery = new ProjectDiscovery('privacy-pools')

const PRIVACY_POOLS_DEPOSIT_EVENT =
  '0xe3b53cd1a44fbf11535e145d80b8ef1ed6d57a73bf5daa7e939b6b01657d6549'
const PRIVACY_POOLS_WITHDRAWAL_EVENT =
  '0x75e161b3e824b114fc1a33274bd7091918dd4e639cede50b78b15a4eea956a21'

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
  minimumAmounts?: string[]
  depositEvent: string
  withdrawalEvent: string
}

const BUCKETS = getPrivacyPoolBuckets()
const ENTRYPOINT = discovery.getContract('PrivacyPoolsEntrypoint')
assert(
  ENTRYPOINT.sinceTimestamp !== undefined,
  'PrivacyPoolsEntrypoint must have a sinceTimestamp',
)
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
  addedAt: UnixTime.fromDate(new Date('2026-05-12')),
  discoveryInfo: getDiscoveryInfo([discovery]),
  ossificationHistory: discovery.getOssificationHistory(),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'A privacy pool system for any amount, where only centrally approved deposits can be withdrawn privately.',
    detailedDescription: readProjectMarkdown(
      'privacy-pools',
      'detailedDescription',
      { multisigStats, feeSummary },
    ),
    links: {
      websites: ['https://privacypools.com'],
      documentation: ['https://docs.privacypools.com'],
      repositories: [
        'https://github.com/0xbow-io/privacy-pools-core',
        'https://github.com/0xbow-io/privacy-pools-website',
      ],
    },
    badges: [],
  },
  milestones: [
    // Both incidents fall on the day 0xbow fixed a key-entropy bug in its v1
    // SDK (bounty to z0r0zzz on @0xprivacypools, fix in website v2.12.0 on
    // 2026-03-19). 0xbow has not explained either root, so the texts stay
    // factual. Evidence in l2beat-notes privacy-pools.md, 2026-03-11 section.
    {
      // Root 933, 21:26 UTC: the first real root after the halt drops all 66
      // approved fxUSD labels (IPFS trees of roots 931 and 933). Root 1022 on
      // 2026-03-24 restores all 66. Four of those depositors ragequit in
      // between. No fxUSD incident at f(x) Protocol found.
      title: 'ASP revokes every fxUSD approval',
      url: 'https://etherscan.io/tx/0xd67628764f6ba49ef61e8e16b9aa3b3e4143b5daea4e37e914594c152f6120cb',
      date: '2026-03-11T00:00:00Z',
      description:
        'Approved fxUSD deposits leave the list for 13 days, with public ragequit as the only exit.',
      type: 'incident',
    },
    {
      // Root 932, 19:10 UTC: the postman EOA posts root 1 with the IPFS CID
      // "eEEee…", which no label can prove against. Fast Relay relayed every
      // few minutes before, then nothing until 22:17. Website v2.11.0 adds a
      // maintenance banner at 20:04 UTC: "Withdrawals may be limited. Exit
      // remains available at all times." (commit 26db9f7).
      title: 'ASP halts all private withdrawals',
      url: 'https://etherscan.io/tx/0x4fbb5ecd0d2436b89756ddb584d31de6b71eaf743f71d09605bba3dff36adac0',
      date: '2026-03-11T00:00:00Z',
      description:
        'The ASP posts a root no deposit belongs to, blocking every private withdrawal for two hours.',
      type: 'incident',
    },
  ],
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
    category: PRIVACY_CATEGORIES.pool,
    trackedOn: ['ethereum'],
    tokens: getPrivacyTokens(),
    relayerTracking: {
      type: 'onchainEvents',
      sources: [
        {
          address: ENTRYPOINT.address,
          sinceTimestamp: UnixTime(ENTRYPOINT.sinceTimestamp),
          extractor: 'privacyPoolsWithdrawalRelayed',
        },
      ],
    },
    exitWindow: {
      value: 'Infinite',
      sentiment: 'good',
      orderHint: Number.MAX_SAFE_INTEGER,
      description:
        'The depositing address can always ragequit its funds from the immutable pools, without the Entrypoint or the ASP. A ragequit is public.',
      walkawayTest: {
        passed: false,
        reason:
          'Private withdrawals need the ASP to approve each deposit and keep posting roots.',
      },
    },
    reproducibility: {
      value: 'Reproducible',
      sentiment: 'good',
      description:
        'The contracts, circuits, SDK, relayer and website are open source and build locally. The ASP service is closed.',
    },
    attributes: [PRIVACY_ATTRIBUTES.zk, PRIVACY_ATTRIBUTES.anyAmount],
    adversaries: privacyPoolsAdversaries,
    riskSummary: readProjectMarkdown('privacy-pools', 'riskSummary'),
    upgradesAndGovernance: {
      content: readProjectMarkdown('privacy-pools', 'upgradesAndGovernance', {
        multisigStats,
      }),
    },
  },
  permissions: discovery.getDiscoveredPermissions(),
  contracts: {
    addresses: generateDiscoveryDrivenContracts([discovery]),
    risks: [],
    zkVerifiers: [
      discovery.getContract('WithdrawalVerifier').address,
      discovery.getContract('RagequitVerifier').address,
    ],
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
      anonymitySet:
        bucket.minimumAmounts === undefined
          ? undefined
          : { minimumAmounts: bucket.minimumAmounts },
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
      minimumAmounts: PRIVACY_ANONYMITY_SET_MINIMUM_AMOUNTS[resolved.symbol],
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
