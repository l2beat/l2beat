import type { ProjectId } from '@l2beat/shared-pure'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { InteropProtocolDashboardData } from '~/server/features/scaling/interop/getInteropProtocolData'

interface GetInteropProtocolSectionsOptions {
  projectId: ProjectId
  hasSelection: boolean
  isLoading: boolean
  data: InteropProtocolDashboardData | undefined
}

export function getInteropProtocolSections({
  projectId,
  hasSelection,
  isLoading,
  data,
}: GetInteropProtocolSectionsOptions): ProjectDetailsSection[] {
  if (!hasSelection || isLoading || !data?.entry) {
    return []
  }

  const sections: ProjectDetailsSection[] = []

  if (data.flows.length > 0) {
    sections.push({
      type: 'InteropVolumeSection',
      props: {
        id: 'interop-volume',
        projectId,
        title: 'Volume and flows',
      },
    })
  }

  sections.push({
    type: 'InteropTokensSection',
    props: {
      id: 'interop-tokens',
      projectId,
      title: 'Top tokens by volume',
    },
  })

  sections.push({
    type: 'InteropTransfersSection',
    props: {
      id: 'interop-transfers',
      projectId,
      title: 'Transfers',
    },
  })

  return sections
}
