import { type DaBridge, type DaLayer } from '@l2beat/config'
import {
  type ContractsVerificationStatuses,
  type ManuallyVerifiedContracts,
} from '@l2beat/shared-pure'
import { mapBridgeRisksToRosetteValues } from '~/app/(side-nav)/data-availability/_utils/map-risks-to-rosette-values'
import { type ProjectDetailsSection } from '~/components/projects/sections/types'
import { type RosetteValue } from '~/components/rosette/types'
import { type ProjectsChangeReport } from '~/server/features/projects-change-report/get-projects-change-report'
import { getMultiChainContractsSection } from '~/utils/project/contracts-and-permissions/get-multichain-contract-section'
import { getMultichainPermissionsSection } from '~/utils/project/contracts-and-permissions/get-multichain-permissions-section'
import { toTechnologyRisk } from '~/utils/project/risk-summary/to-technology-risk'
import { getDaOtherConsiderationsSection } from './get-da-other-considerations-section'
import { getDaProjectRiskSummarySection } from './get-da-project-risk-summary-section'
import { getPermissionedEntities } from './get-permissioned-entities'
interface Params {
  daLayer: DaLayer
  daBridge: DaBridge
  isVerified: boolean
  contractsVerificationStatuses: ContractsVerificationStatuses
  manuallyVerifiedContracts: ManuallyVerifiedContracts
  projectsChangeReport: ProjectsChangeReport
  grissiniValues: RosetteValue[]
}

export function getProjectDetails({
  daLayer,
  daBridge,
  isVerified,
  contractsVerificationStatuses,
  manuallyVerifiedContracts,
  projectsChangeReport,
  grissiniValues,
}: Params) {
  const relatedScalingProject =
    daBridge.type === 'DAC' && daBridge.usedIn.length === 1
      ? daBridge.usedIn[0]
      : undefined

  const permissionsSection =
    daBridge.type !== 'Enshrined'
      ? getMultichainPermissionsSection(
          {
            id: daLayer.id,
            bridge: daBridge,
            isUnderReview: !!daLayer.isUnderReview,
            permissions: daBridge.permissions,
            dacUsedIn: relatedScalingProject,
          },
          contractsVerificationStatuses,
          manuallyVerifiedContracts,
        )
      : undefined

  const contractsSection =
    daBridge.type !== 'Enshrined'
      ? getMultiChainContractsSection(
          {
            id: daBridge.id,
            isVerified,
            slug: daBridge.display.slug,
            contracts: daBridge.contracts,
            isUnderReview: daLayer.isUnderReview,
            dacUsedIn: relatedScalingProject,
          },
          contractsVerificationStatuses,
          manuallyVerifiedContracts,
          projectsChangeReport,
        )
      : undefined

  const riskSummarySection = getDaProjectRiskSummarySection(
    daLayer,
    daBridge,
    isVerified,
  )

  const otherConsiderationsSection = getDaOtherConsiderationsSection(
    daLayer,
    daBridge,
  )

  const daLayerItems: ProjectDetailsSection[] = []

  daLayerItems.push({
    type: 'GrissiniRiskAnalysisSection',
    props: {
      id: 'da-layer-risk-analysis',
      title: 'Risk analysis',
      isUnderReview: !!daLayer.isUnderReview,
      isVerified,
      grissiniValues,
    },
  })

  daLayerItems.push({
    type: 'MarkdownSection',
    props: {
      id: 'da-layer-technology',
      title: 'Technology',
      diagram: {
        type: 'da-layer-technology',
        slug: daLayer.display.slug,
      },
      content: daLayer.technology.description,
      mdClassName:
        'da-beat text-gray-850 leading-snug dark:text-gray-400 md:text-lg',
      risks: daLayer.technology.risks?.map(toTechnologyRisk),
      references: daLayer.technology.references,
    },
  })

  const daBridgeItems: ProjectDetailsSection[] = []

  daBridgeItems.push({
    type: 'GrissiniRiskAnalysisSection',
    props: {
      id: 'da-bridge-risk-analysis',
      title: 'Risk analysis',
      isUnderReview: !!daLayer.isUnderReview,
      isVerified,
      grissiniValues: mapBridgeRisksToRosetteValues(daBridge.risks),
      hideRisks: daBridge.type === 'NoBridge',
    },
  })

  daBridgeItems.push({
    type: 'MarkdownSection',
    props: {
      id: 'da-bridge-technology',
      title: 'Technology',
      diagram: {
        type: 'da-bridge-technology',
        slug: `${daLayer.display.slug}-${daBridge.display.slug}`,
      },
      content: daBridge.technology.description,
      mdClassName:
        'da-beat text-gray-850 leading-snug dark:text-gray-400 md:text-lg',
      risks: daBridge.technology.risks?.map(toTechnologyRisk),
      references: daBridge.technology.references,
    },
  })

  if (permissionsSection) {
    daBridgeItems.push({
      type: 'MultichainPermissionsSection',
      props: {
        ...permissionsSection,
        permissionedEntities: getPermissionedEntities(daBridge),
        id: 'da-bridge-permissions',
        title: 'Permissions',
      },
    })
  }

  if (contractsSection) {
    daBridgeItems.push({
      type: 'MultichainContractsSection',
      props: {
        ...contractsSection,
        id: 'da-bridge-contracts',
        title: 'Contracts',
      },
    })
  }

  const items: ProjectDetailsSection[] = []

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
      title: daLayer.display.name,
      description: daLayer.display.description,
      items: daLayerItems,
    },
  })

  if (daBridgeItems.length > 0) {
    items.push({
      type: 'Group',
      sideNavTitle: daBridge.type === 'NoBridge' ? 'DA Bridge' : undefined,
      props: {
        id: 'da-bridge',
        title: daBridge.display.name,
        description: daBridge.display.description,
        items: daBridgeItems,
      },
    })
  }

  if (otherConsiderationsSection.items.length > 0) {
    items.push({
      type: 'TechnologySection',
      props: {
        id: 'other-considerations',
        title: 'Other considerations',
        ...otherConsiderationsSection,
      },
    })
  }

  return items
}
