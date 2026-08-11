import type { Project } from '@l2beat/config'
import type { UsedInProjectWithIcon } from '~/components/ProjectsUsedIn'
import type { InteropTokenOnchainDeploymentsRow } from '~/components/projects/sections/interop/onchain-deployments/InteropTokenOnchainDeploymentsSection'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import { manifest } from '~/utils/Manifest'
import {
  createMintingBridgeResolver,
  interopDisplayName,
} from '../utils/createMintingBridgeResolver'
import type { InteropTokenOnchainDeployment } from './getInteropTokenOnchainDeployments'

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
    const resolveMintingBridges = createMintingBridgeResolver(interopProjects)
    sections.push({
      type: 'InteropTokenOnchainDeploymentsSection',
      props: {
        id: 'onchain-deployments',
        title: 'Onchain deployments',
        deployments: deployments.map((deployment) =>
          toDeploymentRow(
            deployment,
            chainInfoMap,
            toMinters(deployment, tokenId, resolveMintingBridges),
          ),
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

/**
 * The bridging projects behind the plugins observed minting this deployment.
 * Several plugins can belong to the same project (a canonical bridge exposes
 * one per gateway), so the projects are deduplicated.
 */
function toMinters(
  deployment: InteropTokenOnchainDeployment,
  tokenId: string,
  resolveMintingBridges: ReturnType<typeof createMintingBridgeResolver>,
): UsedInProjectWithIcon[] {
  const byId = new Map<string, UsedInProjectWithIcon>()
  for (const { plugin, bridgeType } of deployment.mintingPlugins) {
    const projects = resolveMintingBridges({
      plugin,
      bridgeType,
      chain: deployment.chain,
      abstractTokenId: tokenId,
    })
    for (const project of projects) {
      if (byId.has(project.id)) continue
      byId.set(project.id, {
        id: project.id,
        name: interopDisplayName(project),
        slug: project.slug,
        icon: manifest.getUrl(`/icons/${project.slug}.png`),
        url: `/interop/protocols/${project.slug}`,
      })
    }
  }
  return [...byId.values()]
}

function toDeploymentRow(
  deployment: InteropTokenOnchainDeployment,
  chainInfoMap: ChainInfoMap,
  minters: UsedInProjectWithIcon[],
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
