import type {
  Project,
  ProjectCustomColors,
  ProjectScalingCategory,
  ProjectScalingStage,
} from '@l2beat/config'
import { assert, type ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { BadgeWithParams } from '~/components/projects/ProjectBadge'
import type { DataAvailabilityUpdate } from '~/content/monthly-updates'
import { ps } from '~/server/projects'
import { getBadgeWithParams } from '~/utils/project/getBadgeWithParams'
import { getImageParams } from '~/utils/project/getImageParams'
import {
  getDaThroughputSummary,
  type ThroughputSummaryData,
} from '../data-availability/throughput/getDaThroughputSummary'
import type { ActivityLatestUopsData } from '../scaling/activity/getActivityLatestTps'
import type { SevenDayTvsBreakdown } from '../scaling/tvs/get7dTvsBreakdown'

export interface DaMonthlyUpdateEntry
  extends Omit<DataAvailabilityUpdate, 'daLayerId'> {
  id: string
  name: string
  colors: ProjectCustomColors
  daProjects: ProjectId[]
  bannerImg?: string
  allProjects: {
    tvs: number
    dataPosted: number
  }
  newProjects: {
    id: ProjectId
    name: string
    stage: ProjectScalingStage
    slug: string
    description: string
    category: ProjectScalingCategory
    tvs?: number
    uops?: number
    isAppchain: boolean
    badges: BadgeWithParams[]
  }[]
  pastDayPosted: number
}

export async function getDaMonthlyUpdateEntries(
  daUpdateEntries: DataAvailabilityUpdate[],
  tvs: SevenDayTvsBreakdown,
  activity: ActivityLatestUopsData,
  to: UnixTime,
): Promise<DaMonthlyUpdateEntry[]> {
  const [daLayers, daBridges, newProjects, throughput] = await Promise.all([
    ps.getProjects({
      select: ['isDaLayer', 'daLayer', 'colors'],
    }),
    await ps.getProjects({
      select: ['daBridge'],
    }),
    ps.getProjects({
      ids: daUpdateEntries.flatMap(
        (e) => (e.newProjectsIds as ProjectId[]) ?? [],
      ),
      select: ['scalingStage', 'display', 'scalingInfo'],
    }),
    getDaThroughputSummary({ to: to + UnixTime.DAY }),
  ])

  return daUpdateEntries.map((daUpdateEntry) => {
    const daLayer = daLayers.find((p) => p.id === daUpdateEntry.daLayerId)
    assert(daLayer, `DA Layer not found for ${daUpdateEntry.daLayerId}`)
    return getDaMonthlyUpdateEntry(
      daUpdateEntry,
      daLayer,
      daBridges,
      newProjects,
      tvs,
      activity,
      throughput,
    )
  })
}

function getDaMonthlyUpdateEntry(
  daUpdateEntry: DataAvailabilityUpdate,
  daLayer: Project<'isDaLayer' | 'daLayer' | 'colors'>,
  daBridges: Project<'daBridge'>[],
  newProjects: Project<'scalingStage' | 'display' | 'scalingInfo'>[],
  tvs: SevenDayTvsBreakdown,
  activity: ActivityLatestUopsData,
  throughput: ThroughputSummaryData,
): DaMonthlyUpdateEntry {
  const projectBridges = daBridges.filter(
    (x) => x.daBridge.daLayer === daLayer.id,
  )

  const allUsedIn = daLayer.daLayer.usedWithoutBridgeIn.concat(
    projectBridges.flatMap((x) => x.daBridge.usedIn),
  )

  const pastDayPosted =
    throughput?.latest[daLayer.id as keyof typeof throughput.latest] ?? 0

  const dataPosted = Object.values(throughput?.latest ?? {}).reduce(
    (acc, curr) => acc + curr,
    0,
  )

  const bannerImg = getImageParams(
    `/images/monthly-updates/${daUpdateEntry.daLayerId}.png`,
  )?.src

  return {
    ...daUpdateEntry,
    ...daLayer,
    bannerImg,
    colors: daLayer.colors,
    daProjects: allUsedIn.map((x) => x.id),
    allProjects: {
      tvs: tvs.total,
      dataPosted,
    },
    newProjects:
      daUpdateEntry.newProjectsIds?.map((p) => {
        const project = newProjects.find((n) => n.id === p)
        assert(project, `Project not found for ${p}`)
        return {
          id: project.id,
          name: project.name,
          slug: project.slug,
          stage: project.scalingStage,
          description: project.display.description,
          category: project.scalingInfo.type,
          tvs: tvs.projects[p.toString()]?.breakdown.total,
          uops: activity[p.toString()]?.pastDayUops,
          isAppchain: project.scalingInfo.capability === 'appchain',
          badges: project.display.badges
            .map((badge) => getBadgeWithParams(badge))
            .filter((badge) => badge !== undefined),
        }
      }) ?? [],
    pastDayPosted,
  }
}
