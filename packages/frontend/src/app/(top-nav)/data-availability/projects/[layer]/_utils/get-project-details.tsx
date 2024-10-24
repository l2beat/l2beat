import { type DaBridge, type DaLayer } from '@l2beat/config'
import {
  notUndefined,
  type ContractsVerificationStatuses,
  type ImplementationChangeReportApiResponse,
  type ManuallyVerifiedContracts,
} from '@l2beat/shared-pure'
import { type GrisiniValue } from '~/components/grisini/types'
import { type ProjectDetailsSection } from '~/components/projects/sections/types'
import { getContractsSection } from '~/utils/project/contracts-and-permissions/get-contracts-section'
import { getPermissionsSection } from '~/utils/project/contracts-and-permissions/get-permissions-section'
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
  grisiniValues: GrisiniValue[]
}

export function getProjectDetails({
  daLayer,
  daBridge,
  isVerified,
  contractsVerificationStatuses,
  manuallyVerifiedContracts,
  implementationChangeReport,
  grisiniValues,
}: Params) {

  const permissionsSection =
    daBridge.type !== 'NoBridge' && daBridge.type !== 'Enshrined'
      ? getPermissionsSection(
          {
            id: daBridge.id,
            type: daBridge.type,
            isUnderReview: !!daBridge.isUnderReview,
            permissions: daBridge.permissions,
            nativePermissions: undefined,
          },
          contractsVerificationStatuses,
          manuallyVerifiedContracts,
        )
      : undefined

  const contractsSection =
    daBridge.type !== 'NoBridge' && daBridge.type !== 'Enshrined'
      ? getContractsSection(
          {
            id: daBridge.id,
            type: daBridge.type,
            isVerified,
            slug: daBridge.display.slug,
            contracts: daBridge.contracts,
            isUnderReview: daBridge.isUnderReview,
            escrows: undefined,
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

  const daLayerItems: ProjectDetailsSection[] = 
  [{
    type: 'GrisiniRiskAnalysisSection',
    props: {
      id: 'risk-analysis',
      title: 'Risk analysis',
      isUnderReview: !!daLayer.isUnderReview,
      isVerified,
      grisiniValues,
    },
  },
  {
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
  }]


  const daBridgeItems: ProjectDetailsSection[] = [
    {
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
    },
    permissionsSection ? ({
      type: 'PermissionsSection',
      props: {
        ...permissionsSection,
        permissionedEntities: getPermissionedEntities(daBridge),
        id: 'permissions',
        title: 'Permissions',
      },
    }) : undefined,
    contractsSection ? {
      type: 'ContractsSection',
      props: {
        ...contractsSection,
        id: 'contracts',
        title: 'Contracts',
      },
    } : undefined
  ].filter(notUndefined)

  const items: ProjectDetailsSection[] = [
    riskSummarySection.riskGroups.length > 0 ? {
      type: 'RiskSummarySection',
      props: {
        id: 'risk-summary',
        title: 'Risk summary',
        ...riskSummarySection,
      },
    } : undefined,
    {
      type: 'Group',
      props: {
        id: 'da-layer',
        title: daLayer.display.name,
        description: daLayer.display.description,
        items: daLayerItems,
      },
    },
    {
      type: 'Group',
      props: {
        id: 'da-bridge',
        title: daBridge.display.name,
        description: daBridge.display.description,
        items: daBridgeItems,
      },
    },
    otherConsiderationsSection.items.length > 0 ? {
      type: 'TechnologySection',
      props: {
        id: 'other-considerations',
        title: 'Other considerations',
        ...otherConsiderationsSection,
      },
    } : undefined
  ].filter(notUndefined)

  return items
}
