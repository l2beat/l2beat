import type { ProjectId } from '@l2beat/shared-pure'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { InteropProtocolDashboardData } from '~/server/features/scaling/interop/getInteropProtocolData'
import type { InteropSelection } from '../utils/types'

interface GetInteropProtocolSectionsOptions {
  projectId: ProjectId
  protocolData: InteropProtocolDashboardData
  apiSelection: InteropSelection
  getChainById: (id: string) => { id: string; iconUrl: string } | undefined
}

export function getInteropProtocolSections({
  projectId,
  protocolData,
  apiSelection,
  getChainById,
}: GetInteropProtocolSectionsOptions): ProjectDetailsSection[] {
  if (!protocolData.entry) {
    return []
  }

  const sections: ProjectDetailsSection[] = []

  if (protocolData.flows.length > 0) {
    sections.push({
      type: 'InteropVolumeSection',
      props: {
        id: 'interop-volume',
        title: 'Volume and flows',
        protocolData,
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
      protocolData,
    },
  })

  sections.push({
    type: 'InteropTransfersSection',
    props: {
      id: 'interop-transfers',
      projectId,
      title: 'Transfers',
      apiSelection,
      protocolData,
    },
  })

  return sections
}
