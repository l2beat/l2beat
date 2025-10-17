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
  associated: BreakdownSplit
  change: BreakdownSplit
  changeExcludingAssociated: BreakdownSplit
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
}

// NOTE(radomski): Was a discriminatedUnion but l2beat/validate does not
// support it yet. It's a performance issue.
export const TvsBreakdownProjectFilter = v.union([
  v.object({ type: v.enum(['all', 'layer2', 'bridge']) }),
  v.object({ type: v.literal('projects'), projectIds: v.array(v.string()) }),
])

type TvsBreakdownProjectFilter = v.infer<typeof TvsBreakdownProjectFilter>

export async function get7dTvsBreakdown(
  props: TvsBreakdownProjectFilter,
  customTarget?: UnixTime,
): Promise<SevenDayTvsBreakdown> {
  if (env.MOCK) {
    return getMockTvsBreakdownData()
  }

  const target = customTarget ?? getTvsTargetTimestamp()

  const [tvsProjects, values] = await Promise.all([
    getTvsProjects(createTvsBreakdownProjectFilter(props)),
    queryExecutor.execute({
      name: 'getAtTimestampsPerProjectQuery',
      args: [target - 7 * UnixTime.DAY, target],
    }),
  ])
  const valuesByProject = pick(
    values,
    tvsProjects.map((p) => p.projectId),
  )

  const projects: Record<string, ProjectSevenDayTvsBreakdown> = {}
  for (const [projectId, projectValues] of Object.entries(valuesByProject)) {
    const { all, withoutAssociated } = projectValues

    const latestWithoutAssociatedRecord = withoutAssociated.at(-1)
    const oldestWithoutAssociatedRecord = withoutAssociated.at(0)
    const latestValueRecord = all.at(-1)
    const oldestValueRecord = all.at(0)

    if (
      !latestValueRecord ||
      !oldestValueRecord ||
      !latestWithoutAssociatedRecord ||
      !oldestWithoutAssociatedRecord
    ) {
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
      _latestRwaRestricted,
      _latestRwaPublic,
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
      _oldestRwaRestricted,
      _oldestRwaPublic,
      oldestOther,
      _oldestAssociated,
    ] = oldestValueRecord

    const [
      latestWAValue,
      latestWACanonical,
      latestWAExternal,
      latestWANative,
      latestWAEther,
      latestWAStablecoin,
      latestWABtc,
      _latestWARwaRestricted,
      _latestWARwaPublic,
      latestWAOther,
      _latestWAAssociated,
    ] = latestWithoutAssociatedRecord

    const [
      oldestWAValue,
      oldestWACanonical,
      oldestWAExternal,
      oldestWANative,
      oldestWAEther,
      oldestWAStablecoin,
      oldestWABtc,
      _oldestWARwaRestricted,
      _oldestWARwaPublic,
      oldestWAOther,
      _oldestWAAssociated,
    ] = oldestWithoutAssociatedRecord

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
      },
      associated: {
        total: latestAssociated,
        native: latestNative - latestWANative,
        canonical: latestCanonical - latestWACanonical,
        external: latestExternal - latestWAExternal,
        ether: latestEther - latestWAEther,
        stablecoin: latestStablecoin - latestWAStablecoin,
        btc: latestBtc - latestWABtc,
        other: latestOther - latestWAOther,
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
      },
      changeExcludingAssociated: {
        total: calculatePercentageChange(latestWAValue, oldestWAValue),
        native: calculatePercentageChange(latestWANative, oldestWANative),
        canonical: calculatePercentageChange(
          latestWACanonical,
          oldestWACanonical,
        ),
        external: calculatePercentageChange(latestWAExternal, oldestWAExternal),
        ether: calculatePercentageChange(latestWAEther, oldestWAEther),
        stablecoin: calculatePercentageChange(
          latestWAStablecoin,
          oldestWAStablecoin,
        ),
        btc: calculatePercentageChange(latestWABtc, oldestWABtc),
        other: calculatePercentageChange(latestWAOther, oldestWAOther),
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
          },
          associated: {
            total: 6,
            native: 1,
            canonical: 2,
            external: 3,
            ether: 0,
            stablecoin: 0,
            btc: 0,
            other: 0,
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
          },
          changeExcludingAssociated: {
            total: 0.3,
            canonical: 0.4,
            native: 0.15,
            external: 0.15,
            ether: 0.15,
            stablecoin: 0.15,
            btc: 0.15,
            other: 0.15,
          },
        },
      ]),
    ),
  }
}
