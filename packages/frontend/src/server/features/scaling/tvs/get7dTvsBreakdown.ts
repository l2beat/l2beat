import type { Project } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import pick from 'lodash/pick'
import { env } from '~/env'
import { ps } from '~/server/projects'
import { queryExecutor } from '~/server/queryExecutor'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import { getTvsProjects } from './utils/getTvsProjects'
import { getTvsTargetTimestamp } from './utils/getTvsTargetTimestamp'

export interface SevenDayTvsBreakdown {
  total: number
  projects: Record<string, ProjectSevenDayTvsBreakdown>
}

export interface ProjectSevenDayTvsBreakdown {
  breakdown: BreakdownSplit
  breakdown7d: BreakdownSplit
  change: BreakdownSplit
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
  includeRwaRestrictedTokens: v.boolean().optional(),
  customTarget: v.number().optional(),
}

export const TvsBreakdownProjectFilter = v.union([
  v.object({
    type: v.enum([
      'all',
      'layer2',
      'bridge',
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
type TvsBreakdownProjectFilter = v.infer<typeof TvsBreakdownProjectFilter>

export async function get7dTvsBreakdown(
  props: TvsBreakdownProjectFilter,
): Promise<SevenDayTvsBreakdown> {
  if (env.MOCK) {
    return getMockTvsBreakdownData()
  }

  const target = props.customTarget ?? getTvsTargetTimestamp()

  const [tvsProjects, values] = await Promise.all([
    getTvsProjects(createTvsBreakdownProjectFilter(props)),
    queryExecutor.execute({
      name: 'getAtTimestampsPerProjectQuery',
      args: [
        target - 7 * UnixTime.DAY,
        target,
        props.excludeAssociatedTokens ?? false,
        props.includeRwaRestrictedTokens ?? false,
      ],
    }),
  ])
  const valuesByProject = pick(
    values,
    tvsProjects.map((p) => p.projectId),
  )

  const projects: Record<string, ProjectSevenDayTvsBreakdown> = {}
  for (const [projectId, projectValues] of Object.entries(valuesByProject)) {
    const latestValueRecord = projectValues.at(-1)
    const oldestValueRecord = projectValues.at(0)

    if (!latestValueRecord || !oldestValueRecord) {
      continue
    }

    const [
      latestValue,
      latestCanonical,
      latestExternal,
      latestNative,
      latestEther,
      latestStablecoin,
      latestBtc,
      latestRwaRestricted,
      latestRwaPublic,
      latestOther,
      latestAssociated,
    ] = latestValueRecord

    const [
      oldestValue,
      oldestCanonical,
      oldestExternal,
      oldestNative,
      oldestEther,
      oldestStablecoin,
      oldestBtc,
      oldestRwaRestricted,
      oldestRwaPublic,
      oldestOther,
      oldestAssociated,
    ] = oldestValueRecord

    projects[projectId] = {
      breakdown: {
        total: latestValue,
        native: latestNative,
        canonical: latestCanonical,
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
        canonical: oldestCanonical,
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
        canonical: calculatePercentageChange(latestCanonical, oldestCanonical),
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
    }
  }

  const total = Object.values(projects).reduce(
    (acc, { breakdown }) => acc + breakdown.total,
    0,
  )

  return {
    total,
    projects,
  }
}

function createTvsBreakdownProjectFilter(
  filter: TvsBreakdownProjectFilter,
): (project: Project<'statuses', 'scalingInfo' | 'isBridge'>) => boolean {
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
    case 'bridge':
      return (project) => !!project.isBridge
  }
}

async function getMockTvsBreakdownData(): Promise<SevenDayTvsBreakdown> {
  const projects = await ps.getProjects({ where: ['tvsConfig'] })
  return {
    total: 1000,
    projects: Object.fromEntries(
      projects.map((project) => [
        project.id,
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
        },
      ]),
    ),
  }
}
