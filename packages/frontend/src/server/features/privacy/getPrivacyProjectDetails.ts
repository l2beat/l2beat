import type {
  Milestone,
  PrivacyAttribute,
  PrivacyCategory,
  PrivacyExitWindow,
  PrivacySummaryValue,
  ProjectContracts,
  ProjectDiscoveryUpdate,
  ProjectDisplay,
  ProjectGarden,
  ProjectPermissions,
  ProjectPrivacyAdversaries,
  ProjectPrivacyReferenceApp,
  ProjectPrivacyToken,
  ProjectStatuses,
  ProjectUpgradesAndGovernance,
  ProjectZkCatalogInfo,
} from '@l2beat/config'
import type {
  PrivacyFlowBucketTotalRecord,
  PrivacyFlowDailyRecord,
  TokenValueRecord,
} from '@l2beat/database'
import { getPrivacyAnonymitySetSources } from '@l2beat/shared'
import type { OssificationHistory } from '@l2beat/shared/frontend'
import type { ProjectId } from '@l2beat/shared-pure'
import { assertUnreachable, UnixTime } from '@l2beat/shared-pure'
import type { ProjectIconListItem } from '~/components/ProjectIconList'
import { env } from '~/env'
import { getDb } from '~/server/database'
import {
  getProjectOssification,
  type ProjectOssificationView,
} from '~/server/features/projects/ossification/getProjectOssification'
import { ps } from '~/server/projects'
import { getLogger } from '~/server/utils/logger'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import { PROJECT_PAGE_METADATA_FIELDS } from '~/utils/project/getProjectUrl'
import { TOKEN_PLACEHOLDER_ICON_URL } from '~/utils/tokenPlaceholderIconUrl'
import type { PrivacyAnonymitySetType } from './anonymity-set/getPrivacyAnonymitySetSeries'
import { getPrivacyProject } from './getPrivacyProjects'
import type {
  PrivacyAsset,
  PrivacyBucket,
  PrivacyProject,
  PrivacyRelayerStat,
} from './types'
import { getPrivacyBucketTvls } from './utils/getPrivacyBucketTvls'
import {
  getPrivacyChainLinks,
  getPrivacyDeployedOnChains,
  type PrivacyChainLink,
} from './utils/getPrivacyTrackedChains'
import { resolvePrivacyChain } from './utils/resolvePrivacyChain'

interface PrivacyProjectFlowData {
  totals: PrivacyFlowBucketTotalRecord[]
  daily30d: PrivacyFlowDailyRecord[]
  tokenValues: TokenValueRecord[]
  /** Value of each bucket's pool at its asset's latest TVL, by bucket id. */
  bucketTvls: Map<string, number>
}

export interface PrivacyProjectDetails {
  id: ProjectId
  slug: string
  name: string
  shortName?: string
  archivedAt?: UnixTime
  display: ProjectDisplay
  contracts?: ProjectContracts
  permissions?: Record<string, ProjectPermissions>
  discoveryUpdates?: ProjectDiscoveryUpdate[]
  ossification?: ProjectOssificationView
  statuses: ProjectStatuses
  zkCatalogInfo?: ProjectZkCatalogInfo
  garden?: ProjectGarden
  /** Picks which `garden` verdict applies, see `ProjectGarden`. */
  ossificationHistory?: OssificationHistory
  trustedSetups: ProjectZkCatalogInfo['trustedSetups']
  category: PrivacyCategory
  exitWindow: PrivacyExitWindow
  adversaries: ProjectPrivacyAdversaries
  referenceApp?: ProjectPrivacyReferenceApp
  reproducibility: PrivacySummaryValue
  anonymitySetType: PrivacyAnonymitySetType | undefined
  hasTvl: boolean
  detailedDescription?: string
  riskSummary?: string
  upgradesAndGovernance?: ProjectUpgradesAndGovernance
  attributes: PrivacyAttribute[]
  milestones: Milestone[]
  /** The tracked chain the page describes. */
  chain: string
  /** Its name, for the "on <Chain>" lines of a project tracked on several chains. */
  chainName: string
  /** Whether the project is tracked on more than one chain. */
  isMultiChain: boolean
  /** The tracked chains, as links to the page on each, in config order. */
  chains: PrivacyChainLink[]
  /** Every chain with a deployment; the untracked ones are dimmed. */
  deployedOn: ProjectIconListItem[]
  assets: PrivacyAsset[]
  summary: {
    bucketCount: number
    deposits: {
      total: number
      last7d: number
      change7d: number
      last30d: number
    }
    depositedValueUsd: {
      total: number
      last7d: number
      last30d: number
    }
    relayerStat?: PrivacyRelayerStat
    /**
     * The value of the escrows on the selected chain, for projects tracked
     * on several chains. Single-chain projects use the TVS breakdown.
     */
    chainTvl?: {
      totalValueLockedUsd: number | undefined
      totalValueLockedChange7d: number | undefined
    }
  }
}

