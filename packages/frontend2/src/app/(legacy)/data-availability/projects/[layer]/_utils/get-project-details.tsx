import { type DaBridge, type DaLayer } from '@l2beat/config'
import {
  type ImplementationChangeReportApiResponse,
  type ManuallyVerifiedContracts,
  type VerificationStatus,
} from '@l2beat/shared-pure'
import { getContractsSection } from '~/app/_components/projects/sections/contracts/get-contracts-section'
import { getPermissionsSection } from '~/app/_components/projects/sections/permissions/get-permissions-section'
import { type ProjectDetailsSection } from '~/app/_components/projects/sections/types'
import { type RosetteValue } from '~/app/_components/rosette/types'
interface Params {
  daLayer: DaLayer
  bridge: DaBridge
  verificationStatus: VerificationStatus
  manuallyVerifiedContracts: ManuallyVerifiedContracts
  implementationChangeReport: ImplementationChangeReportApiResponse
  rosetteValues: RosetteValue[]
}

export function getProjectDetails({
  daLayer,
  bridge,
  verificationStatus,
  manuallyVerifiedContracts,
  implementationChangeReport,
  rosetteValues,
}: Params) {
  const permissionsSection =
    bridge.type !== 'NoBridge'
      ? getPermissionsSection(
          {
            isUnderReview: !!daLayer.isUnderReview,
            permissions: bridge.permissions,
            nativePermissions: undefined,
          },
          verificationStatus,
          manuallyVerifiedContracts,
        )
      : undefined
  const contractsSection =
    bridge.type !== 'NoBridge'
      ? getContractsSection(
          {
            id: bridge.id,
            slug: bridge.display.slug,
            contracts: bridge.contracts,
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
      // TODO: Do we want to add these to DA projects?
      warning: undefined,
      redWarning: undefined,
      isVerified: undefined,
      isUnderReview: false,
    },
  })

  items.push({
    type: 'MarkdownSection',
    props: {
      id: 'da-layer-technology',
      title: 'DA Layer technology',
      children: '## Some text\n### Next line',
    },
  })

  items.push({
    type: 'MarkdownSection',
    props: {
      id: 'da-bridge-technology',
      title: 'DA Bridge technology',
      children: '## Some text\n### Next line',
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
