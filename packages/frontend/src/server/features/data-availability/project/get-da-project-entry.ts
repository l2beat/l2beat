import {
  type BlockchainDaLayer,
  type DaBridge,
  type DaLayer,
  type DaLayerThroughput,
  type DacBridge,
  type DacDaLayer,
  type EthereumDaLayer,
  type NoDaBridge,
  type OnChainDaBridge,
  isDaBridgeVerified,
} from '@l2beat/config'
import { getContractsVerificationStatuses } from '@l2beat/config'
import { type UsedInProject } from '@l2beat/config/build/src/projects/other/da-beat/types/UsedInProject'
import {
  mapBridgeRisksToRosetteValues,
  mapLayerRisksToRosetteValues,
} from '~/app/(side-nav)/data-availability/_utils/map-risks-to-rosette-values'
import {
  getEthereumDaProjectSections,
  getRegularDaProjectSections,
} from '~/app/(top-nav)/data-availability/projects/[layer]/_utils/da-project-sections'
import { type ProjectLink } from '~/components/projects/links/types'
import { type ProjectDetailsSection } from '~/components/projects/sections/types'
import { type RosetteValue } from '~/components/rosette/types'
import { getDataAvailabilityProjectLinks } from '~/utils/project/get-project-links'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import {
  getDaProjectsTvl,
  pickTvlForProjects,
} from '../utils/get-da-projects-tvl'
import { getDaRisks } from '../utils/get-da-risks'
import { kindToType } from '../utils/kind-to-layer-type'
import {
  type EconomicSecurityData,
  getDaProjectEconomicSecurity,
} from './utils/get-da-project-economic-security'

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
    type: Exclude<DaBridge['type'], 'Enshrined'>
    grissiniValues: RosetteValue[]
  }
  bridges: {
    id: string
    name: string
    slug: string
    grissiniValues: RosetteValue[]
    tvs: number
    type: Exclude<DaBridge['type'], 'Enshrined'>
    usedIn: UsedInProject[]
  }[]
  header: {
    daLayerGrissiniValues: RosetteValue[]
    daBridgeGrissiniValues: RosetteValue[]
    tvs: number
    links: ProjectLink[]
    economicSecurity: EconomicSecurityData | undefined
    durationStorage: number | undefined
    throughput: DaLayerThroughput | undefined
    numberOfOperators: number | undefined
    usedIn: UsedInProject[]
  }
  sections: ProjectDetailsSection[]
}

