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
  PrivacyFlowBucketRecord,
  PrivacyFlowBucketTotalRecord,
  TokenValueRecord,
} from '@l2beat/database'
import type { OssificationHistory } from '@l2beat/shared/frontend'
import type { ProjectId } from '@l2beat/shared-pure'
import {
  assert,
  assertUnreachable,
  ChainSpecificAddress,
  UnixTime,
  unique,
} from '@l2beat/shared-pure'
import type { ProjectIconListItem } from '~/components/ProjectIconList'
import type { SectionChain } from '~/components/projects/sections/SectionChainBadge'
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
import {
  getPrivacyAnonymitySetType,
  type PrivacyAnonymitySetType,
} from './anonymity-set/getPrivacyAnonymitySetSeries'
import { getPrivacyProject } from './getPrivacyProjects'
import { getPrivacyChainValues } from './getPrivacyValueLockedChart'
import type {
  PrivacyAsset,
  PrivacyBucket,
  PrivacyProject,
  PrivacyRelayerStat,
} from './types'
import {
  getPrivacyBucketTvls,
  getPrivacySingleEscrowBucketTvls,
} from './utils/getPrivacyBucketTvls'
import { getPrivacyProjectPages } from './utils/getPrivacyProjectPages'
import { getScalingProjectItems } from './utils/getPrivacyScalingLinks'
import { getPrivacyTrackedChains } from './utils/getPrivacyTrackedChains'

interface PrivacyProjectFlowData {
  totals: PrivacyFlowBucketTotalRecord[]
  daily30d: PrivacyFlowBucketRecord[]
  tokenValues: TokenValueRecord[]
  /** Value of each bucket's pool at its asset's latest TVL, by bucket id. */
  bucketTvls: Map<string, number>
}

export interface PrivacyProjectDetails {
  id: ProjectId
  slug: string
  /** This page: the project's, or the project's on the shown chain. */
  path: string
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
  trackedOn: ProjectIconListItem[]
  scalingProjects: ProjectIconListItem[]
  /** Of the shown chain when there is a `chainView`, of the project otherwise. */
  assets: PrivacyAsset[]
  summary: PrivacyStatsSummary
  /**
   * Set when the project is shown one tracked chain at a time. The stats,
   * the assessment, the contracts and the permissions are then that chain's.
   */
  chainView?: PrivacyChainView
}

export interface PrivacyStatsSummary {
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
}

/** A chain of a project that has a page per tracked chain, with that page. */
export interface PrivacyChainTab extends SectionChain {
  href: string
}

export interface PrivacyChainView {
  /** In tab order, which is the project's `trackedOn` order. */
  chains: PrivacyChainTab[]
  selected: PrivacyChainTab
  /** Value locked on the selected chain. */
  totalValueLockedUsd: number | undefined
  totalValueLockedChange7d: number | undefined
  /** The sum of the chains, so their values add up to it. */
  allChainsValueLockedUsd: number | undefined
}

/**
 * @param chain The chain of the page to show, for a project with a page per
 *   tracked chain. Its first page is shown when this is not one of its chains.
 */
