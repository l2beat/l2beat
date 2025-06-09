import type { Project, ProjectStatuses } from '@l2beat/config'
import type { ProjectLink } from '~/components/projects/links/types'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { RosetteValue } from '~/components/rosette/types'
import {
  getEthereumDaProjectSections,
  getRegularDaProjectSections,
} from '~/pages/data-availability/project/utils/DaProjectSections'
import type { UsedInProjectWithIcon } from '~/pages/data-availability/summary/components/table/ProjectsUsedIn'
import {
  mapBridgeRisksToRosetteValues,
  mapLayerRisksToRosetteValues,
} from '~/pages/data-availability/utils/MapRisksToRosetteValues'
import { ps } from '~/server/projects'
import type { ExpressHelpers } from '~/trpc/server'
import { getProjectLinks } from '~/utils/project/getProjectLinks'
import { getProjectsChangeReport } from '../../projects-change-report/getProjectsChangeReport'
import { getProjectIcon } from '../../utils/getProjectIcon'
import { getDaLayerRisks } from '../utils/getDaLayerRisks'
import { getDaProjectsTvs, pickTvsForProjects } from '../utils/getDaProjectsTvs'
import { getDaProjectEconomicSecurity } from './utils/getDaProjectEconomicSecurity'

interface CommonDaProjectPageEntry {
  name: string
  slug: string
  icon: string
  kind: string
  type: string
  description: string
  isUnderReview: boolean
  isUpcoming: boolean
  archivedAt: number | undefined
  projectVariants?: {
    title: string
    href: string
  }[]
}

export interface DaProjectPageEntry extends CommonDaProjectPageEntry {
  entryType: 'common'
  selectedBridge: {
    name: string
    slug: string
    isNoBridge: boolean
    grissiniValues: RosetteValue[]
  }
  bridges: {
    name: string
    slug: string
    statuses: ProjectStatuses | undefined
    isNoBridge: boolean
    grissiniValues: RosetteValue[]
    tvs: number
    usedIn: UsedInProjectWithIcon[]
  }[]
  header: {
    daLayerGrissiniValues: RosetteValue[]
    daBridgeGrissiniValues: RosetteValue[]
    tvs: number
    links: ProjectLink[]
    economicSecurity: number | undefined
    durationStorage: number | undefined
    maxThroughputPerSecond: number | undefined
    usedIn: UsedInProjectWithIcon[]
  }
  sections: ProjectDetailsSection[]
  discoUiHref?: string
}

export interface EthereumDaProjectPageEntry extends CommonDaProjectPageEntry {
  entryType: 'ethereum'
  header: {
    links: ProjectLink[]
    tvs: number
    economicSecurity: number | undefined
    durationStorage: number
    maxThroughputPerSecond: number | undefined
    usedIn: UsedInProjectWithIcon[]
    bridgeName: string
    callout: {
      title: string
      description: string
    }
  }
  sections: ProjectDetailsSection[]
}

