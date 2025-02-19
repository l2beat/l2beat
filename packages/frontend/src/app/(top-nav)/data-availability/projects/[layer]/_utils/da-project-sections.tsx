import type { Project } from '@l2beat/config'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { RosetteValue } from '~/components/rosette/types'
import type { ProjectsChangeReport } from '~/server/features/projects-change-report/get-projects-change-report'
import { getContractsSection } from '~/utils/project/contracts-and-permissions/get-contracts-section'
import { getPermissionsSection } from '~/utils/project/contracts-and-permissions/get-permissions-section'
import { toTechnologyRisk } from '~/utils/project/risk-summary/to-technology-risk'
import { getDaProjectRiskSummarySection } from './get-da-project-risk-summary-section'
import { getDaThroughputSection } from './get-da-throughput-section'

type RegularDetailsParams = {
  layer: Project<
    'daLayer' | 'statuses' | 'display',
    'milestones' | 'isUpcoming'
  >
  bridge:
    | Project<'daBridge' | 'display', 'contracts' | 'permissions'>
    | undefined
  isVerified: boolean
  projectsChangeReport: ProjectsChangeReport
  layerGrissiniValues: RosetteValue[]
  bridgeGrissiniValues: RosetteValue[]
}

export async function getRegularDaProjectSections({
  layer,
  bridge,
  isVerified,
  projectsChangeReport,
  layerGrissiniValues,
  bridgeGrissiniValues,
}: RegularDetailsParams) {
  const permissionsSection =
    bridge?.permissions &&
    getPermissionsSection({
      type: 'layer2', // TODO: This is needed for common contracts and doesn't work for da
      id: layer.id,
      isUnderReview: layer.statuses.isUnderReview,
      permissions: bridge.permissions,
    })

  const contractsSection =
    bridge?.contracts &&
    getContractsSection(
      {
        type: 'layer2', // TODO: This is needed for common contracts and doesn't work for da
        id: bridge.id,
        isVerified,
        slug: bridge.slug,
        contracts: bridge.contracts ?? {},
        escrows: undefined,
        isUnderReview: layer.statuses.isUnderReview,
      },
      projectsChangeReport,
    )

  const riskSummarySection = getDaProjectRiskSummarySection(
    layer,
    bridge,
    isVerified,
  )
  const throughputSection = await getDaThroughputSection(layer)

  const daLayerItems: ProjectDetailsSection[] = []

  daLayerItems.push({
    type: 'GrissiniRiskAnalysisSection',
    props: {
      id: 'da-layer-risk-analysis',
      title: 'Risk analysis',
      isUnderReview: layer.statuses.isUnderReview,
      isVerified,
      layerGrissiniValues,
      hideTitle: true,
    },
  })

  daLayerItems.push({
    type: 'MarkdownSection',
    props: {
      id: 'da-layer-technology',
      title: 'Technology',
      diagram: {
        type: 'da-layer-technology',
        slug: layer.slug,
      },
      content: layer.daLayer.technology.description,
      mdClassName:
        'da-beat text-gray-850 leading-snug dark:text-gray-400 md:text-lg',
      risks: layer.daLayer.technology.risks?.map(toTechnologyRisk),
      references: layer.daLayer.technology.references,
    },
  })

  const daBridgeItems: ProjectDetailsSection[] = []

  daBridgeItems.push({
    type: 'GrissiniRiskAnalysisSection',
    props: {
      id: 'da-bridge-risk-analysis',
      title: 'Risk analysis',
      isUnderReview: layer.statuses.isUnderReview,
      isVerified,
      isNoBridge: !bridge || !!bridge.daBridge.risks.isNoBridge,
      bridgeGrissiniValues,
      hideTitle: true,
    },
  })

  daBridgeItems.push({
    type: 'MarkdownSection',
    props: {
      id: 'da-bridge-technology',
      title: 'Technology',
      diagram: {
        type: 'da-bridge-technology',
        slug: `${layer.slug}-${bridge?.slug ?? 'no-bridge'}`,
      },
      content:
        bridge?.daBridge.technology.description ??
        'No DA bridge is selected. Without a DA bridge, Ethereum has no proof of data availability for this project.',
      mdClassName:
        'da-beat text-gray-850 leading-snug dark:text-gray-400 md:text-lg',
      risks: bridge?.daBridge.technology.risks?.map(toTechnologyRisk),
      references: bridge?.daBridge.technology.references,
    },
  })

  if (permissionsSection) {
    daBridgeItems.push({
      type: 'PermissionsSection',
      props: {
        ...permissionsSection,
        permissionedEntities: bridge.daBridge.dac?.knownMembers,
        id: 'da-bridge-permissions',
        title: 'Permissions',
      },
    })
  }

  if (contractsSection) {
    daBridgeItems.push({
      type: 'ContractsSection',
      props: {
        ...contractsSection,
        id: 'da-bridge-contracts',
        title: 'Contracts',
      },
    })
  }

  const items: ProjectDetailsSection[] = []

  if (throughputSection) {
    items.push({
      type: 'ThroughputSection',
      props: {
        id: 'throughput',
        title: 'Throughput',
        ...throughputSection,
      },
    })
  }

  if (!layer.isUpcoming && layer.milestones && layer.milestones.length > 0) {
    const sortedMilestones = layer.milestones.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
    items.push({
      type: 'MilestonesAndIncidentsSection',
      props: {
        id: 'milestones-and-incidents',
        title: 'Milestones & Incidents',
        milestones: sortedMilestones,
      },
    })
  }

  if (
    riskSummarySection.layer.risks.concat(riskSummarySection.bridge.risks)
      .length > 0
  ) {
    items.push({
      type: 'DaRiskSummarySection',
      props: {
        id: 'risk-summary',
        title: 'Risk summary',
        ...riskSummarySection,
      },
    })
  }

  items.push({
    type: 'Group',
    props: {
      id: 'da-layer',
      title: layer.name,
      description: layer.display.description,
      items: daLayerItems,
    },
  })

  if (daBridgeItems.length > 0) {
    items.push({
      type: 'Group',
      sideNavTitle: !!bridge?.daBridge.risks.isNoBridge
        ? 'No DA Bridge'
        : undefined,
      props: {
        id: 'da-bridge',
        title: bridge?.daBridge.name ?? 'No DA Bridge',
        description:
          bridge?.display.description ??
          'The risk profile in this page refers to L2s that do not integrate with a data availability bridge. Projects not integrating with a functional DA bridge rely only on the data availability attestation of the sequencer.',
        items: daBridgeItems,
      },
    })
  }

  return items
}

