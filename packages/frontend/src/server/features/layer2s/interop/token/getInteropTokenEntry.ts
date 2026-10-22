import { getDeploymentsByVolume } from '~/components/projects/sections/interop/onchain-deployments/relations-graph/graphSelectors'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import type { InteropAbstractToken } from './getInteropAbstractTokens'
import type { InteropTokenRelationsGraph } from './getInteropTokenRelationsGraph'

export interface InteropTokenEntry {
  sections: ProjectDetailsSection[]
  deploymentsCount: number
}

export function getInteropTokenEntry({
  token,
  interopChains,
  relationsGraph,
  lastSyncedAt,
  hasRawTransfers,
}: {
  token: Pick<InteropAbstractToken, 'id' | 'isPriceUnreliable'>
  interopChains: InteropChainWithIcon[]
  relationsGraph: InteropTokenRelationsGraph | undefined
  /** The older snapshot the page shows when the latest one lacks the token. */
  lastSyncedAt: number | undefined
  hasRawTransfers: boolean
}): InteropTokenEntry {
  const sections: ProjectDetailsSection[] = [
    {
      type: 'InteropTokenVolumeSection',
      props: {
        id: 'interop-volume',
        title: 'Volume and flows',
        tokenId: token.id,
        interopChains,
        isPriceUnreliable: token.isPriceUnreliable,
        snapshotTimestamp: lastSyncedAt,
      },
    },
    {
      type: 'InteropTokenProtocolsSection',
      props: {
        id: 'interop-protocols',
        title: 'Top protocols',
      },
    },
  ]

  if (relationsGraph) {
    sections.push({
      type: 'InteropTokenOnchainDeploymentsSection',
      props: {
        id: 'onchain-deployments',
        title: 'Onchain deployments',
        graph: relationsGraph,
      },
    })
  }

  if (hasRawTransfers) {
    sections.push({
      type: 'InteropTokenTransfersSection',
      props: {
        id: 'interop-transfers',
        title: 'Transfers',
        tokenId: token.id,
        interopChains,
      },
    })
  }

  return {
    sections,
    deploymentsCount: relationsGraph
      ? getDeploymentsByVolume(relationsGraph).length
      : 0,
  }
}
