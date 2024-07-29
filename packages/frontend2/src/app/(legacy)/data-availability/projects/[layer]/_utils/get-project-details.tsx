import { type DaBridge, type DaLayer } from '@l2beat/config'
import {
  type ContractsVerificationStatuses,
  type ImplementationChangeReportApiResponse,
  type ManuallyVerifiedContracts,
} from '@l2beat/shared-pure'
import { type ProjectDetailsSection } from '~/app/_components/projects/sections/types'
import { type RosetteValue } from '~/app/_components/rosette/types'
import { getContractsSection } from '~/utils/project/contracts-and-permissions/get-contracts-section'
import { getPermissionsSection } from '~/utils/project/contracts-and-permissions/get-permissions-section'
interface Params {
  daLayer: DaLayer
  daBridge: DaBridge
  isVerified: boolean
  contractsVerificationStatuses: ContractsVerificationStatuses
  manuallyVerifiedContracts: ManuallyVerifiedContracts
  implementationChangeReport: ImplementationChangeReportApiResponse
  rosetteValues: RosetteValue[]
}

export function getProjectDetails({
  daLayer,
  daBridge,
  isVerified,
  contractsVerificationStatuses,
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
      isVerified,
    },
  })

  items.push({
    type: 'MarkdownSection',
    props: {
      id: 'da-layer-technology',
      title: 'DA Layer technology',
      diagram: {
        type: 'da-layer-technology',
        slug: daLayer.display.slug,
      },
      children: daLayer.technology,
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
