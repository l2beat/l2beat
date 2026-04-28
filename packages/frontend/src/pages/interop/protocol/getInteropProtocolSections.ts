import type { ProjectId } from '@l2beat/shared-pure'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { InteropProtocolDashboardData } from '~/server/features/scaling/interop/getInteropProtocolData'
import type { InteropSelection } from '../utils/types'

interface GetInteropProtocolSectionsOptions {
  projectId: ProjectId
  isLoading: boolean
  data: InteropProtocolDashboardData | undefined
  apiSelection: InteropSelection
  getChainById: (id: string) => { id: string; iconUrl: string } | undefined
}

export function getInteropProtocolSections({
  projectId,
  isLoading,
  data,
  apiSelection,
  getChainById,
}: GetInteropProtocolSectionsOptions): ProjectDetailsSection[] {
  if (isLoading || !data?.entry) {
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
        apiSelection,
        getChainById,
      },
    })
  }

  sections.push({
    type: 'InteropTokensSection',
    props: {
      id: 'interop-tokens',
      projectId,
      title: 'Top tokens by volume',
      apiSelection,
    },
  })

  sections.push({
    type: 'InteropTransfersSection',
    props: {
      id: 'interop-transfers',
      projectId,
      title: 'Transfers',
      apiSelection,
    },
  })

  return sections
}
