import { INTEROP_CHAINS } from '@l2beat/config'
import { manifest } from '~/utils/Manifest'

export interface InteropChainDetails {
  name: string
  iconUrl: string
  explorerUrl: string
}

export const INTEROP_CHAIN_DETAILS = new Map<string, InteropChainDetails>(
  INTEROP_CHAINS.map((chain) => [
    chain.id,
    {
      name: chain.name,
      iconUrl: manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
      explorerUrl: chain.explorerUrl,
    },
  ]),
)
