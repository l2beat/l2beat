import type { DaLayer, Project, UsedInProject } from '@l2beat/config'
import {
  mapBridgeRisksToRosetteValues,
  mapLayerRisksToRosetteValues,
} from '~/app/(side-nav)/data-availability/_utils/map-risks-to-rosette-values'
import {
  getEthereumDaProjectSections,
  getRegularDaProjectSections,
} from '~/app/(top-nav)/data-availability/projects/[layer]/_utils/da-project-sections'
import type { ProjectLink } from '~/components/projects/links/types'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { RosetteValue } from '~/components/rosette/types'
import { ps } from '~/server/projects'
import { api } from '~/trpc/server'
import { getProjectLinks } from '~/utils/project/get-project-links'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import { getDaLayerRisks } from '../utils/get-da-layer-risks'
import {
  getDaProjectsTvs,
  pickTvsForProjects,
} from '../utils/get-da-projects-tvs'
import { getDaProjectEconomicSecurity } from './utils/get-da-project-economic-security'

interface CommonDaProjectPageEntry {
  name: string
  slug: string
  kind: DaLayer['type']
  type: string
  description: string
  isUnderReview: boolean
  isUpcoming: boolean
  projectVariants?: {
    title: string
    href: string
  }[]
}

export interface DaProjectPageEntry extends CommonDaProjectPageEntry {
  selectedBridge: {
    name: string
    slug: string
    isNoBridge: boolean
    grissiniValues: RosetteValue[]
  }
  bridges: {
    name: string
    slug: string
    isNoBridge: boolean
    grissiniValues: RosetteValue[]
    tvs: number
    usedIn: UsedInProject[]
  }[]
  header: {
    daLayerGrissiniValues: RosetteValue[]
    daBridgeGrissiniValues: RosetteValue[]
    tvs: number
    links: ProjectLink[]
    economicSecurity: number | undefined
    durationStorage: number | undefined
    maxThroughputPerSecond: number | undefined
    usedIn: UsedInProject[]
  }
  sections: ProjectDetailsSection[]
}

export interface EthereumDaProjectPageEntry extends CommonDaProjectPageEntry {
  header: {
    links: ProjectLink[]
    tvs: number
    economicSecurity: number | undefined
    durationStorage: number
    maxThroughputPerSecond: number | undefined
    usedIn: UsedInProject[]
    bridgeName: string
    callout: {
      title: string
      description: string
    }
  }
  sections: ProjectDetailsSection[]
}

