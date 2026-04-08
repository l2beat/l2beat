import type { Project } from '@l2beat/config'
import type { SyncMetadataRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import groupBy from 'lodash/groupBy'
import partition from 'lodash/partition'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import { type ChartRange, optionToRange } from '~/utils/range/range'
import { getSyncState, type SyncState } from '../../utils/syncState'
import { getAdditionalTrustAssumptionsPercentage } from './utils/getAdditionalTrustAssumptionsPercentage'
import { getTvsProjects } from './utils/getTvsProjects'

export interface SevenDayTvsBreakdown {
  total: number
  projects: Record<string, ProjectSevenDayTvsBreakdown>
}

export interface ProjectSevenDayTvsBreakdown {
  breakdown: BreakdownSplit
  breakdown7d: BreakdownSplit
  change: BreakdownSplit
  additionalTrustAssumptionsPercentage: number
  syncState: SyncState
}

interface BreakdownSplit {
  total: number
  canonical: number
  external: number
  native: number
  ether: number
  stablecoin: number
  btc: number
  other: number
  rwaRestricted: number
  rwaPublic: number
  associated: number
}

const TvsAdditionalProps = {
  excludeAssociatedTokens: v.boolean().optional(),
  excludeRwaRestrictedTokens: v.boolean().optional(),
  customTarget: v.number().optional(),
}

export const TvsBreakdownProjectFilter = v.union([
  v.object({
    type: v.enum([
      'all',
      'layer2',
      'rollups',
      'validiumsAndOptimiums',
      'others',
      'notReviewed',
    ]),
    ...TvsAdditionalProps,
  }),
  v.object({
    type: v.literal('projects'),
    projectIds: v.array(v.string()),
    ...TvsAdditionalProps,
  }),
])
export type TvsBreakdownProjectFilter = v.infer<
  typeof TvsBreakdownProjectFilter
>

export async function get7dTvsBreakdown(
  params: TvsBreakdownProjectFilter,
): Promise<SevenDayTvsBreakdown> {
  if (env.MOCK) {
    return getMockTvsBreakdownData(params)
  }

  const db = getDb()
  const tvsProjects = await getTvsProjects(
    createTvsBreakdownProjectFilter(params),
  )

  const [from, to] = params.customTarget
    ? [params.customTarget - 7 * UnixTime.DAY, params.customTarget]
    : await getFullySyncedTvsRange(optionToRange('7d'))
  assert(from !== null, 'from is null')
  const [values, syncMetadataRecords] = await Promise.all([
    db.tvsTokenValue.getSummedByProjectForRange(
      tvsProjects.map((p) => p.projectId),
      [from - 7 * UnixTime.DAY, to],
      {
        excludeAssociatedTokens: params.excludeAssociatedTokens ?? false,
        excludeRwaRestrictedTokens: params.excludeRwaRestrictedTokens ?? true,
      },
    ),
    db.syncMetadata.getByFeature('tvs'),
  ])

  const [recentValues, sevenDaysAgoValues] = partition(
    values,
    (r) => r.timestamp >= from,
  )

  const recentGrouped = groupBy(recentValues, (v) => v.project)
  const sevenDaysAgoGrouped = groupBy(sevenDaysAgoValues, (v) => v.project)

  let total = 0
  const projects: Record<string, ProjectSevenDayTvsBreakdown> = {}
  for (const [projectId, values] of Object.entries(recentGrouped)) {
    const syncState = getTvsSyncState({ projectId, syncMetadataRecords, to })
    if (!syncState) {
      continue
    }

    const lastValue = values.at(-1)
    if (!lastValue) {
      continue
    }

    total += lastValue.value

    const {
      value: latestValue,
      canonical: latestCanonical,
      customCanonical: latestCustomCanonical,
      external: latestExternal,
      native: latestNative,
      ether: latestEther,
      stablecoin: latestStablecoin,
      btc: latestBtc,
      rwaRestricted: latestRwaRestricted,
      rwaPublic: latestRwaPublic,
      other: latestOther,
      associated: latestAssociated,
    } = lastValue
    const canonical = latestCanonical + latestCustomCanonical

    const additionalTrustAssumptionsPercentage =
      getAdditionalTrustAssumptionsPercentage({
        total: latestValue,
        customCanonical: latestCustomCanonical,
        external: latestExternal,
      })

    const sevenDaysAgoValues = sevenDaysAgoGrouped[projectId]
    if (!sevenDaysAgoValues || sevenDaysAgoValues.length === 0) {
      projects[projectId] = {
        breakdown: {
          total: latestValue,
          native: latestNative,
          canonical: canonical,
          external: latestExternal,
          ether: latestEther,
          stablecoin: latestStablecoin,
          btc: latestBtc,
          other: latestOther,
          rwaRestricted: latestRwaRestricted,
          rwaPublic: latestRwaPublic,
          associated: latestAssociated,
        },
        breakdown7d: {
          total: 0,
          native: 0,
          canonical: 0,
          external: 0,
          ether: 0,
          stablecoin: 0,
          btc: 0,
          other: 0,
          rwaRestricted: 0,
          rwaPublic: 0,
          associated: 0,
        },
        change: {
          total: 0,
          canonical: 0,
          external: 0,
          native: 0,
          ether: 0,
          stablecoin: 0,
          btc: 0,
          other: 0,
          rwaRestricted: 0,
          rwaPublic: 0,
          associated: 0,
        },
        additionalTrustAssumptionsPercentage,
        syncState,
      }
      continue
    }

    const sevenDaysAgoValue = sevenDaysAgoValues.at(-1)
    assert(sevenDaysAgoValue, 'sevenDaysAgoValue is undefined')

    const {
      value: oldestValue,
      canonical: oldestCanonical,
      customCanonical: oldestCustomCanonical,
      external: oldestExternal,
      native: oldestNative,
      ether: oldestEther,
      stablecoin: oldestStablecoin,
      btc: oldestBtc,
      rwaRestricted: oldestRwaRestricted,
      rwaPublic: oldestRwaPublic,
      other: oldestOther,
      associated: oldestAssociated,
    } = sevenDaysAgoValue
    const sevenDaysAgoCanonical = oldestCanonical + oldestCustomCanonical

    projects[projectId] = {
      breakdown: {
        total: latestValue,
        native: latestNative,
        canonical,
        external: latestExternal,
        ether: latestEther,
        stablecoin: latestStablecoin,
        btc: latestBtc,
        other: latestOther,
        rwaRestricted: latestRwaRestricted,
        rwaPublic: latestRwaPublic,
        associated: latestAssociated,
      },
      breakdown7d: {
        total: oldestValue,
        native: oldestNative,
        canonical: sevenDaysAgoCanonical,
        external: oldestExternal,
        ether: oldestEther,
        stablecoin: oldestStablecoin,
        btc: oldestBtc,
        other: oldestOther,
        rwaRestricted: oldestRwaRestricted,
        rwaPublic: oldestRwaPublic,
        associated: oldestAssociated,
      },
      change: {
        total: calculatePercentageChange(latestValue, oldestValue),
        native: calculatePercentageChange(latestNative, oldestNative),
        canonical: calculatePercentageChange(canonical, sevenDaysAgoCanonical),
        external: calculatePercentageChange(latestExternal, oldestExternal),
        ether: calculatePercentageChange(latestEther, oldestEther),
        stablecoin: calculatePercentageChange(
          latestStablecoin,
          oldestStablecoin,
        ),
        btc: calculatePercentageChange(latestBtc, oldestBtc),
        other: calculatePercentageChange(latestOther, oldestOther),
        rwaRestricted: calculatePercentageChange(
          latestRwaRestricted,
          oldestRwaRestricted,
        ),
        rwaPublic: calculatePercentageChange(latestRwaPublic, oldestRwaPublic),
        associated: calculatePercentageChange(
          latestAssociated,
          oldestAssociated,
        ),
      },
      additionalTrustAssumptionsPercentage,
      syncState,
    }
  }

  return {
    total,
    projects,
  }
}

export function createTvsBreakdownProjectFilter(
  filter: TvsBreakdownProjectFilter,
): (project: Project<'statuses', 'scalingInfo'>) => boolean {
  switch (filter.type) {
    case 'projects':
      return (project) => filter.projectIds.includes(project.id)
    case 'all':
      return () => true
    case 'layer2':
      return (project) => !!project.scalingInfo
    case 'notReviewed':
      return (project) => project.statuses.reviewStatus === 'initialReview'
    case 'rollups':
      return (project) =>
        !!project.scalingInfo &&
        (project.scalingInfo.type === 'Optimistic Rollup' ||
          project.scalingInfo.type === 'ZK Rollup') &&
        !(project.statuses.reviewStatus === 'initialReview')
    case 'validiumsAndOptimiums':
      return (project) =>
        !!project.scalingInfo &&
        (project.scalingInfo.type === 'Validium' ||
          project.scalingInfo.type === 'Optimium' ||
          project.scalingInfo.type === 'Plasma') &&
        !(project.statuses.reviewStatus === 'initialReview')
    case 'others':
      return (project) =>
        !!project.scalingInfo &&
        project.scalingInfo.type === 'Other' &&
        !(project.statuses.reviewStatus === 'initialReview')
  }
}

function getTvsSyncState({
  projectId,
  syncMetadataRecords,
  to,
}: {
  projectId: string
  syncMetadataRecords: SyncMetadataRecord[]
  to: UnixTime
}): SyncState | undefined {
  const projectSyncMetadataRecords = syncMetadataRecords.filter((r) =>
    // Sync metadata records are stored per token in the database in format of <projectId>-<tokenId> (i.e. "arbitrum-USDC")
    r.id.startsWith(`${projectId}-`),
  )
  if (projectSyncMetadataRecords.length === 0) {
    return
  }

  const syncedUntils = projectSyncMetadataRecords
    .map((r) => r.syncedUntil)
    .filter((r) => r !== null)
  // Records for TVS are stored per token in the database, so we need to get the max target and syncedUntil for the project
  const record = {
    feature: 'tvs' as const,
    id: projectId,
    target: Math.max(...projectSyncMetadataRecords.map((r) => r.target)),
    syncedUntil: syncedUntils.length > 0 ? Math.max(...syncedUntils) : null,
    blockTarget: null,
    blockSyncedUntil: null,
  }
  return getSyncState(record, to)
}

async function getFullySyncedTvsRange(range: ChartRange) {
  const db = getDb()
  const target = await db.syncMetadata.getMaxTargetForFeature('tvs')
  return [range[0], Math.min(range[1], target)] as const
}

async function getMockTvsBreakdownData(
  props: TvsBreakdownProjectFilter,
): Promise<SevenDayTvsBreakdown> {
  const projects = await getTvsProjects(createTvsBreakdownProjectFilter(props))
  return {
    total: 1000,
    projects: Object.fromEntries(
      projects.map((project) => [
        project.projectId,
        {
          breakdown: {
            total: 60,
            canonical: 30,
            native: 20,
            external: 10,
            ether: 30,
            stablecoin: 30,
            btc: 4,
            other: 0,
            rwaRestricted: 0,
            rwaPublic: 0,
            associated: 0,
          },
          breakdown7d: {
            total: 50,
            canonical: 25,
            native: 15,
            external: 10,
            ether: 25,
            stablecoin: 25,
            btc: 5,
            other: 0,
            rwaRestricted: 0,
            rwaPublic: 0,
            associated: 0,
          },
          change: {
            total: 0.4,
            canonical: 0.5,
            native: 0.25,
            external: 0.25,
            ether: 0.25,
            stablecoin: 0.25,
            btc: 0.25,
            other: 0.25,
            rwaRestricted: 0.25,
            rwaPublic: 0.25,
            associated: 0.25,
          },
          additionalTrustAssumptionsPercentage:
            project.projectId === 'base' ? 0.8 : 0,
          syncState: {
            isSynced: true,
            syncedUntil: UnixTime.now(),
            target: UnixTime.now(),
          },
        },
      ]),
    ),
  }
}
