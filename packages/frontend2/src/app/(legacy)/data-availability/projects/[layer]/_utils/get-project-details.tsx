import { type DaBridge, type DaLayer } from '@l2beat/config'
import {
  type ImplementationChangeReportApiResponse,
  type ManuallyVerifiedContracts,
  type VerificationStatus,
} from '@l2beat/shared-pure'
import { getContractsSection } from '~/utils/project/contracts-and-permissions/get-contracts-section'
import { getPermissionsSection } from '~/utils/project/contracts-and-permissions/get-permissions-section'
import { type ProjectDetailsSection } from '~/app/_components/projects/sections/types'
import { type RosetteValue } from '~/app/_components/rosette/types'
interface Params {
  daLayer: DaLayer
  daBridge: DaBridge
  verificationStatus: VerificationStatus
  manuallyVerifiedContracts: ManuallyVerifiedContracts
  implementationChangeReport: ImplementationChangeReportApiResponse
  rosetteValues: RosetteValue[]
}

export function getProjectDetails({
  daLayer,
  daBridge,
  verificationStatus,
  manuallyVerifiedContracts,
  implementationChangeReport,
  rosetteValues,
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
          verificationStatus,
          manuallyVerifiedContracts,
        )
      : undefined

  const contractsSection =
    daBridge.type !== 'NoBridge' && daBridge.type !== 'Enshrined'
      ? getContractsSection(
          {
            id: daBridge.id,
            type: daLayer.type,
            slug: daBridge.display.slug,
            contracts: daBridge.contracts,
            isUnderReview: daLayer.isUnderReview,
            escrows: undefined,
          },
          verificationStatus,
          manuallyVerifiedContracts,
          implementationChangeReport,
        )
      : undefined

  const items: ProjectDetailsSection[] = []

  items.push({
    type: 'RiskAnalysisSection',
    props: {
      id: 'risk-analysis',
      title: 'Risk analysis',
      riskValues: rosetteValues,
      isUnderReview: !!daLayer.isUnderReview || daBridge.isUnderReview,
      warning: daBridge.display.warning,
      redWarning: daBridge.display.redWarning,
      // TODO: We need to add this to DA projects
      isVerified: undefined,
    },
  })

  items.push({
    type: 'MarkdownSection',
    props: {
      id: 'da-layer-technology',
      title: 'DA Layer technology',
      children: daLayer.technology,
    },
  })

  items.push({
    type: 'MarkdownSection',
    props: {
      id: 'da-bridge-technology',
      title: 'DA Bridge technology',
      children: daBridge.technology,
    },
  })

  if (permissionsSection) {
    items.push({
      type: 'PermissionsSection',
      props: {
        ...permissionsSection,
        id: 'da-bridge-permissions',
        title: 'DA Bridge permissions',
      },
    })
  }

  if (contractsSection) {
    items.push({
      type: 'ContractsSection',
      props: {
        ...contractsSection,
        id: 'da-bridge-contracts',
        title: 'DA Bridge contracts',
      },
    })
  }

  return items
}