export async function getDaProjectEntry(
  layer: Project<
    'daLayer' | 'display' | 'statuses',
    'isUpcoming' | 'milestones'
  >,
  bridgeSlug: string,
): Promise<DaProjectPageEntry | undefined> {
  const bridges = (
    await ps.getProjects({
      select: ['daBridge', 'display'],
      optional: ['permissions', 'contracts'],
    })
  ).filter((x) => x.daBridge.daLayer === layer.id)

  const selected = bridges.find((x) => x.slug === bridgeSlug)
  if (
    !selected &&
    (bridgeSlug !== 'no-bridge' ||
      layer.daLayer.usedWithoutBridgeIn.length === 0)
  ) {
    return
  }

  const allUsedIn = layer.daLayer.usedWithoutBridgeIn.concat(
    bridges.flatMap((x) => x.daBridge.usedIn),
  )

  const [economicSecurity, tvsPerProject, projectsChangeReport] =
    await Promise.all([
      getDaProjectEconomicSecurity(layer.daLayer.economicSecurity),
      getDaProjectsTvs(allUsedIn.map((x) => x.id)),
      getProjectsChangeReport(),
      api.da.projectChart.prefetch({
        range: 'max',
        projectId: layer.id,
      }),
    ])

  const layerTvs =
    tvsPerProject.reduce((acc, value) => acc + value.tvs, 0) / 100

  const getSumFor = pickTvsForProjects(tvsPerProject)

  const layerGrissiniValues = mapLayerRisksToRosetteValues(
    getDaLayerRisks(layer.daLayer, layerTvs, economicSecurity),
  )
  const bridgeGrissiniValues = mapBridgeRisksToRosetteValues(
    selected?.daBridge.risks ?? { isNoBridge: true },
  )

  const sections = await getRegularDaProjectSections({
    layer: layer,
    bridge: selected,
    isVerified: true,
    projectsChangeReport,
    layerGrissiniValues,
    bridgeGrissiniValues,
  })

  const latestThroughput = layer.daLayer.throughput
    ?.sort((a, b) => a.sinceTimestamp - b.sinceTimestamp)
    .at(-1)

  const result: DaProjectPageEntry = {
    name: layer.name,
    slug: layer.slug,
    kind: layer.daLayer.type,
    type: layer.daLayer.type,
    description: `${layer.display.description} ${selected?.display.description ?? ''}`,
    isUnderReview: layer.statuses.isUnderReview,
    isUpcoming: layer.isUpcoming ?? false,
    selectedBridge: {
      name: selected?.daBridge.name ?? 'No DA Bridge',
      slug: selected?.slug ?? 'no-bridge',
      isNoBridge: !selected || !!selected.daBridge.risks.isNoBridge,
      grissiniValues: bridgeGrissiniValues,
    },
    bridges: bridges.map((bridge) => ({
      name: bridge.daBridge.name,
      slug: bridge.slug,
      isNoBridge: !!bridge.daBridge.risks.isNoBridge,
      grissiniValues: mapBridgeRisksToRosetteValues(bridge.daBridge.risks),
      tvs: getSumFor(bridge.daBridge.usedIn.map((usedIn) => usedIn.id)),
      usedIn: bridge.daBridge.usedIn.sort(
        (a, b) => getSumFor([b.id]) - getSumFor([a.id]),
      ),
    })),
    header: {
      links: getProjectLinks(
        layer.display.links,
        ...bridges.map((x) => x.display.links),
      ),
      daLayerGrissiniValues: layerGrissiniValues,
      daBridgeGrissiniValues: bridgeGrissiniValues,
      tvs: layerTvs,
      economicSecurity,
      durationStorage: layer.daLayer.pruningWindow,
      maxThroughputPerSecond: latestThroughput
        ? latestThroughput.size / latestThroughput.frequency
        : undefined,
      usedIn: allUsedIn.sort((a, b) => getSumFor([b.id]) - getSumFor([a.id])),
    },
    sections,
    projectVariants: bridges.map((bridge) => ({
      title: bridge.daBridge.name,
      href: `/data-availability/projects/${layer.slug}/${bridge.slug}`,
    })),
  }

  if (layer.daLayer.usedWithoutBridgeIn.length > 0) {
    result.bridges.unshift({
      slug: 'no-bridge',
      isNoBridge: true,
      grissiniValues: mapBridgeRisksToRosetteValues({ isNoBridge: true }),
      name: 'No DA Bridge',
      tvs: getSumFor(layer.daLayer.usedWithoutBridgeIn.map((x) => x.id)),
      usedIn: layer.daLayer.usedWithoutBridgeIn,
    })
    result.projectVariants?.unshift({
      title: 'No DA Bridge',
      href: `/data-availability/projects/${layer.slug}/no-bridge`,
    })
  }

  return result
}

export async function getEthereumDaProjectEntry(
  layer: Project<'daLayer' | 'display' | 'statuses', 'isUpcoming'>,
  bridge: Project<'daBridge' | 'display', 'contracts'>,
): Promise<EthereumDaProjectPageEntry> {
  const layerGrissiniValues = mapLayerRisksToRosetteValues(layer.daLayer.risks)
  const bridgeGrissiniValues = mapBridgeRisksToRosetteValues(
    bridge.daBridge.risks,
  )

  const [economicSecurity, tvsPerProject, sections] = await Promise.all([
    getDaProjectEconomicSecurity(layer.daLayer.economicSecurity),
    getDaProjectsTvs(bridge.daBridge.usedIn.map((x) => x.id)),
    getEthereumDaProjectSections({
      layer,
      bridge,
      isVerified: true,
      layerGrissiniValues,
      bridgeGrissiniValues,
    }),
  ])

  const layerTvs =
    tvsPerProject.reduce((acc, value) => acc + value.tvs, 0) / 100

  const getSumFor = pickTvsForProjects(tvsPerProject)

  const usedInByTvsDesc = bridge.daBridge.usedIn.sort(
    (a, b) => getSumFor([b.id]) - getSumFor([a.id]),
  )

  const latestThroughput = layer.daLayer.throughput
    ?.sort((a, b) => a.sinceTimestamp - b.sinceTimestamp)
    .at(-1)

  return {
    name: layer.name,
    slug: layer.slug,
    kind: layer.daLayer.type,
    type: layer.daLayer.type,
    description: `${layer.display.description} ${bridge.display.description}`,
    isUnderReview: layer.statuses.isUnderReview,
    isUpcoming: false,
    header: {
      links: getProjectLinks(layer.display.links),
      tvs: layerTvs,
      economicSecurity: economicSecurity,
      durationStorage: layer.daLayer.pruningWindow ?? 0,
      maxThroughputPerSecond: latestThroughput
        ? latestThroughput.size / latestThroughput.frequency
        : undefined,
      usedIn: usedInByTvsDesc,
      bridgeName: bridge.daBridge.name,
      callout: {
        title: bridge.daBridge.name,
        description: bridge.daBridge.risks.callout ?? '',
      },
    },
    sections,
  }
}
