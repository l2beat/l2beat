import { type DaBridge, type DaLayer } from '@l2beat/config'
import {
  type ContractsVerificationStatuses,
  type ImplementationChangeReportApiResponse,
  type ManuallyVerifiedContracts,
} from '@l2beat/shared-pure'
import { mapBridgeRisksToRosetteValues } from '~/app/(side-nav)/data-availability/_utils/map-risks-to-rosette-values'
import { type ProjectDetailsSection } from '~/components/projects/sections/types'
import { type RosetteValue } from '~/components/rosette/types'
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
  implementationChangeReport: ImplementationChangeReportApiResponse
  grissiniValues: RosetteValue[]
}

export function getProjectDetails({
  daLayer,
  daBridge,
  isVerified,
  contractsVerificationStatuses,
  manuallyVerifiedContracts,
  implementationChangeReport,
  grissiniValues,
}: Params) {
  const relatedScalingProject =
    daBridge.type === 'DAC' && daBridge.usedIn.length === 1
      ? daBridge.usedIn[0]
      : undefined

  const permissionsSection =
    daBridge.type !== 'NoBridge' && daBridge.type !== 'Enshrined'
      ? getMultichainPermissionsSection(
          {
            id: daLayer.id,
            isUnderReview: !!daLayer.isUnderReview,
            permissions: daBridge.permissions,
            dacUsedIn: relatedScalingProject,
          },
          contractsVerificationStatuses,
          manuallyVerifiedContracts,
        )
      : undefined

  const contractsSection =
    daBridge.type !== 'NoBridge' && daBridge.type !== 'Enshrined'
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
          implementationChangeReport,
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
      risks: daLayer.technology.risks?.map(toTechnologyRisk),
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
      risks: daBridge.technology.risks?.map(toTechnologyRisk),
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

  if (riskSummarySection.riskGroups.length > 0) {
    items.push({
      type: 'RiskSummarySection',
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
