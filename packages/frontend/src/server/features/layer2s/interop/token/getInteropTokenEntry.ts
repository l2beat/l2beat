import type { Project } from '@l2beat/config'
import { MANUAL_RELATION_PLUGIN } from '@l2beat/shared-pure'
import type { InteropTokenOnchainDeploymentsRow } from '~/components/projects/sections/interop/onchain-deployments/InteropTokenOnchainDeploymentsSection'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import { getLogger } from '~/server/utils/logger'
import {
  aggregatePairStats,
  deploymentPairKey,
  type InteropTokenStats,
  NO_STATS,
  pairSideKey,
  pickStats,
} from '../utils/aggregatePairStats'
import { createInteropProjectResolver } from '../utils/createInteropProjectResolver'
import { toInteropProjectIconListItems } from '../utils/toInteropProjectIconListItem'
import {
  type ChainDisplayInfoMap,
  getChainDisplayInfo,
  getExplorerAddressUrl,
} from './getChainDisplayInfo'
import type { InteropTokenOnchainDeployment } from './getInteropTokenOnchainDeployments'
import type { InteropTokenRelations } from './getInteropTokenRelations'

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
    const deploymentStats =
      relations.pairStats &&
      aggregatePairStats(relations.pairStats, pairSideKey)
    sections.push({
      type: 'InteropTokenOnchainDeploymentsSection',
      props: {
        id: 'onchain-deployments',
        title: 'Onchain deployments',
        deployments: deployments
          .map((deployment) =>
            toDeploymentRow(
              deployment,
              chainInfoMap,
              resolveMinters(deployment, tokenId, resolveProjects),
              deployment.isSupported
                ? pickStats(deploymentStats, deploymentPairKey(deployment))
                : NO_STATS,
            ),
          )
          .sort(
            (a, b) =>
              (b.volume ?? -1) - (a.volume ?? -1) ||
              a.chain.name.localeCompare(b.chain.name),
          ),
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

function toDeploymentRow(
  deployment: InteropTokenOnchainDeployment,
  chainInfoMap: ChainDisplayInfoMap,
  minters: InteropTokenOnchainDeploymentsRow['minters'],
  stats: InteropTokenStats,
): InteropTokenOnchainDeploymentsRow {
  const chain = chainInfoMap.get(deployment.chain)
  return {
    chain: {
      name: chain?.name ?? deployment.chain,
      iconUrl: chain?.iconUrl,
    },
    address: deployment.address,
    explorerUrl: getExplorerAddressUrl(chain, deployment.address),
    symbol: deployment.symbol,
    minters,
    isSupported: deployment.isSupported,
    ...stats,
  }
}
