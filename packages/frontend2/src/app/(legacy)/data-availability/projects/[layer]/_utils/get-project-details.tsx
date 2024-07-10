import { type DaBridge, type DaLayer } from '@l2beat/config'
import {
  type ManuallyVerifiedContracts,
  type VerificationStatus,
} from '@l2beat/shared-pure'
import { getPermissionsSection } from '~/app/_components/projects/sections/permissions/get-permissions-section'
import { type ProjectDetailsSection } from '~/app/_components/projects/sections/types'
import { type RosetteValue } from '~/app/_components/rosette/types'
interface Params {
  daLayer: DaLayer
  bridge: DaBridge
  verificationStatus: VerificationStatus
  manuallyVerifiedContracts: ManuallyVerifiedContracts
  rosetteValues: RosetteValue[]
}

export function getProjectDetails({
  daLayer,
  bridge,
  verificationStatus,
  manuallyVerifiedContracts,
  rosetteValues,
}: Params) {
  const permissionsSection = getPermissionsSection(
    daLayer,
    bridge,
    verificationStatus,
    manuallyVerifiedContracts,
  )

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

  return items
}