export async function getPrivacyProjectDetails(
  slug: string,
  chain?: string,
): Promise<PrivacyProjectDetails | undefined> {
  const project = await getPrivacyProject(slug)
  if (!project) {
    return undefined
  }

  const projectId = project.id

  const now = UnixTime.now()
  const currentDay = UnixTime.toStartOf(now, 'day')
  const last7dCutoff = currentDay - 7 * UnixTime.DAY
  const last30dCutoff = currentDay - 30 * UnixTime.DAY

  const { trackedOn, chainProjects } = await getTrackedOn(project)
  const tokens = project.privacyInfo.tokens
  const pages = getPrivacyProjectPages(project)
  const page = pages.find((p) => p.chain === chain) ?? pages[0]
  assert(page, 'Privacy project without a page')
  // On a chain's page: its buckets, its key registry and its assessment.
  const shown = page.project
  const tabs = pages.flatMap((p): PrivacyChainTab[] => {
    const item = trackedOn.find((c) => c.id === p.chain)
    return item
      ? [{ id: item.id, name: item.name, iconUrl: item.iconUrl, href: p.path }]
      : []
  })
  const selected = tabs.find((tab) => tab.id === page.chain)

  const [
    { totals, daily30d, tokenValues, bucketTvls },
    relayerStat,
    scalingProjects,
    ossification,
    chainValues,
  ] = await Promise.all([
    getPrivacyProjectFlowData(project, last30dCutoff, currentDay, now),
    getRelayerStat(
      project,
      UnixTime(now - 30 * UnixTime.DAY),
      now,
      selected && { id: selected.id, chainProjects },
    ),
    getScalingProjects(project),
    getProjectOssification(project),
    selected
      ? getPrivacyChainValues(
          project.id,
          project.tvsConfig ?? [],
          tabs.map((tab) => tab.id),
        )
      : undefined,
  ])

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

  const daily30dIndex = new Map<string, PrivacyFlowBucketRecord>()
  const daily7dIndex = new Map<string, PrivacyFlowBucketRecord>()
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

  const statsContext: PrivacyStatsContext = {
    projectId,
    totalIndex,
    daily7dIndex,
    daily30dIndex,
    daily30d,
    last7dCutoff,
    bucketTvls,
  }

  let stats: ReturnType<typeof buildPrivacyStats>
  let chainView: PrivacyChainView | undefined
  if (selected) {
    const chainBucketTvls = new Map([
      ...getPrivacySingleEscrowBucketTvls(
        tokens,
        project.tvsConfig ?? [],
        tokenValues,
      ),
      ...bucketTvls,
    ])
    // An asset's value on one chain is what its buckets there hold.
    stats = buildPrivacyStats(
      shown.privacyInfo.tokens,
      { ...statsContext, bucketTvls: chainBucketTvls },
      (token) =>
        sumAll(token.buckets.map((bucket) => chainBucketTvls.get(bucket.id))) ??
        null,
    )
    const value = chainValues?.get(selected.id)
    chainView = {
      chains: tabs,
      selected,
      totalValueLockedUsd: value?.value,
      totalValueLockedChange7d: value?.change7d,
      allChainsValueLockedUsd: sumAll(
        tabs.map((tab) => chainValues?.get(tab.id)?.value),
      ),
    }
  } else {
    stats = buildPrivacyStats(
      tokens,
      statsContext,
      (token) => tvlBySymbol.get(token.token.symbol) ?? null,
    )
  }

  // A chain's page lists what is deployed there, and on chains with no page.
  const otherPageChains = new Set(
    tabs.flatMap((tab) => (tab.id === selected?.id ? [] : [tab.id])),
  )

  return {
    id: project.id,
    slug: project.slug,
    path: page.path,
    name: project.name,
    shortName: project.shortName,
    archivedAt: project.archivedAt,
    display: project.display,
    contracts:
      project.contracts && withoutChains(project.contracts, otherPageChains),
    permissions:
      project.permissions &&
      Object.fromEntries(
        Object.entries(project.permissions).filter(
          ([permissionsChain]) => !otherPageChains.has(permissionsChain),
        ),
      ),
    discoveryUpdates: project.discoveryUpdates,
    ossification,
    statuses: project.statuses,
    zkCatalogInfo: project.zkCatalogInfo,
    garden: project.garden,
    ossificationHistory: project.ossificationHistory,
    trustedSetups: project.trustedSetups,
    category: project.privacyInfo.category,
    exitWindow: shown.privacyInfo.exitWindow,
    adversaries: shown.privacyInfo.adversaries,
    referenceApp: project.privacyInfo.referenceApp,
    reproducibility: project.privacyInfo.reproducibility,
    anonymitySetType: getPrivacyAnonymitySetType(shown),
    hasTvl: project.tvsConfig !== undefined,
    detailedDescription:
      project.privacyInfo.detailedDescription ??
      project.display.detailedDescription,
    riskSummary: shown.privacyInfo.riskSummary,
    upgradesAndGovernance: shown.privacyInfo.upgradesAndGovernance,
    attributes: project.privacyInfo.attributes ?? [],
    milestones: [...(project.milestones ?? [])].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    ),
    trackedOn,
    scalingProjects,
    assets: stats.assets,
    summary: {
      ...stats.summary,
      relayerStat,
    },
    chainView,
  }
}

