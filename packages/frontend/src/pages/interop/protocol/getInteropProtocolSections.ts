import type { ProjectId } from '@l2beat/shared-pure'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { InteropProtocolDashboardData } from '~/server/features/scaling/interop/getInteropProtocolData'
import type { InteropProtocolEntry } from '~/server/features/scaling/interop/protocol/getInteropProtocolEntry'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { MAX_SELECTED_CHAINS } from '../components/flows/consts'
import type { InteropSelection } from '../utils/types'

interface GetInteropProtocolSectionsOptions {
  projectId: ProjectId
  projectEntry: InteropProtocolEntry
  apiSelection: InteropSelection
  interopChains: InteropChainWithIcon[]
  data: InteropProtocolDashboardData | undefined
}

export function getInteropProtocolSections({
  projectId,
  projectEntry,
  data,
  apiSelection,
  interopChains,
}: GetInteropProtocolSectionsOptions): ProjectDetailsSection[] {
  if (!data?.entry) {
    return []
  }

  const sortedChains = sortChainsByFlowVolume(interopChains, data.flows)
  const defaultSelectedChains = sortedChains
    .slice(0, MAX_SELECTED_CHAINS)
    .map((chain) => chain.id)

  const sections: ProjectDetailsSection[] = []

  if (data.flows.length > 0) {
    sections.push({
      type: 'InteropVolumeSection',
      props: {
        id: 'interop-volume',
        title: 'Volume and flows',
        entry: data.entry,
        interopChains: sortedChains,
        defaultSelectedChains,
      },
    })
  }

  if (projectEntry.header.detailedDescription) {
    sections.push({
      type: 'DetailedDescriptionSection',
      props: {
        id: 'detailed-description',
        title: 'Description',
        description: projectEntry.header.description,
        detailedDescription: projectEntry.header.detailedDescription,
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
      data,
    },
  })

  sections.push({
    type: 'InteropTransfersSection',
    props: {
      id: 'interop-transfers',
      projectId,
      title: 'Transfers',
      apiSelection,
      data,
      interopChains: sortedChains,
    },
  })

  if (projectEntry.permissionsSection) {
    sections.push({
      type: 'PermissionsSection',
      props: {
        ...projectEntry.permissionsSection,
        id: 'permissions',
        title: 'Permissions',
      },
    })
  }

  if (projectEntry.contractsSection) {
    sections.push({
      type: 'ContractsSection',
      props: {
        ...projectEntry.contractsSection,
        id: 'contracts',
        title: 'Smart contracts',
      },
    })
  }

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
