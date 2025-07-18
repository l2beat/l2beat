import type { Project } from '@l2beat/config'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { RosetteValue } from '~/components/rosette/types'
import type { ProjectsChangeReport } from '~/server/features/projects-change-report/getProjectsChangeReport'
import type { SsrHelpers } from '~/trpc/server'
import { getContractsSection } from '~/utils/project/contracts-and-permissions/getContractsSection'
import { getContractUtils } from '~/utils/project/contracts-and-permissions/getContractUtils'
import { getPermissionsSection } from '~/utils/project/contracts-and-permissions/getPermissionsSection'
import { getDiagramParams } from '~/utils/project/getDiagramParams'
import { toTechnologyRisk } from '~/utils/project/risk-summary/toTechnologyRisk'
import { getDaProjectRiskSummarySection } from './getDaProjectRiskSummarySection'
import { getDaThroughputSection } from './getDaThroughputSection'

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
  helpers: SsrHelpers
}

export async function getRegularDaProjectSections({
  layer,
  bridge,
  isVerified,
  projectsChangeReport,
  layerGrissiniValues,
  bridgeGrissiniValues,
  helpers,
}: RegularDetailsParams) {
  const [contractUtils, throughputSection] = await Promise.all([
    getContractUtils(),
    getDaThroughputSection(helpers, layer),
  ])

  const permissionsSection =
    bridge?.permissions &&
    getPermissionsSection(
      {
        id: bridge.id,
        isUnderReview: !!layer.statuses.reviewStatus,
        permissions: bridge.permissions,
      },
      contractUtils,
      projectsChangeReport,
    )

  const contractsSection =
    bridge?.contracts &&
    getContractsSection(
      {
        id: bridge.id,
        isVerified,
        slug: bridge.slug,
        contracts: bridge.contracts ?? {},
        isUnderReview: !!layer.statuses.reviewStatus,
      },
      contractUtils,
      projectsChangeReport,
    )

  const riskSummarySection = getDaProjectRiskSummarySection(
    layer,
    bridge,
    isVerified,
  )

  const daLayerItems: ProjectDetailsSection[] = []

  daLayerItems.push({
    type: 'GrissiniRiskAnalysisSection',
    props: {
      id: 'da-layer-risk-analysis',
      title: 'Risk analysis',
      isUnderReview: !!layer.statuses.reviewStatus,
      isVerified,
      layerGrissiniValues,
    },
  })

  daLayerItems.push({
    type: 'MarkdownSection',
    props: {
      id: 'da-layer-technology',
      title: 'Technology',
      diagram: getDiagramParams('da-layer-technology', layer.slug),
      content: layer.daLayer.technology.description,
      mdClassName: 'da-beat',
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
      isUnderReview: !!layer.statuses.reviewStatus,
      isVerified,
      isNoBridge: !bridge || !!bridge.daBridge.risks.isNoBridge,
      bridgeGrissiniValues,
    },
  })

  daBridgeItems.push({
    type: 'MarkdownSection',
    props: {
      id: 'da-bridge-technology',
      title: 'Technology',
      diagram: getDiagramParams(
        'da-bridge-technology',
        `${layer.slug}-${bridge?.slug ?? 'no-bridge'}`,
      ),
      content:
        bridge?.daBridge.technology.description ??
        'No DA bridge is selected. Without a DA bridge, Ethereum has no proof of data availability for this project.',
      mdClassName: 'da-beat',
      risks: bridge?.daBridge.technology.risks?.map(toTechnologyRisk),
      references: bridge?.daBridge.technology.references,
    },
  })

  const discoUiHref = `https://disco.l2beat.com/ui/p/${bridge?.id}`
  if (permissionsSection) {
    daBridgeItems.push({
      type: 'PermissionsSection',
      props: {
        ...permissionsSection,
        permissionedEntities: bridge.daBridge.dac?.knownMembers,
        id: 'da-bridge-permissions',
        title: 'Permissions',
        discoUiHref,
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
        discoUiHref,
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
      sideNavTitle: bridge?.daBridge.risks.isNoBridge
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
  layer: Project<'daLayer' | 'statuses' | 'display', 'milestones'>
  bridge: Project<'daBridge', 'contracts' | 'permissions'>
  isVerified: boolean
  layerGrissiniValues: RosetteValue[]
  bridgeGrissiniValues: RosetteValue[]
  helpers: SsrHelpers
}

export async function getEthereumDaProjectSections({
  layer,
  bridge,
  isVerified,
  layerGrissiniValues,
  bridgeGrissiniValues,
  helpers,
}: EthereumDetailsParams) {
  const riskSummarySection = getDaProjectRiskSummarySection(
    layer,
    bridge,
    isVerified,
  )

  const items: ProjectDetailsSection[] = []

  const throughputSection = await getDaThroughputSection(helpers, layer)

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
      isUnderReview: !!layer.statuses.reviewStatus,
      isVerified,
      layerGrissiniValues,
      bridgeGrissiniValues,
      description: layer.display.description,
    },
  })

  items.push({
    type: 'MarkdownSection',
    props: {
      id: 'da-layer-technology',
      title: 'Technology',
      diagram: getDiagramParams('da-layer-technology', layer.slug),
      content: layer.daLayer.technology.description.concat(
        '\n\n',
        bridge.daBridge.technology.description,
      ),
      mdClassName: 'da-beat',
      risks: layer.daLayer.technology.risks?.map(toTechnologyRisk),
      references: layer.daLayer.technology.references?.concat(
        ...(bridge.daBridge.technology.references ?? []),
      ),
    },
  })

  return items
}