export async function getPrivacyProjectDetails(
  slug: string,
  requestedChain?: string,
): Promise<PrivacyProjectDetails | undefined> {
  const project = await getPrivacyProject(slug)
  if (!project) {
    return undefined
  }

  const projectId = project.id
  const trackedOn = project.privacyInfo.trackedOn
  const chain = resolvePrivacyChain(trackedOn, requestedChain)
  const isMultiChain = trackedOn.length > 1
  // Every number and section of the page is for the selected chain.
  const tokens = project.privacyInfo.tokens.filter(
    (token) => token.token.chain === chain,
  )

  const now = UnixTime.now()
  const currentDay = UnixTime.toStartOf(now, 'day')
  const last7dCutoff = currentDay - 7 * UnixTime.DAY
  const last30dCutoff = currentDay - 30 * UnixTime.DAY

  const [
    { totals, daily30d, tokenValues, bucketTvls },
    relayerStat,
    chainTvl,
    chainProjects,
    ossification,
  ] = await Promise.all([
    getPrivacyProjectFlowData(
      project,
      tokens,
      chain,
      last30dCutoff,
      currentDay,
      now,
    ),
    getRelayerStat(project, chain, UnixTime(now - 30 * UnixTime.DAY), now),
    isMultiChain ? getChainTvl(projectId, chain, now) : undefined,
    getChainProjects(),
    getProjectOssification(project),
  ])
  const chains = getPrivacyChainLinks(trackedOn, project.slug, chainProjects)
  const chainName = chains.find((c) => c.id === chain)?.name ?? chain

  const tvlBySymbol = new Map<string, number>()
  for (const tv of tokenValues) {
    const tvlToken = project.tvsConfig?.find(
      (t: { id: string; symbol: string }) => t.id === tv.tokenId,
    )
    if (tvlToken) {
      const existing = tvlBySymbol.get(tvlToken.symbol) ?? 0
      tvlBySymbol.set(tvlToken.symbol, existing + tv.valueForProject)
    }
  }
  const totalIndex = new Map<string, PrivacyFlowBucketTotalRecord>()
  for (const total of totals) {
    totalIndex.set(`${total.projectId}::${total.bucketId}`, total)
  }

  const daily30dIndex = new Map<string, PrivacyFlowDailyRecord>()
  const daily7dIndex = new Map<string, PrivacyFlowDailyRecord>()
  for (const row of daily30d) {
    const key = `${row.projectId}::${row.bucketId}`
    const base = {
      projectId: row.projectId,
      bucketId: row.bucketId,
      timestamp: row.timestamp,
      depositCount: 0,
      withdrawalCount: 0,
      depositAmount: 0n,
      withdrawalAmount: 0n,
      depositValueUsd: 0,
      withdrawalValueUsd: 0,
    }

    const existing30d = daily30dIndex.get(key) ?? { ...base }
    existing30d.depositCount += row.depositCount
    existing30d.withdrawalCount += row.withdrawalCount
    existing30d.depositAmount += row.depositAmount
    existing30d.withdrawalAmount += row.withdrawalAmount
    existing30d.depositValueUsd += row.depositValueUsd
    existing30d.withdrawalValueUsd += row.withdrawalValueUsd
    daily30dIndex.set(key, existing30d)

    if (row.timestamp >= last7dCutoff) {
      const existing7d = daily7dIndex.get(key) ?? { ...base }
      existing7d.depositCount += row.depositCount
      existing7d.withdrawalCount += row.withdrawalCount
      existing7d.depositAmount += row.depositAmount
      existing7d.withdrawalAmount += row.withdrawalAmount
      existing7d.depositValueUsd += row.depositValueUsd
      existing7d.withdrawalValueUsd += row.withdrawalValueUsd
      daily7dIndex.set(key, existing7d)
    }
  }

  const assets = tokens.map((token) => {
    const symbol = token.token.symbol
    // Token values carry no chain, so a multi-chain asset is valued from the
    // escrows of its buckets on the selected chain.
    const bucketValues = token.buckets.flatMap(
      (bucket) => bucketTvls.get(bucket.id) ?? [],
    )
    const assetTvl = isMultiChain
      ? bucketValues.length > 0
        ? bucketValues.reduce((sum, value) => sum + value, 0)
        : null
      : (tvlBySymbol.get(symbol) ?? null)

    let assetDepositsTotal = 0
    let assetDeposits7d = 0
    let assetDeposits30d = 0
    let assetValueTotal = 0
    let assetValue7d = 0
    let assetValue30d = 0

    const buckets = token.buckets.map((bucket) => {
      const key = `${projectId}::${bucket.id}`
      const total = totalIndex.get(key)
      const daily7d = daily7dIndex.get(key)
      const daily30d = daily30dIndex.get(key)

      const depositCountTotal = total?.depositCount ?? 0
      const depositCount7d = daily7d?.depositCount ?? 0
      const depositCount30d = daily30d?.depositCount ?? 0
      const depositValueTotal = total?.depositValueUsd ?? 0
      const depositValue7d = daily7d?.depositValueUsd ?? 0
      const depositValue30d = daily30d?.depositValueUsd ?? 0

      assetDepositsTotal += depositCountTotal
      assetDeposits7d += depositCount7d
      assetDeposits30d += depositCount30d
      assetValueTotal += depositValueTotal
      assetValue7d += depositValue7d
      assetValue30d += depositValue30d

      return {
        id: bucket.id,
        label: bucket.label,
        type: bucket.type,
        denomination: bucket.denomination,
        totalAmount: null,
        totalValueUsd: bucketTvls.get(bucket.id) ?? null,
        deposits: {
          total: depositCountTotal,
          last7d: depositCount7d,
          last30d: depositCount30d,
        },
        depositedValueUsd: {
          total: depositValueTotal,
          last7d: depositValue7d,
          last30d: depositValue30d,
        },
      } satisfies PrivacyBucket
    })

    return {
      symbol,
      iconUrl: token.token.iconUrl ?? TOKEN_PLACEHOLDER_ICON_URL,
      address: token.token.address,
      decimals: token.token.decimals,
      bucketCount: buckets.length,
      totalAmount: 0,
      totalValueUsd: assetTvl,
      deposits: {
        total: assetDepositsTotal,
        last7d: assetDeposits7d,
        last30d: assetDeposits30d,
      },
      depositedValueUsd: {
        total: assetValueTotal,
        last7d: assetValue7d,
        last30d: assetValue30d,
      },
      buckets: buckets.sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { numeric: true }),
      ),
    } satisfies PrivacyAsset
  })

  const orderedAssets = assets.sort((a, b) => {
    const valueDelta = (b.totalValueUsd ?? 0) - (a.totalValueUsd ?? 0)
    if (valueDelta !== 0) return valueDelta
    return a.symbol.localeCompare(b.symbol, undefined, { numeric: true })
  })

  let summaryBucketCount = 0
  let summaryDepositsTotal = 0
  let summaryDeposits7d = 0
  let summaryDeposits30d = 0
  let summaryValueTotal = 0
  let summaryValue7d = 0
  let summaryValue30d = 0

  for (const asset of orderedAssets) {
    summaryBucketCount += asset.bucketCount
    summaryDepositsTotal += asset.deposits.total
    summaryDeposits7d += asset.deposits.last7d
    summaryDeposits30d += asset.deposits.last30d
    summaryValueTotal += asset.depositedValueUsd.total
    summaryValue7d += asset.depositedValueUsd.last7d
    summaryValue30d += asset.depositedValueUsd.last30d
  }

  return {
    id: project.id,
    slug: project.slug,
    name: project.name,
    shortName: project.shortName,
    archivedAt: project.archivedAt,
    display: project.display,
    contracts: project.contracts && {
      ...project.contracts,
      addresses: pickChain(project.contracts.addresses, chain),
    },
    permissions: project.permissions && pickChain(project.permissions, chain),
    discoveryUpdates: project.discoveryUpdates,
    ossification,
    statuses: project.statuses,
    zkCatalogInfo: project.zkCatalogInfo,
    garden: project.garden,
    ossificationHistory: project.ossificationHistory,
    trustedSetups: project.trustedSetups,
    category: project.privacyInfo.category,
    exitWindow: project.privacyInfo.exitWindow,
    adversaries: project.privacyInfo.adversaries,
    referenceApp: project.privacyInfo.referenceApp,
    reproducibility: project.privacyInfo.reproducibility,
    anonymitySetType: getChainAnonymitySetType(project, chain),
    hasTvl:
      project.tvsConfig !== undefined && (!isMultiChain || tokens.length > 0),
    detailedDescription:
      project.privacyInfo.detailedDescription ??
      project.display.detailedDescription,
    riskSummary: project.privacyInfo.riskSummary,
    upgradesAndGovernance: project.privacyInfo.upgradesAndGovernance,
    attributes: project.privacyInfo.attributes ?? [],
    milestones: [...(project.milestones ?? [])].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    ),
    chain,
    chainName,
    isMultiChain,
    chains,
    deployedOn: getPrivacyDeployedOnChains(
      project.privacyInfo.deployedOn,
      trackedOn,
      chainProjects,
    ),
    assets: orderedAssets,
    summary: {
      bucketCount: summaryBucketCount,
      deposits: {
        total: summaryDepositsTotal,
        last7d: summaryDeposits7d,
        change7d: calculatePercentageChange(
          summaryDeposits7d,
          daily30d
            .filter(
              (row) =>
                row.timestamp >= last7dCutoff - 7 * UnixTime.DAY &&
                row.timestamp < last7dCutoff,
            )
            .reduce((sum, row) => sum + row.depositCount, 0),
        ),
        last30d: summaryDeposits30d,
      },
      depositedValueUsd: {
        total: summaryValueTotal,
        last7d: summaryValue7d,
        last30d: summaryValue30d,
      },
      relayerStat,
      chainTvl,
    },
  }
}

