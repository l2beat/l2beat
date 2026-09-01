import type { InteropChain } from '@l2beat/config'
import type { Manifest } from '~/utils/Manifest'
import type { InteropChainWithIcon } from '../components/chain-selector/types'

export function mapInteropChainsToWithIcons(
  manifest: Manifest,
  chains: InteropChain[],
): InteropChainWithIcon[] {
  return chains.map((chain) => ({
    ...chain,
    iconUrl: manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
  }))
}
