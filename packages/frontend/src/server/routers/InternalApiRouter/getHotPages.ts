import type { Project } from '@l2beat/config'
import { groupByBridgeTabs } from '~/pages/bridges/utils/groupByBridgeTabs'
import { groupByScalingTabs } from '~/pages/scaling/utils/groupByScalingTabs'
import { getScalingTab } from '~/server/features/scaling/getCommonScalingEntry'
import {
  get7dTvsBreakdown,
  type SevenDayTvsBreakdown,
} from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import { ps } from '~/server/projects'

export async function getHotPages() {
  const [scaling, bridges, daLayers, daBridges, ecosystems, latestValues] =
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
      ps.getProjects({
        select: ['ecosystemConfig'],
      }),
      get7dTvsBreakdown({ type: 'all' }),
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

  const ecosystemPaths = ecosystems.map((e) => `/ecosystems/${e.slug}`)

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
    ...ecosystemPaths,
  ]
}
function sortByTvs(latestValues: SevenDayTvsBreakdown) {
  return (a: Project, b: Project) => {
    const aValue = latestValues.projects[a.id]?.breakdown.total
    const bValue = latestValues.projects[b.id]?.breakdown.total
    return (bValue ?? 0) - (aValue ?? 0)
  }
}
