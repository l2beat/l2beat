import type { Project } from '@l2beat/config'
import type { ProjectValueRecord } from '@l2beat/database'
import { groupByBridgeTabs } from '~/pages/bridges/utils/groupByBridgeTabs'
import { groupByScalingTabs } from '~/pages/scaling/utils/groupByScalingTabs'
import { getDb } from '~/server/database'
import { getScalingTab } from '~/server/features/scaling/getCommonScalingEntry'
import { ps } from '~/server/projects'

export async function getHotPages() {
  const db = getDb()

  const [scaling, bridges, daLayers, daBridges, latestValues] =
    await Promise.all([
      ps.getProjects({
        select: ['scalingInfo', 'statuses'],
        where: ['isScaling'],
      }),
      ps.getProjects({
        select: ['bridgeInfo'],
        where: ['isBridge'],
      }),
      ps.getProjects({
        where: ['isDaLayer'],
      }),
      ps.getProjects({
        select: ['daBridge'],
      }),
      db.tvsProjectValue.getLatestValues('PROJECT'),
    ])

  const groupedScaling = groupByScalingTabs(
    scaling.map((p) => ({ ...p, tab: getScalingTab(p) })),
  )
  const scalingPaths: string[] = []
  for (const [_, projects] of Object.entries(groupedScaling)) {
    const result = projects
      .sort(sortByTvs(latestValues))
      .slice(0, 10)
      .map((s) => `/scaling/projects/${s.slug}`)
    scalingPaths.push(...result)
  }

  const groupedBridges = groupByBridgeTabs(
    bridges.map((bridge) => ({
      ...bridge,
      category: bridge.bridgeInfo.category,
    })),
  )
  const bridgePaths: string[] = []
  for (const [_, projects] of Object.entries(groupedBridges)) {
    const result = projects
      .sort(sortByTvs(latestValues))
      .slice(0, 10)
      .map((s) => `/bridges/projects/${s.slug}`)
    bridgePaths.push(...result)
  }

  const daPaths = daLayers.map((d) => {
    const bridge = daBridges.find((b) => b.daBridge.daLayer === d.id)
    return `/data-availability/projects/${d.slug}/${bridge?.slug ?? 'no-bridge'}`
  })

  return [
    '/scaling/summary',
    '/scaling/risk',
    '/scaling/tvs',
    '/scaling/activity',
    '/scaling/data-availability',
    '/scaling/liveness',
    '/scaling/costs',
    '/scaling/upcoming',
    '/scaling/archived',
    '/bridges/summary',
    '/bridges/archived',
    '/data-availability/summary',
    '/data-availability/risk',
    '/data-availability/throughput',
    ...scalingPaths,
    ...bridgePaths,
    ...daPaths,
  ]
}
function sortByTvs(latestValues: ProjectValueRecord[]) {
  return (a: Project, b: Project) => {
    const aValue = latestValues.find((v) => v.project === a.id)
    const bValue = latestValues.find((v) => v.project === b.id)
    return (bValue?.value ?? 0) - (aValue?.value ?? 0)
  }
}
