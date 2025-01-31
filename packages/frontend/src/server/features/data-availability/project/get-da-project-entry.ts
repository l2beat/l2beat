import type {
  DaBridge,
  DaLayer,
  DaLayerThroughput,
  DaProject,
  EthereumDaProject,
} from '@l2beat/config'
import { isDaBridgeVerified } from '@l2beat/config'
import { getContractsVerificationStatuses } from '@l2beat/config'
import type { UsedInProject } from '@l2beat/config'
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
import { getProjectLinks } from '~/utils/project/get-project-links'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import { excludeRedundantNoBridge } from '../utils/exclude-redundant-nobridge'
import {
  getDaProjectsTvs,
  pickTvsForProjects,
} from '../utils/get-da-projects-tvs'
import { getDaRisks } from '../utils/get-da-risks'
import { kindToType } from '../utils/kind-to-layer-type'
import { getDaProjectEconomicSecurity } from './utils/get-da-project-economic-security'

interface CommonDaProjectPageEntry {
  isVerified: boolean
  name: string
  slug: string
  kind: DaLayer['kind']
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
    type: DaBridge['type']
    grissiniValues: RosetteValue[]
  }
  bridges: {
    id: string
    name: string
    slug: string
    grissiniValues: RosetteValue[]
    tvs: number
    type: DaBridge['type']
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
  project: DaProject,
  daBridge: DaBridge,
): Promise<DaProjectPageEntry> {
  const common = {
    isVerified: isDaBridgeVerified(daBridge),
    name: project.display.name,
    slug: project.display.slug,
    kind: project.daLayer.kind,
    type: kindToType(project.daLayer.kind),
    description: `${project.display.description} ${daBridge.display.description}`,
    isUnderReview: project.isUnderReview ?? false,
    isUpcoming: project.isUpcoming ?? false,
  }

  const uniqueProjectsInUse = getUniqueProjectsInUse(project.daLayer.bridges)

  const [
    economicSecurity,
    tvsPerProject,
    contractsVerificationStatuses,
    projectsChangeReport,
  ] = await Promise.all([
    getDaProjectEconomicSecurity(project.daLayer.economicSecurity),
    getDaProjectsTvs(uniqueProjectsInUse),
    getContractsVerificationStatuses(project),
    getProjectsChangeReport(),
  ])

  const layerTvs =
    tvsPerProject.reduce((acc, value) => acc + value.tvs, 0) / 100

  const getSumFor = pickTvsForProjects(tvsPerProject)

  const evaluatedRisks = getDaRisks(
    project.daLayer,
    daBridge,
    layerTvs,
    economicSecurity,
  )

  const layerGrissiniValues = mapLayerRisksToRosetteValues(evaluatedRisks)
  const bridgeGrissiniValues = mapBridgeRisksToRosetteValues(evaluatedRisks)

  const sections = getRegularDaProjectSections({
    daLayer: project,
    daBridge,
    isVerified: common.isVerified,
    contractsVerificationStatuses,
    projectsChangeReport,
    layerGrissiniValues,
    bridgeGrissiniValues,
  })

  return {
    ...common,
    selectedBridge: {
      id: daBridge.id ?? 'unknown',
      name: daBridge.display.name,
      slug: daBridge.display.slug,
      type: daBridge.type,
      grissiniValues: bridgeGrissiniValues,
    },
    bridges: project.daLayer.bridges
      .filter(excludeRedundantNoBridge)
      .map((bridge) => ({
        id: bridge.id ?? 'unknown',
        name: bridge.display.name,
        slug: bridge.display.slug,
        grissiniValues: mapBridgeRisksToRosetteValues(bridge.risks),
        tvs: getSumFor(bridge.usedIn.map((project) => project.id)),
        type: bridge.type,
        usedIn: bridge.usedIn.sort(
          (a, b) => getSumFor([b.id]) - getSumFor([a.id]),
        ),
      })),
    header: {
      links: getProjectLinks(project.display.links),
      daLayerGrissiniValues: layerGrissiniValues,
      daBridgeGrissiniValues: bridgeGrissiniValues,
      tvs: layerTvs,
      economicSecurity,
      durationStorage: project.daLayer.pruningWindow,
      throughput: project.daLayer.throughput,
      usedIn: project.daLayer.bridges
        .flatMap((bridge) => bridge.usedIn)
        .sort((a, b) => getSumFor([b.id]) - getSumFor([a.id])),
    },
    sections,
    projectVariants: project.daLayer.bridges.map((bridge) => ({
      title: bridge.display.name,
      href: `/data-availability/projects/${project.display.slug}/${bridge.display.slug}`,
    })),
  }
}

export async function getEthereumDaProjectEntry(
  project: EthereumDaProject,
): Promise<EthereumDaProjectPageEntry> {
  const [daBridge] = project.daLayer.bridges
  if (!daBridge) {
    throw new Error('Ethereum bridge missing')
  }
  const common = {
    isVerified: true,
    name: project.display.name,
    slug: project.display.slug,
    kind: project.daLayer.kind,
    type: kindToType(project.daLayer.kind),
    description: `${project.display.description} ${daBridge.display.description}`,
    isUnderReview: project.isUnderReview ?? false,
    isUpcoming: project.isUpcoming ?? false,
  }

  const [economicSecurity, tvsPerProject] = await Promise.all([
    getDaProjectEconomicSecurity(project.daLayer.economicSecurity),
    getDaProjectsTvs(daBridge.usedIn.map((x) => x.id)),
  ])

  const layerTvs =
    tvsPerProject.reduce((acc, value) => acc + value.tvs, 0) / 100

  const layerGrissiniValues = mapLayerRisksToRosetteValues(
    project.daLayer.risks,
  )
  const bridgeGrissiniValues = mapBridgeRisksToRosetteValues(daBridge.risks)

  const getSumFor = pickTvsForProjects(tvsPerProject)

  const sections = getEthereumDaProjectSections({
    daLayer: project,
    daBridge,
    isVerified: common.isVerified,
    layerGrissiniValues,
    bridgeGrissiniValues,
  })

  const usedInByTvsDesc = daBridge.usedIn.sort(
    (a, b) => getSumFor([b.id]) - getSumFor([a.id]),
  )

  return {
    ...common,
    header: {
      links: getProjectLinks(project.display.links),
      tvs: layerTvs,
      economicSecurity: economicSecurity,
      durationStorage: project.daLayer.pruningWindow ?? 0,
      throughput: project.daLayer.throughput,
      usedIn: usedInByTvsDesc,
      bridgeName: daBridge.display.name,
      callout: {
        title: daBridge.display.name,
        description: daBridge.callout,
      },
    },
    sections,
  }
}

function getUniqueProjectsInUse(bridges: DaBridge[]) {
  return [
    ...new Set(bridges.flatMap((bridge) => bridge.usedIn.map((p) => p.id))),
  ]
}