export interface EthereumDaProjectPageEntry extends CommonDaProjectPageEntry {
  header: {
    links: ProjectLink[]
    tvs: number
    economicSecurity: EconomicSecurityData | undefined
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

export async function getCommonDaProjectPageEntry(
  daLayer: DaLayer,
  daBridge: DaBridge,
): Promise<CommonDaProjectPageEntry> {
  const isVerified = isDaBridgeVerified(daLayer, daBridge)

  return {
    isVerified,
    name: daLayer.display.name,
    slug: daLayer.display.slug,
    kind: daLayer.kind,
    type: kindToType(daLayer.kind),
    description: `${daLayer.display.description} ${daBridge.display.description}`,
    isUnderReview: daLayer.isUnderReview ?? false,
    isUpcoming: daLayer.isUpcoming ?? false,
  }
}

export async function getDaProjectEntry(
  daLayer: BlockchainDaLayer | DacDaLayer,
  daBridge: OnChainDaBridge | DacBridge | NoDaBridge,
): Promise<DaProjectPageEntry> {
  const common = await getCommonDaProjectPageEntry(daLayer, daBridge)

  const uniqueProjectsInUse = getUniqueProjectsInUse(daLayer)

  const [
    economicSecurity,
    tvlPerProject,
    contractsVerificationStatuses,
    projectsChangeReport,
  ] = await Promise.all([
    getDaProjectEconomicSecurity(daLayer),
    getDaProjectsTvl(uniqueProjectsInUse),
    getContractsVerificationStatuses(daLayer),
    getProjectsChangeReport(),
  ])

  const layerTvs =
    tvlPerProject.reduce((acc, value) => acc + value.tvl, 0) / 100

  const getSumFor = pickTvlForProjects(tvlPerProject)

  const evaluatedRisks = getDaRisks(
    daLayer,
    daBridge,
    layerTvs,
    economicSecurity,
  )

  const layerGrissiniValues = mapLayerRisksToRosetteValues(evaluatedRisks)
  const bridgeGrissiniValues = mapBridgeRisksToRosetteValues(evaluatedRisks)

  const sections = getRegularDaProjectSections({
    daLayer,
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
      id: daBridge.id,
      name: daBridge.display.name,
      slug: daBridge.display.slug,
      type: daBridge.type,
      grissiniValues: bridgeGrissiniValues,
    },
    bridges: daLayer.bridges.map((bridge) => ({
      id: bridge.id,
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
      links: getDataAvailabilityProjectLinks(daLayer),
      daLayerGrissiniValues: layerGrissiniValues,
      daBridgeGrissiniValues: bridgeGrissiniValues,
      tvs: layerTvs,
      economicSecurity,
      durationStorage:
        daLayer.kind === 'PublicBlockchain' ? daLayer.pruningWindow : undefined,
      throughput:
        daLayer.kind === 'PublicBlockchain' ? daLayer.throughput : undefined,
      numberOfOperators: daLayer.numberOfOperators,
      usedIn: daLayer.bridges
        .flatMap((bridge) => bridge.usedIn)
        .sort((a, b) => getSumFor([b.id]) - getSumFor([a.id])),
    },
    sections,
    projectVariants: daLayer.bridges.map((bridge) => ({
      title: bridge.display.name,
      href: `/data-availability/projects/${daLayer.display.slug}/${bridge.display.slug}`,
    })),
  }
}

export async function getEthereumDaProjectEntry(
  daLayer: EthereumDaLayer,
): Promise<EthereumDaProjectPageEntry> {
  const [daBridge] = daLayer.bridges
  const common = await getCommonDaProjectPageEntry(daLayer, daBridge)

  const uniqueProjectsInUse = getUniqueProjectsInUse(daLayer)

  const [economicSecurity, tvlPerProject] = await Promise.all([
    getDaProjectEconomicSecurity(daLayer),
    getDaProjectsTvl(uniqueProjectsInUse),
  ])

  const layerTvs =
    tvlPerProject.reduce((acc, value) => acc + value.tvl, 0) / 100

  const layerGrissiniValue = mapLayerRisksToRosetteValues(daLayer.risks)
  const bridgeGrissiniValue = mapBridgeRisksToRosetteValues(daBridge.risks)

  const evaluatedGrissiniValues = [
    ...layerGrissiniValue,
    ...bridgeGrissiniValue,
  ]

  const getSumFor = pickTvlForProjects(tvlPerProject)

  const sections = getEthereumDaProjectSections({
    daLayer,
    daBridge,
    isVerified: common.isVerified,
    evaluatedGrissiniValues,
  })

  const { usedIn } = daLayer.bridges[0]
  const usedInByTvlDesc = usedIn.sort(
    (a, b) => getSumFor([b.id]) - getSumFor([a.id]),
  )

  return {
    ...common,
    header: {
      links: getDataAvailabilityProjectLinks(daLayer),
      tvs: layerTvs,
      economicSecurity: economicSecurity,
      durationStorage: daLayer.pruningWindow,
      throughput: daLayer.throughput,
      usedIn: usedInByTvlDesc,
      bridgeName: daBridge.display.name,
      callout: {
        title: daBridge.display.name,
        description: daBridge.callout,
      },
    },
    sections,
  }
}

function getUniqueProjectsInUse(daLayer: DaLayer) {
  return [
    ...new Set(
      daLayer.bridges.flatMap((bridge) => bridge.usedIn.map((p) => p.id)),
    ),
  ]
}
