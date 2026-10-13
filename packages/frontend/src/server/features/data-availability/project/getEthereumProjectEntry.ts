import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import type { ProjectLink } from '~/components/projects/links/types'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import {
  type EthereumProject,
  getEthereumProjectSections,
} from '~/pages/ethereum/utils/getEthereumProjectSections'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import { getProjectLinks } from '~/utils/project/getProjectLinks'
import {
  mapBridgeRisksToRosetteValues,
  mapLayerRisksToRosetteValues,
} from '~/utils/project/mapDaRisksToRosetteValues'
import { getProjectInteropData } from '../../layer2s/interop/getProjectInteropData'
import { getDaLayerRisks } from '../utils/getDaLayerRisks'
import { getDaProjectsTvs, pickTvsForProjects } from '../utils/getDaProjectsTvs'
import { getDaProjectEconomicSecurity } from './utils/getDaProjectEconomicSecurity'
import { getDaProjectValidators } from './utils/getDaProjectValidators'

export interface EthereumProjectPageEntry {
  name: string
  slug: string
  icon: string
  type: string
  description: string
  isUnderReview: boolean
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
    numberOfValidators: number | undefined
  }
  sections: ProjectDetailsSection[]
}

/** Ethereum's DA bridge is enshrined: the layer and the bridge are one project. */
export async function getEthereumProjectEntry(
  ethereum: EthereumProject,
): Promise<EthereumProjectPageEntry> {
  const layerGrissiniValues = mapLayerRisksToRosetteValues(
    getDaLayerRisks(ethereum.daLayer),
  )
  const bridgeGrissiniValues = mapBridgeRisksToRosetteValues(
    ethereum.daBridge.risks,
  )

  const interopProjects = await ps.getProjects({
    select: ['interopConfig'],
  })
  const interopData = await getProjectInteropData(ethereum.id, interopProjects)

  const [economicSecurity, tvsPerProject, sections, validators] =
    await Promise.all([
      getDaProjectEconomicSecurity(
        ethereum.id,
        ethereum.daLayer.economicSecurity,
      ),
      getDaProjectsTvs(ethereum.daBridge.usedIn.map((x) => x.id)),
      getEthereumProjectSections({
        ethereum,
        layerGrissiniValues,
        bridgeGrissiniValues,
        interopData,
      }),
      getDaProjectValidators(ethereum.id, ethereum.daLayer.validators),
    ])

  const layerTvs = tvsPerProject.reduce((acc, value) => acc + value.tvs, 0)

  const getSumFor = pickTvsForProjects(tvsPerProject)

  const usedInByTvsDesc = ethereum.daBridge.usedIn
    .sort((a, b) => getSumFor([b.id]).latest - getSumFor([a.id]).latest)
    .map((x) => ({
      ...x,
      icon: manifest.getUrl(`/icons/${x.slug}.png`),
      url: `/layer2s/projects/${x.slug}`,
    }))

  const latestThroughput = ethereum.daLayer.throughput
    ?.sort((a, b) => a.sinceTimestamp - b.sinceTimestamp)
    .at(-1)

  return {
    name: ethereum.name,
    slug: ethereum.slug,
    icon: manifest.getUrl(`/icons/${ethereum.slug}.png`),
    type: ethereum.daLayer.type,
    description: ethereum.display.description,
    isUnderReview: !!ethereum.statuses.reviewStatus,
    header: {
      links: getProjectLinks(ethereum.display.links),
      tvs: layerTvs,
      economicSecurity: economicSecurity,
      durationStorage: ethereum.daLayer.pruningWindow ?? 0,
      maxThroughputPerSecond: latestThroughput
        ? latestThroughput.size === 'NO_CAP'
          ? undefined
          : latestThroughput.size / latestThroughput.frequency
        : undefined,
      usedIn: usedInByTvsDesc,
      bridgeName: ethereum.daBridge.name,
      callout: {
        title: ethereum.daBridge.name,
        description: ethereum.daBridge.risks.callout ?? '',
      },
      numberOfValidators: validators,
    },
    sections,
  }
}
