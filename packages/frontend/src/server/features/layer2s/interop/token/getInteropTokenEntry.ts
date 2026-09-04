import type { Project } from '@l2beat/config'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import { createInteropProjectResolver } from '../utils/createInteropProjectResolver'
import { getChainDisplayInfo } from './getChainDisplayInfo'
import type { InteropTokenOnchainDeployment } from './getInteropTokenOnchainDeployments'
import type { InteropTokenRelations } from './getInteropTokenRelations'
import {
  getInteropTokenRelationsGraph,
  hasTokenRelations,
} from './getInteropTokenRelationsGraph'

const logger = getLogger().for('getInteropTokenEntry')

export interface InteropTokenEntry {
  sections: ProjectDetailsSection[]
  deploymentsCount: number
}

export function getInteropTokenEntry(
  tokenId: string,
  interopChains: InteropChainWithIcon[],
  projectsWithChains: Project<'chainConfig'>[],
  interopProjects: Project<'interopConfig'>[],
  deployments: InteropTokenOnchainDeployment[],
  relations: InteropTokenRelations,
): InteropTokenEntry {
  const sections: ProjectDetailsSection[] = [
    {
      type: 'InteropTokenVolumeSection',
      props: {
        id: 'interop-volume',
        title: 'Volume and flows',
        tokenId,
        interopChains,
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

  if (deployments.length > 0) {
    const relationsGraph = getInteropTokenRelationsGraph(
      tokenId,
      deployments,
      relations,
      getChainDisplayInfo(
        deployments.map((deployment) => deployment.chain),
        interopChains,
        projectsWithChains,
      ),
      createInteropProjectResolver(interopProjects),
    )
    sections.push({
      type: 'InteropTokenOnchainDeploymentsSection',
      props: {
        id: 'onchain-deployments',
        title: 'Onchain deployments',
        deployments: relationsGraph.nodes
          .flatMap((node) => node.deployments)
          .sort(
            (a, b) =>
              (b.volume ?? -1) - (a.volume ?? -1) ||
              a.chain.name.localeCompare(b.chain.name),
          ),
        relationsGraph: hasTokenRelations(relationsGraph)
          ? relationsGraph
          : undefined,
      },
    })
  }

  sections.push({
    type: 'InteropTokenTransfersSection',
    props: {
      id: 'interop-transfers',
      title: 'Transfers',
      tokenId,
      interopChains,
    },
  })

  return { sections, deploymentsCount: deployments.length }
}
