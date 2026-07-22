import type { Project, ProjectRedWarning } from '@l2beat/config'
import type { ProjectId } from '@l2beat/shared-pure'
import type { ProjectLink } from '~/components/projects/links/types'
import type { BadgeWithParams } from '~/components/projects/ProjectBadge'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import { MAX_SELECTED_CHAINS } from '~/pages/interop/components/flows/consts'
import type { InteropSelection } from '~/pages/interop/utils/types'
import {
  countRecentDiscoveryUpdates,
  getDiscoveryUpdates,
} from '~/server/features/projects/recent-changes/getDiscoveryUpdates'
import { getProjectsChangeReport } from '~/server/features/projects-change-report/getProjectsChangeReport'
import type { InteropProtocolDashboardData } from '~/server/features/scaling/interop/getInteropProtocolData'
import { get7dTvsBreakdown } from '~/server/features/scaling/tvs/get7dTvsBreakdown'
import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import { getContractsSection } from '~/utils/project/contracts-and-permissions/getContractsSection'
import { getContractUtils } from '~/utils/project/contracts-and-permissions/getContractUtils'
import { getPermissionsSection } from '~/utils/project/contracts-and-permissions/getPermissionsSection'
import { getProjectLinks } from '~/utils/project/getProjectLinks'
import {
  getUnderReviewStatus,
  type UnderReviewStatus,
} from '~/utils/project/underReview'

export interface InteropProtocolEntry {
  id: ProjectId
  name: string
  shortName: string | undefined
  slug: string
  icon: string
  underReviewStatus: UnderReviewStatus
  header: {
    warning?: string
    redWarning?: ProjectRedWarning
    emergencyWarning?: string
    recentUpdatesCount: number
    description?: string
    detailedDescription?: string
    badges?: BadgeWithParams[]
    links?: ProjectLink[]
    hostChain?: string
  }
  sections: ProjectDetailsSection[]
}

export async function getInteropProtocolEntry(
  project: Project<'interopConfig', 'display' | 'statuses' | 'discoveryInfo'>,
  apiSelection: InteropSelection,
  interopChains: InteropChainWithIcon[],
  data: InteropProtocolDashboardData,
): Promise<InteropProtocolEntry> {
  const isUnderReview = !!project.statuses?.reviewStatus
  const discoveryUpdates = project.discoveryInfo?.hasDiscoUi
    ? getDiscoveryUpdates(project.id)
    : []

  const header: InteropProtocolEntry['header'] = {
    description: project.interopConfig.description,
    detailedDescription: project.interopConfig.detailedDescription,
    warning: project.statuses?.yellowWarning,
    redWarning: project.statuses?.redWarning,
    emergencyWarning: project.statuses?.emergencyWarning,
    recentUpdatesCount: countRecentDiscoveryUpdates(discoveryUpdates),
    links: project.display?.links
      ? getProjectLinks(project.display.links)
      : undefined,
  }

  const sections: ProjectDetailsSection[] = []

  if (data?.entry) {
    const sortedChains = sortChainsByFlowVolume(interopChains, data.flows)
    const defaultSelectedChains = sortedChains
      .slice(0, MAX_SELECTED_CHAINS)
      .map((chain) => chain.id)

    if (data.flows.length > 0) {
      sections.push({
        type: 'InteropVolumeSection',
        props: {
          id: 'interop-volume',
          title: 'Volume and flows',
          entry: data.entry,
          interopChains: sortedChains,
          defaultSelectedChains,
        },
      })
    }

    if (header.detailedDescription) {
      sections.push({
        type: 'DetailedDescriptionSection',
        props: {
          id: 'detailed-description',
          title: 'Description',
          description: header.description,
          detailedDescription: header.detailedDescription,
        },
      })
    }

    sections.push({
      type: 'InteropTokensSection',
      props: {
        id: 'interop-tokens',
        projectId: project.id,
        title: 'Top tokens by volume',
        apiSelection,
      },
    })

    sections.push({
      type: 'InteropTransfersSection',
      props: {
        id: 'interop-transfers',
        scope: { type: 'project', projectId: project.id },
        title: 'Transfers',
        apiSelection,
        snapshotTimestamp: data.entry?.snapshotTimestamp,
        interopChains: sortedChains,
      },
    })
  }

  if (discoveryUpdates.length > 0) {
    sections.push({
      type: 'UpdatesSection',
      props: {
        id: 'updates',
        title: 'Updates',
        updates: discoveryUpdates,
      },
    })
  }

  if (project.interopConfig.permissions || project.interopConfig.contracts) {
    const [
      contractUtils,
      projectsChangeReport,
      zkCatalogProjects,
      allProjectsWithContracts,
      tvsStats,
    ] = await Promise.all([
      getContractUtils(),
      getProjectsChangeReport(),
      ps.getProjects({ select: ['zkCatalogInfo'] }),
      ps.getProjects({ select: ['contracts'] }),
      get7dTvsBreakdown({ type: 'layer2' }),
    ])

    const permissionsSection = getPermissionsSection(
      {
        id: project.id,
        isUnderReview,
        permissions: project.interopConfig.permissions,
      },
      contractUtils,
      projectsChangeReport,
    )
    if (permissionsSection) {
      sections.push({
        type: 'PermissionsSection',
        props: {
          ...permissionsSection,
          id: 'permissions',
          title: 'Permissions',
        },
      })
    }

    const contractsSection = getContractsSection(
      {
        id: project.id,
        slug: project.slug,
        isUnderReview,
        contracts: project.interopConfig.contracts,
      },
      contractUtils,
      projectsChangeReport,
      zkCatalogProjects,
      allProjectsWithContracts,
      tvsStats,
    )
    if (contractsSection) {
      sections.push({
        type: 'ContractsSection',
        props: {
          ...contractsSection,
          id: 'contracts',
          title: 'Smart contracts',
        },
      })
    }
  }

  return {
    id: project.id,
    name: project.interopConfig?.name ?? project.name,
    shortName: project.shortName,
    slug: project.slug,
    icon: manifest.getUrl(`/icons/${project.slug}.png`),
    underReviewStatus: getUnderReviewStatus({
      isUnderReview,
      impactfulChange: false,
    }),
    header,
    sections,
  }
}

function sortChainsByFlowVolume(
  chains: InteropChainWithIcon[],
  flows: InteropProtocolDashboardData['flows'],
): InteropChainWithIcon[] {
  const volumePerChain = new Map<string, number>()
  for (const flow of flows) {
    volumePerChain.set(
      flow.srcChain,
      (volumePerChain.get(flow.srcChain) ?? 0) + flow.volume,
    )
    volumePerChain.set(
      flow.dstChain,
      (volumePerChain.get(flow.dstChain) ?? 0) + flow.volume,
    )
  }
  return chains.toSorted(
    (a, b) => (volumePerChain.get(b.id) ?? 0) - (volumePerChain.get(a.id) ?? 0),
  )
}
