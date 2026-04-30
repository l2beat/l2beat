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

  const sections: ProjectDetailsSection[] = []

  if (protocolData.flows.length > 0) {
    sections.push({
      type: 'InteropVolumeSection',
      props: {
        id: 'interop-volume',
        title: 'Volume and flows',
        protocolData,
        interopChains,
        defaultSelectedChains: getDefaultSelectedChains(protocolData.flows),
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
      interopChains,
    },
  })

  return sections
}

function getDefaultSelectedChains(
  flows: InteropProtocolDashboardData['flows'],
): string[] {
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
  return Array.from(volumePerChain.entries())
    .toSorted((a, b) => b[1] - a[1])
    .slice(0, MAX_SELECTED_CHAINS)
    .map(([chainId]) => chainId)
}
