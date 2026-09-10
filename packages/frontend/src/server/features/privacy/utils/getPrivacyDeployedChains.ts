import type { Project } from '@l2beat/config'
import { manifest } from '~/utils/Manifest'

export interface PrivacyDeployedChain {
  id: string
  name: string
  iconUrl: string
  href?: string
}

export type PrivacyChainProject = Project<'chainConfig', 'scalingInfo'>

export function getPrivacyDeployedChains(
  chainNames: string[],
  chainProjects: PrivacyChainProject[],
): PrivacyDeployedChain[] {
  return chainNames.flatMap((chainName) => {
    const project = chainProjects.find((p) => p.chainConfig.name === chainName)
    if (!project) return []
    return [
      {
        id: chainName,
        name: project.name,
        iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
        href: project.scalingInfo
          ? `/scaling/projects/${project.slug}`
          : undefined,
      },
    ]
  })
}
