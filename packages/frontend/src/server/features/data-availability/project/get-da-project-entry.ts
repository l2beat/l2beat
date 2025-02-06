import type {
  DaLayer,
  DaLayerThroughput,
  Project,
  UsedInProject,
} from '@l2beat/config'
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
import { getProjectLinks } from '~/utils/project/get-project-links'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import { getDaBridges } from '../utils/get-da-bridges'
import {
  getDaProjectsTvs,
  pickTvsForProjects,
} from '../utils/get-da-projects-tvs'
import { getDaRisks } from '../utils/get-da-risks'
import { getDaProjectEconomicSecurity } from './utils/get-da-project-economic-security'

interface CommonDaProjectPageEntry {
  isVerified: boolean
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
    id: string
    name: string
    slug: string
    isNoBridge: boolean
    grissiniValues: RosetteValue[]
  }
  bridges: {
    id: string
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
    throughput: DaLayerThroughput | undefined
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
    throughput: DaLayerThroughput | undefined
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
  bridge: Project<
    'daBridge' | 'display' | 'statuses',
    'permissions' | 'contracts'
  >,
): Promise<DaProjectPageEntry> {
  const common = {
    isVerified: !bridge ? true : !bridge.statuses.isUnverified,
    name: layer.name,
    slug: layer.slug,
    kind: layer.daLayer.type,
    type: layer.daLayer.type,
    description: `${layer.display.description} ${bridge?.display.description ?? ''}`,
    isUnderReview: layer.statuses.isUnderReview,
    isUpcoming: layer.isUpcoming ?? false,
  }

  const allBridges = (
    await ps.getProjects({
      select: ['daBridge'],
    })
  ).filter((x) => x.daBridge.daLayer === layer.id)

  const allUsedIn = layer.daLayer.usedWithoutBridgeIn.concat(
    allBridges.flatMap((x) => x.daBridge.usedIn),
  )

  const [economicSecurity, tvsPerProject, projectsChangeReport] =
    await Promise.all([
      getDaProjectEconomicSecurity(layer.daLayer.economicSecurity),
      getDaProjectsTvs(allUsedIn.map((x) => x.id)),
      getProjectsChangeReport(),
    ])

  const layerTvs =
    tvsPerProject.reduce((acc, value) => acc + value.tvs, 0) / 100

  const getSumFor = pickTvsForProjects(tvsPerProject)

  const evaluatedRisks = getDaRisks(
    layer.daLayer,
    bridge.daBridge,
    layerTvs,
    economicSecurity,
  )

  const layerGrissiniValues = mapLayerRisksToRosetteValues(evaluatedRisks)
  const bridgeGrissiniValues = mapBridgeRisksToRosetteValues(evaluatedRisks)

  const sections = getRegularDaProjectSections({
    layer: layer,
    bridge,
    isVerified: common.isVerified,
    projectsChangeReport,
    layerGrissiniValues,
    bridgeGrissiniValues,
  })

  return {
    ...common,
    selectedBridge: {
      id: bridge.id ?? 'unknown',
      name: bridge.name,
      slug: bridge.slug,
      isNoBridge: !!bridge.daBridge.risks.isNoBridge,
      grissiniValues: bridgeGrissiniValues,
    },
    bridges: getDaBridges(layer).map((bridge) => ({
      id: bridge.id ?? 'unknown',
      name: bridge.display.name,
      slug: bridge.display.slug,
      isNoBridge: !!bridge.risks.isNoBridge,
      grissiniValues: mapBridgeRisksToRosetteValues(bridge.risks),
      tvs: getSumFor(bridge.daBridge.usedIn.map((usedIn) => usedIn.id)),
      usedIn: bridge.usedIn.sort(
        (a, b) => getSumFor([b.id]) - getSumFor([a.id]),
      ),
    })),
    header: {
      links: getProjectLinks(layer.display.links),
      daLayerGrissiniValues: layerGrissiniValues,
      daBridgeGrissiniValues: bridgeGrissiniValues,
      tvs: layerTvs,
      economicSecurity,
      durationStorage: layer.daLayer.pruningWindow,
      throughput: layer.daLayer.throughput,
      usedIn: allUsedIn.sort((a, b) => getSumFor([b.id]) - getSumFor([a.id])),
    },
    sections,
    projectVariants: getDaBridges(layer).map((bridge) => ({
      title: bridge.display.name,
      href: `/data-availability/projects/${layer.slug}/${bridge.display.slug}`,
    })),
  }
}

export async function getEthereumDaProjectEntry(
  layer: Project<'daLayer' | 'display' | 'statuses', 'isUpcoming'>,
  bridge: Project<'daBridge' | 'display', 'contracts'>,
): Promise<EthereumDaProjectPageEntry> {
  const [economicSecurity, tvsPerProject] = await Promise.all([
    getDaProjectEconomicSecurity(layer.daLayer.economicSecurity),
    getDaProjectsTvs(bridge.daBridge.usedIn.map((x) => x.id)),
  ])

  const layerTvs =
    tvsPerProject.reduce((acc, value) => acc + value.tvs, 0) / 100

  const layerGrissiniValues = mapLayerRisksToRosetteValues(layer.daLayer.risks)
  const bridgeGrissiniValues = mapBridgeRisksToRosetteValues(
    bridge.daBridge.risks,
  )

  const getSumFor = pickTvsForProjects(tvsPerProject)

  const sections = getEthereumDaProjectSections({
    layer,
    bridge,
    isVerified: true,
    layerGrissiniValues,
    bridgeGrissiniValues,
  })

  const usedInByTvsDesc = bridge.daBridge.usedIn.sort(
    (a, b) => getSumFor([b.id]) - getSumFor([a.id]),
  )

  return {
    isVerified: true,
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
      throughput: layer.daLayer.throughput,
      usedIn: usedInByTvsDesc,
      bridgeName: bridge.name,
      callout: {
        title: bridge.name,
        description: bridge.daBridge.risks.callout ?? '',
      },
    },
    sections,
  }
}