type EthereumDetailsParams = {
  layer: Project<'daLayer' | 'statuses' | 'display'>
  bridge: Project<'daBridge', 'contracts'>
  isVerified: boolean
  layerGrissiniValues: RosetteValue[]
  bridgeGrissiniValues: RosetteValue[]
}

export async function getEthereumDaProjectSections({
  layer,
  bridge,
  isVerified,
  layerGrissiniValues,
  bridgeGrissiniValues,
}: EthereumDetailsParams) {
  const riskSummarySection = getDaProjectRiskSummarySection(
    layer,
    bridge,
    isVerified,
  )

  const items: ProjectDetailsSection[] = []

  const throughputSection = await getDaThroughputSection(layer)

  if (throughputSection) {
    items.push({
      type: 'ThroughputSection',
      props: {
        id: 'throughput',
        title: 'Throughput',
        ...throughputSection,
      },
    })
  }

  if (
    riskSummarySection.layer.risks.concat(riskSummarySection.bridge.risks)
      .length > 0
  ) {
    items.push({
      type: 'DaRiskSummarySection',
      props: {
        id: 'risk-summary',
        title: 'Risk summary',
        ...riskSummarySection,
      },
    })
  }

  items.push({
    type: 'GrissiniRiskAnalysisSection',
    props: {
      id: 'da-layer-risk-analysis',
      title: 'Risk analysis',
      isUnderReview: layer.statuses.isUnderReview,
      isVerified,
      layerGrissiniValues,
      bridgeGrissiniValues,
      description: layer.display.description,
      hideTitle: true,
    },
  })

  items.push({
    type: 'MarkdownSection',
    props: {
      id: 'da-layer-technology',
      title: 'Technology',
      diagram: {
        type: 'da-layer-technology',
        slug: layer.slug,
      },
      content: layer.daLayer.technology.description.concat(
        '\n\n',
        bridge.daBridge.technology.description,
      ),
      mdClassName:
        'da-beat text-gray-850 leading-snug dark:text-gray-400 md:text-lg',
      risks: layer.daLayer.technology.risks?.map(toTechnologyRisk),
      references: layer.daLayer.technology.references?.concat(
        ...(bridge.daBridge.technology.references ?? []),
      ),
    },
  })

  return items
}
