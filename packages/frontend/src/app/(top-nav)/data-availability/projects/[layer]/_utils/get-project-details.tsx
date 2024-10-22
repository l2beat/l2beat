import { type DaBridge, type DaLayer } from '@l2beat/config'
import {
  type ContractsVerificationStatuses,
  type ImplementationChangeReportApiResponse,
  type ManuallyVerifiedContracts,
} from '@l2beat/shared-pure'
import { type GrisiniValue } from '~/components/grisini/types'
import { type ProjectDetailsSection } from '~/components/projects/sections/types'
import { type RosetteValue } from '~/components/rosette/types'
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
            id: daLayer.id,
            type: daLayer.type,
            isUnderReview: !!daLayer.isUnderReview,
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
            type: daLayer.type,
            isVerified,
            slug: daBridge.display.slug,
            contracts: daBridge.contracts,
            isUnderReview: daLayer.isUnderReview,
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

  /* items.push({
    type: 'RiskAnalysisSection',
    props: {
      id: 'risk-analysis',
      title: 'Risk analysis',
      rosetteType: 'pentagon',
      rosetteValues: grisiniValues,
      isUnderReview: !!daLayer.isUnderReview || daBridge.isUnderReview,
      shouldHideRosette: daBridge.type === 'NoBridge',
      warning: daBridge.display.warning,
      redWarning: daBridge.display.redWarning,
      isVerified,
    },
  })*/

  items.push({
    type: 'MarkdownSection',
    props: {
      id: 'da-layer-technology',
      title: 'DA Layer technology',
      diagram: {
        type: 'da-layer-technology',
        slug: daLayer.display.slug,
      },
      content: daLayer.technology.description,
      risks: daLayer.technology.risks?.map(toTechnologyRisk),
    },
  })

  items.push({
    type: 'MarkdownSection',
    props: {
      id: 'da-bridge-technology',
      title: 'DA Bridge technology',
      diagram: {
        type: 'da-bridge-technology',
        slug: `${daLayer.display.slug}-${daBridge.display.slug}`,
      },
      content: daBridge.technology.description,
      risks: daBridge.technology.risks?.map(toTechnologyRisk),
    },
  })

  if (permissionsSection) {
    items.push({
      type: 'PermissionsSection',
      props: {
        ...permissionsSection,
        permissionedEntities: getPermissionedEntities(daBridge),
        id: 'permissions',
        title: 'DA Bridge permissions',
      },
    })
  }

  if (contractsSection) {
    items.push({
      type: 'ContractsSection',
      props: {
        ...contractsSection,
        id: 'contracts',
        title: 'DA Bridge contracts',
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
