import type { Project } from '@l2beat/config'
import type { InteropChainWithIcon } from '~/pages/interop/components/chain-selector/types'
import { manifest } from '~/utils/Manifest'

export interface ChainDisplayInfo {
  name: string
  iconUrl: string | undefined
  explorerUrl: string | undefined
}

export type ChainDisplayInfoMap = Map<string, ChainDisplayInfo>

export function getChainDisplayInfo(
  chains: string[],
  interopChains: InteropChainWithIcon[],
  projectsWithChain: Project<'chainConfig'>[],
): ChainDisplayInfoMap {
  const map: ChainDisplayInfoMap = new Map()
  for (const chain of chains) {
    const interopChain = interopChains.find((c) => c.id === chain)
    if (interopChain) {
      map.set(chain, {
        name: interopChain.name,
        iconUrl: interopChain.iconUrl,
        explorerUrl: interopChain.explorerUrl,
      })
      continue
    }

    const l2Project = projectsWithChain.find(
      (c) => c.chainConfig.name === chain,
    )
    if (l2Project) {
      map.set(chain, {
        name: l2Project.name,
        iconUrl: manifest.getUrl(`/icons/${l2Project.slug}.png`),
        explorerUrl: l2Project.chainConfig.explorerUrl,
      })
    }
  }
  return map
}

export function getExplorerAddressUrl(
  chain: ChainDisplayInfo | undefined,
  address: string,
): string | undefined {
  return chain?.explorerUrl && address.startsWith('0x')
    ? `${chain.explorerUrl}/address/${address}`
    : undefined
}