function withoutChains(
  contracts: ProjectContracts,
  chains: Set<string>,
): ProjectContracts {
  return {
    ...contracts,
    addresses: Object.fromEntries(
      Object.entries(contracts.addresses).filter(
        ([chain]) => !chains.has(chain),
      ),
    ),
    escrows: contracts.escrows?.filter((escrow) => !chains.has(escrow.chain)),
    zkVerifiers: contracts.zkVerifiers?.filter(
      (address) => !chains.has(ChainSpecificAddress.longChain(address)),
    ),
  }
}

interface PrivacyStatsContext {
  projectId: ProjectId
  totalIndex: Map<string, PrivacyFlowBucketTotalRecord>
  daily7dIndex: Map<string, PrivacyFlowBucketRecord>
  daily30dIndex: Map<string, PrivacyFlowBucketRecord>
  daily30d: PrivacyFlowBucketRecord[]
  last7dCutoff: UnixTime
  bucketTvls: Map<string, number>
}

function buildPrivacyStats(
  tokens: ProjectPrivacyToken[],
  ctx: PrivacyStatsContext,
  getAssetTvl: (token: ProjectPrivacyToken) => number | null,
): {
  assets: PrivacyAsset[]
  summary: Omit<PrivacyStatsSummary, 'relayerStat'>
} {
  const assets = tokens.map((token) => {
    let assetDepositsTotal = 0
    let assetDeposits7d = 0
    let assetDeposits30d = 0
    let assetValueTotal = 0
    let assetValue7d = 0
    let assetValue30d = 0

    const buckets = token.buckets.map((bucket) => {
      const key = `${ctx.projectId}::${bucket.id}`
      const total = ctx.totalIndex.get(key)
      const daily7d = ctx.daily7dIndex.get(key)
      const daily30d = ctx.daily30dIndex.get(key)

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
        totalValueUsd: ctx.bucketTvls.get(bucket.id) ?? null,
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
      symbol: token.token.symbol,
      iconUrl: token.token.iconUrl ?? TOKEN_PLACEHOLDER_ICON_URL,
      address: token.token.address,
      decimals: token.token.decimals,
      bucketCount: buckets.length,
      totalAmount: 0,
      totalValueUsd: getAssetTvl(token),
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

  const sum = (pick: (asset: PrivacyAsset) => number) =>
    orderedAssets.reduce((total, asset) => total + pick(asset), 0)
  const bucketIds = new Set(
    tokens.flatMap((token) => token.buckets.map((bucket) => bucket.id)),
  )
  const deposits7d = sum((asset) => asset.deposits.last7d)

  return {
    assets: orderedAssets,
    summary: {
      bucketCount: sum((asset) => asset.bucketCount),
      deposits: {
        total: sum((asset) => asset.deposits.total),
        last7d: deposits7d,
        change7d: calculatePercentageChange(
          deposits7d,
          ctx.daily30d
            .filter(
              (row) =>
                bucketIds.has(row.bucketId) &&
                row.timestamp >= ctx.last7dCutoff - 7 * UnixTime.DAY &&
                row.timestamp < ctx.last7dCutoff,
            )
            .reduce((total, row) => total + row.depositCount, 0),
        ),
        last30d: sum((asset) => asset.deposits.last30d),
      },
      depositedValueUsd: {
        total: sum((asset) => asset.depositedValueUsd.total),
        last7d: sum((asset) => asset.depositedValueUsd.last7d),
        last30d: sum((asset) => asset.depositedValueUsd.last30d),
      },
    },
  }
}

/** Undefined when a part is missing, so a subtotal never passes for the whole. */
function sumAll(values: (number | undefined)[]): number | undefined {
  let sum = 0
  for (const value of values) {
    if (value === undefined) return undefined
    sum += value
  }
  return values.length === 0 ? undefined : sum
}

function getRelayerChains(
  project: PrivacyProject,
  chainProjects: { chainConfig: { name: string; chainId?: number } }[],
): string[] {
  const tracking = project.privacyInfo.relayerTracking
  if (!tracking) return []
  switch (tracking.type) {
    case 'onchainEvents':
      return unique(
        tracking.sources.map((source) =>
          ChainSpecificAddress.longChain(source.address),
        ),
      )
    case 'railgunWaku':
      return chainProjects.flatMap((p) =>
        p.chainConfig.chainId === tracking.chainId ? [p.chainConfig.name] : [],
      )
    default:
      assertUnreachable(tracking)
  }
}

async function getTrackedOn(project: PrivacyProject) {
  const chainProjects = await ps.getProjects({
    select: ['chainConfig'],
    optional: [...PROJECT_PAGE_METADATA_FIELDS],
  })
  return {
    trackedOn: getPrivacyTrackedChains(
      project.privacyInfo.trackedOn,
      chainProjects,
    ),
    chainProjects,
  }
}

async function getScalingProjects(
  project: PrivacyProject,
): Promise<ProjectIconListItem[]> {
  const ids = project.privacyInfo.scalingProjects
  if (!ids || ids.length === 0) return []
  const scalingProjects = await ps.getProjects({
    ids,
    select: ['scalingInfo'],
    optional: ['scalingStage', ...PROJECT_PAGE_METADATA_FIELDS],
  })
  return getScalingProjectItems(ids, scalingProjects)
}

const MIN_OBSERVED_DAYS_FOR_AVERAGE = 7

/**
 * @param chain Counts the relayers on this chain only, for a project shown
 *   one chain at a time.
 */
async function getRelayerStat(
  project: PrivacyProject,
  from: UnixTime,
  to: UnixTime,
  chain?: {
    id: string
    chainProjects: Parameters<typeof getRelayerChains>[1]
  },
): Promise<PrivacyRelayerStat | undefined> {
  const tracking = project.privacyInfo.relayerTracking
  if (!tracking) {
    return undefined
  }
  if (
    chain &&
    !getRelayerChains(project, chain.chainProjects).includes(chain.id)
  ) {
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
        chain?.id,
      )
      return { kind: 'activeRelayers', value: count }
    }
    case 'railgunWaku': {
      const result = await getDb().privacyRelayerSample.getAverageRelayerCount(
        project.id,
        from,
        to,
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
  from: UnixTime,
  to: UnixTime,
  now: UnixTime,
): Promise<PrivacyProjectFlowData> {
  const projectId = project.id

  if (env.MOCK) {
    return getMockPrivacyProjectFlowData(project, from, to)
  }

  const db = getDb()
  const [totals, daily30d, tokenValues] = await Promise.all([
    db.privacyFlowEvent.getBucketTotalsByProjectIds([projectId]),
    db.privacyFlowEvent.getBucketedByProjectIds([projectId], from, to, 'day'),
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
    project.privacyInfo.tokens,
    project.tvsConfig ?? [],
    tokenValues,
    escrowValues,
  )
  return { totals, daily30d, tokenValues, bucketTvls }
}

function getMockPrivacyProjectFlowData(
  project: PrivacyProject,
  from: UnixTime,
  to: UnixTime,
): PrivacyProjectFlowData {
  const projectId = project.id
  const bucketIds = project.privacyInfo.tokens.flatMap((token) =>
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

  const daily30d: PrivacyFlowBucketRecord[] = []
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
