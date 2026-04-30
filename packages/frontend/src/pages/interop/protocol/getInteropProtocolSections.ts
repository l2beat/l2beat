import type { ProjectId } from '@l2beat/shared-pure'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { InteropProtocolDashboardData } from '~/server/features/scaling/interop/getInteropProtocolData'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { MAX_SELECTED_CHAINS } from '../components/flows/consts'
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

  const sortedChains = sortChainsByFlowVolume(interopChains, protocolData.flows)
  const defaultSelectedChains = sortedChains
    .slice(0, MAX_SELECTED_CHAINS)
    .map((chain) => chain.id)

  const sections: ProjectDetailsSection[] = []

  if (protocolData.flows.length > 0) {
    sections.push({
      type: 'InteropVolumeSection',
      props: {
        id: 'interop-volume',
        title: 'Volume and flows',
        protocolData,
        interopChains: sortedChains,
        defaultSelectedChains,
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
      interopChains: sortedChains,
    },
  })

  return sections
}

function sortChainsByFlowVolume(
  chains: InteropChainWithIcon[],
  flows: InteropProtocolDashboardData['flows'],
): InteropChainWithIcon[] {
  const volumePerChain = new Map<string, number>()
  for (const flow of flows) {
    volumePerChain.set(
      flow.srcChain,
      (volumePerChain.get(flow.srcChain) ?? 0) + flow.volume,
    )
    volumePerChain.set(
      flow.dstChain,
      (volumePerChain.get(flow.dstChain) ?? 0) + flow.volume,
    )
  }
  return chains.toSorted(
    (a, b) => (volumePerChain.get(b.id) ?? 0) - (volumePerChain.get(a.id) ?? 0),
  )
}
