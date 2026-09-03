import type { Project } from '@l2beat/config'
import { MANUAL_RELATION_PLUGIN } from '@l2beat/shared-pure'
import type { InteropTokenOnchainDeploymentsRow } from '~/components/projects/sections/interop/onchain-deployments/InteropTokenOnchainDeploymentsSection'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import { getLogger } from '~/server/utils/logger'
import { createInteropProjectResolver } from '../utils/createInteropProjectResolver'
import { toInteropProjectIconListItems } from '../utils/toInteropProjectIconListItem'
import { deploymentKey } from './buildTokenRelationsGraph'
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
    const chainInfoMap = getChainDisplayInfo(
      deployments.map((deployment) => deployment.chain),
      interopChains,
      projectsWithChains,
    )
    const resolveProjects = createInteropProjectResolver(interopProjects)
    const relationsGraph = getInteropTokenRelationsGraph(
      tokenId,
      deployments,
      relations,
      chainInfoMap,
      resolveProjects,
    )
    const byKey = new Map(deployments.map((d) => [deploymentKey(d), d]))
    sections.push({
      type: 'InteropTokenOnchainDeploymentsSection',
      props: {
        id: 'onchain-deployments',
        title: 'Onchain deployments',
        deployments: relationsGraph.nodes
          .flatMap((node) => node.deployments)
          .flatMap((deployment) => {
            const source = byKey.get(
              deploymentKey({
                chain: deployment.chain.id,
                address: deployment.address,
              }),
            )
            if (!source) return []
            return [
              {
                ...deployment,
                minters: resolveMinters(source, tokenId, resolveProjects),
                isSupported: source.isSupported,
              },
            ]
          })
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

function resolveMinters(
  deployment: InteropTokenOnchainDeployment,
  abstractTokenId: string,
  resolveProjects: ReturnType<typeof createInteropProjectResolver>,
): InteropTokenOnchainDeploymentsRow['minters'] {
  const projects = deployment.mintingPlugins.flatMap(
    ({ plugin, bridgeType, relatedChain }) => {
      // A manually added relation names no interop plugin, so it can never
      // resolve to an interop project. Skipped deliberately — not warned
      // about — until the public site decides how to present manual bridges.
      if (plugin === MANUAL_RELATION_PLUGIN) {
        return []
      }
      // Sides are arbitrary — the matcher is symmetric. A relation records
      // only the minted endpoint's abstract token, hence no dstAbstractTokenId.
      const matched = resolveProjects({
        plugin,
        bridgeType,
        srcChain: deployment.chain,
        dstChain: relatedChain,
        srcAbstractTokenId: abstractTokenId,
      })

      if (matched.length === 0) {
        logger.warn('Could not resolve minting plugin to an interop project', {
          plugin,
          bridgeType,
          chain: deployment.chain,
          relatedChain,
          address: deployment.address,
          abstractTokenId,
        })
      }

      return matched
    },
  )

  return toInteropProjectIconListItems(projects)
}
