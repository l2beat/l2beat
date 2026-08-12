import type { Project } from '@l2beat/config'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import { manifest } from '~/utils/Manifest'

export interface ChainDisplayInfo {
  name: string
  iconUrl?: string
  explorerUrl?: string
}

export type ChainDisplayInfoMap = Map<string, ChainDisplayInfo>

/**
 * How a chain a token is deployed on should be named and pictured. Interop
 * chains carry their own presentation; anything else is matched against the
 * scaling projects by chain name.
 */
export function getChainDisplayInfo(
  chains: string[],
  interopChains: InteropChainWithIcon[],
  projectsWithChain: Project<'chainConfig'>[],
): ChainDisplayInfoMap {
  const map: ChainDisplayInfoMap = new Map()
  for (const chain of chains) {
    if (map.has(chain)) continue

    const interopChain = interopChains.find((c) => c.id === chain)
    if (interopChain) {
      map.set(chain, {
        name: interopChain.name,
        iconUrl: interopChain.iconUrl,
        explorerUrl: interopChain.explorerUrl,
      })
      continue
    }

    const scalingProject = projectsWithChain.find(
      (c) => c.chainConfig.name === chain,
    )
    if (scalingProject) {
      map.set(chain, {
        name: scalingProject.name,
        iconUrl: manifest.getUrl(`/icons/${scalingProject.slug}.png`),
        explorerUrl: scalingProject.chainConfig.explorerUrl,
      })
    }
  }
  return map
}