function getChainProjects() {
  return ps.getProjects({
    select: ['chainConfig'],
    optional: [...PROJECT_PAGE_METADATA_FIELDS],
  })
}

/** The entries of one chain, keyed as the contracts and permissions are. */
function pickChain<T>(
  byChain: Record<string, T>,
  chain: string,
): Record<string, T> {
  const entry = byChain[chain]
  return entry === undefined ? {} : { [chain]: entry }
}

/** Like getPrivacyAnonymitySetType, from the sources on one chain. */
function getChainAnonymitySetType(
  project: PrivacyProject,
  chain: string,
): PrivacyAnonymitySetType | undefined {
  const sources = getPrivacyAnonymitySetSources(project.privacyInfo).filter(
    (source) => source.chain === chain,
  )
  if (sources.some((source) => source.type === 'key-registrations')) {
    return 'key-registrations'
  }
  return sources.length > 0 ? 'deposits' : undefined
}

/**
 * The latest escrow value on the chain and its change over seven days, from
 * the daily escrow values the TVS backend stores.
 */
async function getChainTvl(
  projectId: ProjectId,
  chain: string,
  now: UnixTime,
): Promise<PrivacyProjectDetails['summary']['chainTvl']> {
  if (env.MOCK) {
    const value = Math.random() * 10_000_000
    return { totalValueLockedUsd: value, totalValueLockedChange7d: 0.05 }
  }
  const rows = await getDb()
    .tvsEscrowValue.getDailyValueByProjectAndChain(
      projectId,
      chain,
      UnixTime(now - 8 * UnixTime.DAY),
      UnixTime(now + 1),
    )
    .catch((error) => {
      getLogger()
        .for('getPrivacyProjectDetails')
        .warn('Chain escrow values unavailable', { projectId, chain, error })
      return []
    })
  const latest = rows.at(-1)
  if (!latest) {
    return {
      totalValueLockedUsd: undefined,
      totalValueLockedChange7d: undefined,
    }
  }
  const weekAgo = rows
    .filter((row) => row.timestamp <= latest.timestamp - 7 * UnixTime.DAY)
    .at(-1)
  return {
    totalValueLockedUsd: latest.value,
    totalValueLockedChange7d:
      weekAgo === undefined
        ? undefined
        : calculatePercentageChange(latest.value, weekAgo.value),
  }
}

