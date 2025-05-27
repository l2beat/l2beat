import type { Project } from '@l2beat/config'
import type { ProjectValueRecord } from '@l2beat/database'
import express from 'express'
import { groupByBridgeTabs } from '~/app/(side-nav)/bridges/_utils/group-by-bridge-tabs'
import { groupByScalingTabs } from '~/app/(side-nav)/scaling/_utils/group-by-scaling-tabs'
import { getDb } from '~/server/database'
import { getScalingTab } from '~/server/features/scaling/get-common-scaling-entry'
import { ps } from '~/server/projects'

export function createInternalApiRouter() {
  const router = express.Router()

  router.get('/api/hotpages', async (_, res) => {
    const db = getDb()

    const [scaling, bridges, daLayers, daBridges, latestValues] =
      await Promise.all([
        ps.getProjects({
          select: ['scalingInfo'],
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
      return `/data-availability/${d.slug}/${bridge?.slug ?? 'no-bridge'}`
    })

    res.setHeader('Content-Type', 'application/json')
    res.json([
      '/scaling/summary',
      '/scaling/risk',
      '/scaling/tvs',
      '/scaling/activity',
      '/scaling/data-availability',
      '/scaling/liveness',
      '/scaling/finality',
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
    ])
  })

  return router
}

function sortByTvs(latestValues: ProjectValueRecord[]) {
  return (a: Project, b: Project) => {
    const aValue = latestValues.find((v) => v.project === a.id)
    const bValue = latestValues.find((v) => v.project === b.id)
    return (bValue?.value ?? 0) - (aValue?.value ?? 0)
  }
}
