import { ProjectId } from '@l2beat/shared-pure'
import type { ProjectIconListItem } from '~/components/ProjectIconList'
import { manifest } from '~/utils/Manifest'
import {
  getProjectUrl,
  type ProjectPageMetadata,
} from '~/utils/project/getProjectUrl'
import { getPrivacyProjectChainHref } from './resolvePrivacyChain'

interface ChainProject extends ProjectPageMetadata {
  name: string
  chainConfig: { name: string }
}

/** A tracked chain the project page can switch to. */
export interface PrivacyChainLink {
  id: string
  name: string
  iconUrl: string
  href: string
}

export const UNTRACKED_CHAIN_NOTE = 'Deployed, not tracked by L2BEAT'

export function getPrivacyTrackedChains(
  chainNames: string[],
  projects: ChainProject[],
): ProjectIconListItem[] {
  return chainNames.flatMap((chainName) => {
    const project = projects.find((p) => p.chainConfig.name === chainName)
    if (!project) return []
    const hasPage =
      project.id === ProjectId.ETHEREUM ||
      project.scalingInfo ||
      project.privacyInfo ||
      project.defiInfo
    return [
      {
        id: chainName,
        name: project.name,
        iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
        href: hasPage ? getProjectUrl(project) : undefined,
      },
    ]
  })
}

/**
 * Every chain the protocol is deployed on, in config order. Chains outside
 * `trackedOn` are dimmed and say so, since the page has nothing on them.
 */
export function getPrivacyDeployedOnChains(
  deployedOn: string[],
  trackedOn: string[],
  projects: ChainProject[],
): ProjectIconListItem[] {
  return getPrivacyTrackedChains(deployedOn, projects).map((chain) =>
    trackedOn.includes(chain.id)
      ? chain
      : { ...chain, dimmed: true, description: UNTRACKED_CHAIN_NOTE },
  )
}

/** The tracked chains as links to the project page on each, in config order. */
export function getPrivacyChainLinks(
  trackedOn: string[],
  slug: string,
  projects: ChainProject[],
): PrivacyChainLink[] {
  return getPrivacyTrackedChains(trackedOn, projects).map((chain) => ({
    id: chain.id,
    name: chain.name,
    iconUrl: chain.iconUrl,
    href: getPrivacyProjectChainHref(slug, trackedOn, chain.id),
  }))
}