const MIN_OBSERVED_DAYS_FOR_AVERAGE = 7

async function getRelayerStat(
  project: PrivacyProject,
  chain: string,
  from: UnixTime,
  to: UnixTime,
): Promise<PrivacyRelayerStat | undefined> {
  const tracking = project.privacyInfo.relayerTracking
  if (!tracking) {
    return undefined
  }

  if (env.MOCK) {
    switch (tracking.type) {
      case 'onchainEvents':
        return {
          kind: 'activeRelayers',
          value: Math.round(Math.random() * 20),
        }
      case 'railgunWaku':
        return {
          kind: 'avgDailyRelayers',
          value: Math.round(Math.random() * 20),
        }
      default:
        assertUnreachable(tracking)
    }
  }

  switch (tracking.type) {
    case 'onchainEvents': {
      const count = await getDb().privacyRelayerActivity.getActiveRelayerCount(
        project.id,
        from,
        to,
        chain,
      )
      return { kind: 'activeRelayers', value: count }
    }
    case 'railgunWaku': {
      const result = await getDb().privacyRelayerSample.getAverageRelayerCount(
        project.id,
        from,
        to,
        chain,
      )
      if (
        result === undefined ||
        result.observedDays < MIN_OBSERVED_DAYS_FOR_AVERAGE
      ) {
        return undefined
      }
      return { kind: 'avgDailyRelayers', value: Math.round(result.average) }
    }
    default:
      assertUnreachable(tracking)
  }
}

