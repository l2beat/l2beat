import type { Project } from '@l2beat/config'
import type { InteropTokenOnchainDeploymentsRow } from '~/components/projects/sections/interop/onchain-deployments/InteropTokenOnchainDeploymentsSection'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import { manifest } from '~/utils/Manifest'
import type { InteropTokenOnchainDeployment } from './getInteropTokenOnchainDeployments'

export interface InteropTokenEntry {
  sections: ProjectDetailsSection[]
  deploymentsCount: number
}

export function getInteropTokenEntry(
  tokenId: string,
  interopChains: InteropChainWithIcon[],
  projectsWithChains: Project<'chainConfig'>[],
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
    sections.push({
      type: 'InteropTokenOnchainDeploymentsSection',
      props: {
        id: 'onchain-deployments',
        title: 'Onchain deployments',
        deployments: deployments.map((deployment) =>
          toDeploymentRow(deployment, chainInfoMap),
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

function toDeploymentRow(
  deployment: InteropTokenOnchainDeployment,
  chainInfoMap: ChainInfoMap,
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