export async function getDaProjectEntry(
  helpers: ExpressHelpers,
  layer: Project<
    'daLayer' | 'display' | 'statuses',
    'isUpcoming' | 'milestones' | 'archivedAt'
  >,
  bridgeSlug: string,
): Promise<DaProjectPageEntry | undefined> {
  const bridges = (
    await ps.getProjects({
      select: ['daBridge', 'display', 'statuses'],
      optional: ['permissions', 'contracts'],
    })
  ).filter((x) => x.daBridge.daLayer === layer.id)

  const selected = bridges.find((x) => x.slug === bridgeSlug)
  if (
    !selected &&
    bridgeSlug !== 'no-bridge' &&
    layer.daLayer.usedWithoutBridgeIn.length === 0
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
    ])

  const layerTvs = tvsPerProject.reduce((acc, value) => acc + value.tvs, 0)

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
    helpers,
  })
  const latestThroughput = layer.daLayer.throughput
    ?.sort((a, b) => a.sinceTimestamp - b.sinceTimestamp)
    .at(-1)

  const result: DaProjectPageEntry = {
    entryType: 'common',
    name: layer.name,
    slug: layer.slug,
    icon: getProjectIcon(layer.slug),
    kind: layer.daLayer.type,
    type: layer.daLayer.type,
    description: `${layer.display.description} ${selected?.display.description ?? ''}`,
    isUnderReview: !!layer.statuses.reviewStatus,
    isUpcoming: layer.isUpcoming ?? false,
    archivedAt: layer.archivedAt,
    selectedBridge: {
      name: selected?.daBridge.name ?? 'No DA Bridge',
      slug: selected?.slug ?? 'no-bridge',
      isNoBridge: !selected || !!selected.daBridge.risks.isNoBridge,
      grissiniValues: bridgeGrissiniValues,
    },
    bridges: bridges.map((bridge) => ({
      name: bridge.daBridge.name,
      slug: bridge.slug,
      statuses: bridge.statuses,
      isNoBridge: !!bridge.daBridge.risks.isNoBridge,
      grissiniValues: mapBridgeRisksToRosetteValues(bridge.daBridge.risks),
      tvs: getSumFor(bridge.daBridge.usedIn.map((usedIn) => usedIn.id)).latest,
      usedIn: bridge.daBridge.usedIn
        .sort((a, b) => getSumFor([b.id]).latest - getSumFor([a.id]).latest)
        .map((x) => ({
          ...x,
          icon: getProjectIcon(x.slug),
        })),
    })),
    header: {
      links: getProjectLinks(
        layer.display.links,
        ...bridges.filter((x) => x.id !== layer.id).map((x) => x.display.links),
      ),
      daLayerGrissiniValues: layerGrissiniValues,
      daBridgeGrissiniValues: bridgeGrissiniValues,
      tvs: layerTvs,
      economicSecurity,
      durationStorage: layer.daLayer.pruningWindow,
      maxThroughputPerSecond: latestThroughput
        ? latestThroughput.size / latestThroughput.frequency
        : undefined,
      usedIn: allUsedIn
        .sort((a, b) => getSumFor([b.id]).latest - getSumFor([a.id]).latest)
        .map((x) => ({
          ...x,
          icon: getProjectIcon(x.slug),
        })),
    },
    sections,
    projectVariants: bridges.map((bridge) => ({
      title: bridge.daBridge.name,
      href: `/data-availability/projects/${layer.slug}/${bridge.slug}`,
    })),
    discoUiHref: selected
      ? `https://disco.l2beat.com/ui/p/${selected.id}`
      : undefined,
  }

  if (layer.daLayer.usedWithoutBridgeIn.length > 0) {
    result.bridges.unshift({
      slug: 'no-bridge',
      isNoBridge: true,
      statuses: undefined,
      grissiniValues: mapBridgeRisksToRosetteValues({ isNoBridge: true }),
      name: 'No DA Bridge',
      tvs: getSumFor(layer.daLayer.usedWithoutBridgeIn.map((x) => x.id)).latest,
      usedIn: layer.daLayer.usedWithoutBridgeIn.map((x) => ({
        ...x,
        icon: getProjectIcon(x.slug),
      })),
    })
    result.projectVariants?.unshift({
      title: 'No DA Bridge',
      href: `/data-availability/projects/${layer.slug}/no-bridge`,
    })
  }

  return result
}

export async function getEthereumDaProjectEntry(
  helpers: ExpressHelpers,
  layer: Project<
    'daLayer' | 'display' | 'statuses',
    'isUpcoming' | 'milestones'
  >,
  bridge: Project<'daBridge' | 'display', 'contracts' | 'permissions'>,
): Promise<EthereumDaProjectPageEntry> {
  const layerGrissiniValues = mapLayerRisksToRosetteValues(
    getDaLayerRisks(layer.daLayer),
  )
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
      helpers,
    }),
  ])

  const layerTvs = tvsPerProject.reduce((acc, value) => acc + value.tvs, 0)

  const getSumFor = pickTvsForProjects(tvsPerProject)

  const usedInByTvsDesc = bridge.daBridge.usedIn
    .sort((a, b) => getSumFor([b.id]).latest - getSumFor([a.id]).latest)
    .map((x) => ({
      ...x,
      icon: getProjectIcon(x.slug),
    }))

  const latestThroughput = layer.daLayer.throughput
    ?.sort((a, b) => a.sinceTimestamp - b.sinceTimestamp)
    .at(-1)

  return {
    entryType: 'ethereum',
    name: layer.name,
    slug: layer.slug,
    icon: getProjectIcon(layer.slug),
    kind: layer.daLayer.type,
    type: layer.daLayer.type,
    description: `${layer.display.description} ${bridge.display.description}`,
    isUnderReview: !!layer.statuses.reviewStatus,
    isUpcoming: false,
    archivedAt: undefined,
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
