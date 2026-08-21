import type { Project } from '@l2beat/config'
import { unique } from '@l2beat/shared-pure'
import type { InteropTokenOnchainDeploymentsRow } from '~/components/projects/sections/interop/onchain-deployments/InteropTokenOnchainDeploymentsSection'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import { getLogger } from '~/server/utils/logger'
import { manifest } from '~/utils/Manifest'
import { createInteropProjectResolver } from '../utils/createInteropProjectResolver'
import type { InteropTokenOnchainDeployment } from './getInteropTokenOnchainDeployments'

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
    const chainInfoMap = deploymentsToChainInfo(
      deployments,
      interopChains,
      projectsWithChains,
    )
    const resolveProjects = createInteropProjectResolver(interopProjects)
    sections.push({
      type: 'InteropTokenOnchainDeploymentsSection',
      props: {
        id: 'onchain-deployments',
        title: 'Onchain deployments',
        deployments: deployments.map((deployment) => {
          const minters = resolveMinters(deployment, tokenId, resolveProjects)
          return toDeploymentRow(deployment, chainInfoMap, minters)
        }),
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

  return unique(projects, (project) => project.id)
    .map((project) => ({
      id: project.id,
      name: project.interopConfig.name ?? project.name,
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
      href: `/interop/protocols/${project.slug}`,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

function toDeploymentRow(
  deployment: InteropTokenOnchainDeployment,
  chainInfoMap: ChainInfoMap,
  minters: InteropTokenOnchainDeploymentsRow['minters'],
): InteropTokenOnchainDeploymentsRow {
  const chain = chainInfoMap.get(deployment.chain)
  return {
    chain: {
      name: chain?.name ?? deployment.chain,
      iconUrl: chain?.iconUrl,
    },
    address: deployment.address,
    explorerUrl:
      chain && deployment.address.startsWith('0x')
        ? `${chain.explorerUrl}/address/${deployment.address}`
        : undefined,
    symbol: deployment.symbol,
    minters,
    isSupported: deployment.isSupported,
    volume: deployment.volume,
    transferCount: deployment.transferCount,
    avgDuration: deployment.avgDuration,
  }
}

type ChainInfoMap = ReturnType<typeof deploymentsToChainInfo>
function deploymentsToChainInfo(
  deployments: InteropTokenOnchainDeployment[],
  interopChains: InteropChainWithIcon[],
  projectsWithChain: Project<'chainConfig'>[],
) {
  const map = new Map<
    string,
    { name: string; iconUrl?: string; explorerUrl?: string }
  >()
  for (const deployment of deployments) {
    const chain = interopChains.find((c) => c.id === deployment.chain)
    if (chain) {
      map.set(deployment.chain, {
        name: chain.name,
        iconUrl: chain.iconUrl,
        explorerUrl: chain.explorerUrl,
      })
      continue
    }

    const scalingProject = projectsWithChain.find(
      (c) => c.chainConfig.name === deployment.chain,
    )
    if (scalingProject) {
      map.set(deployment.chain, {
        name: scalingProject.name,
        iconUrl: manifest.getUrl(`/icons/${scalingProject.slug}.png`),
        explorerUrl: scalingProject.chainConfig.explorerUrl,
      })
    }
  }
  return map
}