async function getPrivacyProjectFlowData(
  project: PrivacyProject,
  tokens: ProjectPrivacyToken[],
  chain: string,
  from: UnixTime,
  to: UnixTime,
  now: UnixTime,
): Promise<PrivacyProjectFlowData> {
  const projectId = project.id

  if (env.MOCK) {
    return getMockPrivacyProjectFlowData(project, tokens, from, to)
  }

  const db = getDb()
  const [totals, daily30d, tokenValues] = await Promise.all([
    db.privacyFlowEvent.getBucketTotalsByProjectIds([projectId], chain),
    db.privacyFlowEvent.getDailyByProjectIds([projectId], from, to, chain),
    db.tvsTokenValue.getLastNonZeroValue(now, projectId),
  ])
  const escrowValues = await db.tvsEscrowValue
    .getByProjectAt(projectId, [
      ...new Set(tokenValues.map((value) => value.timestamp)),
    ])
    .catch((error) => {
      // Bucket values are optional, so the page still renders when they
      // can't be read, e.g. before the backend has created their table.
      getLogger()
        .for('getPrivacyProjectDetails')
        .warn('Escrow values unavailable', { projectId, error })
      return []
    })
  const bucketTvls = getPrivacyBucketTvls(
    tokens,
    project.tvsConfig ?? [],
    tokenValues,
    escrowValues,
  )
  return { totals, daily30d, tokenValues, bucketTvls }
}

function getMockPrivacyProjectFlowData(
  project: PrivacyProject,
  tokens: ProjectPrivacyToken[],
  from: UnixTime,
  to: UnixTime,
): PrivacyProjectFlowData {
  const projectId = project.id
  const bucketIds = tokens.flatMap((token) =>
    token.buckets.map((bucket) => bucket.id),
  )
  const tokenIds = (project.tvsConfig ?? []).map((token) => token.id)

  const totals = bucketIds.map(
    (bucketId): PrivacyFlowBucketTotalRecord => ({
      projectId,
      bucketId,
      depositCount: Math.round(Math.random() * 5000),
      withdrawalCount: Math.round(Math.random() * 5000),
      depositAmount: 0n,
      withdrawalAmount: 0n,
      depositValueUsd: Math.random() * 10_000_000,
      withdrawalValueUsd: Math.random() * 10_000_000,
    }),
  )

  const daily30d: PrivacyFlowDailyRecord[] = []
  for (let timestamp = from; timestamp <= to; timestamp += UnixTime.DAY) {
    for (const bucketId of bucketIds) {
      daily30d.push({
        projectId,
        bucketId,
        timestamp: UnixTime(timestamp),
        depositCount: Math.round(Math.random() * 100),
        withdrawalCount: Math.round(Math.random() * 100),
        depositAmount: 0n,
        withdrawalAmount: 0n,
        depositValueUsd: Math.random() * 100_000,
        withdrawalValueUsd: Math.random() * 100_000,
      })
    }
  }

  const tokenValues = tokenIds.map(
    (tokenId): TokenValueRecord => ({
      timestamp: to,
      configurationId: tokenId,
      projectId,
      tokenId,
      amount: 0,
      value: 0,
      valueForProject: Math.random() * 5_000_000,
      valueForSummary: 0,
      priceUsd: 0,
    }),
  )

  const bucketTvls = new Map(
    bucketIds.map((bucketId) => [bucketId, Math.random() * 1_000_000]),
  )

  return { totals, daily30d, tokenValues, bucketTvls }
}
