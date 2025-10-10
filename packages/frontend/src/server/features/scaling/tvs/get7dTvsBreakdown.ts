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

  const tvsProjects = await getTvsProjects(
    createTvsBreakdownProjectFilter(props),
  )
  const values = await queryExecutor.execute({
    name: 'getSummedByTimestampTvsPerProjectQuery',
    args: [
      target - 7 * UnixTime.DAY,
      target,
      tvsProjects.map((p) => p.projectId),
    ],
  })

  const valuesByProject = pick(
    values.data,
    tvsProjects.map((p) => p.projectId),
  )

  const projects: Record<string, ProjectSevenDayTvsBreakdown> = {}
  for (const [projectId, projectValues] of Object.entries(valuesByProject)) {
    const { all, withoutAssociated } = projectValues

    const latestWithoutAssociated = withoutAssociated.at(-1)
    const oldestWithoutAssociated = withoutAssociated.at(0)
    const latestValue = all.at(-1)
    const oldestValue = all.at(0)

    if (
      !latestValue ||
      !oldestValue ||
      !latestWithoutAssociated ||
      !oldestWithoutAssociated
    ) {
      continue
    }

    projects[projectId] = {
      breakdown: {
        total: latestValue.value,
        native: latestValue.native,
        canonical: latestValue.canonical,
        external: latestValue.external,
        ether: latestValue.ether,
        stablecoin: latestValue.stablecoin,
        btc: latestValue.btc,
        other: latestValue.other,
      },
      breakdown7d: {
        total: oldestValue.value,
        native: oldestValue.native,
        canonical: oldestValue.canonical,
        external: oldestValue.external,
        ether: oldestValue.ether,
        stablecoin: oldestValue.stablecoin,
        btc: oldestValue.btc,
        other: oldestValue.other,
      },
      associated: {
        total: latestValue.associated,
        native: latestValue.native - latestWithoutAssociated.native,
        canonical: latestValue.canonical - latestWithoutAssociated.canonical,
        external: latestValue.external - latestWithoutAssociated.external,
        ether: latestValue.ether - latestWithoutAssociated.ether,
        stablecoin: latestValue.stablecoin - latestWithoutAssociated.stablecoin,
        btc: latestValue.btc - latestWithoutAssociated.btc,
        other: latestValue.other - latestWithoutAssociated.other,
      },
      change: {
        total: calculatePercentageChange(latestValue.value, oldestValue.value),
        native: calculatePercentageChange(
          latestValue.native,
          oldestValue.native,
        ),
        canonical: calculatePercentageChange(
          latestValue.canonical,
          oldestValue.canonical,
        ),
        external: calculatePercentageChange(
          latestValue.external,
          oldestValue.external,
        ),
        ether: calculatePercentageChange(latestValue.ether, oldestValue.ether),
        stablecoin: calculatePercentageChange(
          latestValue.stablecoin,
          oldestValue.stablecoin,
        ),
        btc: calculatePercentageChange(latestValue.btc, oldestValue.btc),
        other: calculatePercentageChange(latestValue.other, oldestValue.other),
      },
      changeExcludingAssociated: {
        total: calculatePercentageChange(
          latestWithoutAssociated.value,
          oldestWithoutAssociated.value,
        ),
        native: calculatePercentageChange(
          latestWithoutAssociated.native,
          oldestWithoutAssociated.native,
        ),
        canonical: calculatePercentageChange(
          latestWithoutAssociated.canonical,
          oldestWithoutAssociated.canonical,
        ),
        external: calculatePercentageChange(
          latestWithoutAssociated.external,
          oldestWithoutAssociated.external,
        ),
        ether: calculatePercentageChange(
          latestWithoutAssociated.ether,
          oldestWithoutAssociated.ether,
        ),
        stablecoin: calculatePercentageChange(
          latestWithoutAssociated.stablecoin,
          oldestWithoutAssociated.stablecoin,
        ),
        btc: calculatePercentageChange(
          latestWithoutAssociated.btc,
          oldestWithoutAssociated.btc,
        ),
        other: calculatePercentageChange(
          latestWithoutAssociated.other,
          oldestWithoutAssociated.other,
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
