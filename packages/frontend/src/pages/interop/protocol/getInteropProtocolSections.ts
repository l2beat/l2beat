import type { ProjectId } from '@l2beat/shared-pure'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { InteropProtocolDashboardData } from '~/server/features/scaling/interop/getInteropProtocolData'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import type { InteropSelection } from '../utils/types'

interface GetInteropProtocolSectionsOptions {
  projectId: ProjectId
  protocolData: InteropProtocolDashboardData
  apiSelection: InteropSelection
  interopChains: InteropChainWithIcon[]
}

export function getInteropProtocolSections({
  projectId,
  protocolData,
  apiSelection,
  interopChains,
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
        interopChains,
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
