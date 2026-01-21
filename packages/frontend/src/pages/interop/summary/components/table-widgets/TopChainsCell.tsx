import type { ChainData } from '~/server/features/scaling/interop/utils/getProtocolsByType'
import type { TopItem } from './TopItemsCell'
import { TopItemsCell } from './TopItemsCell'

export function TopChainsCell({ chains }: { chains: ChainData[] }) {
  const items: TopItem[] = chains.map((chain) => ({
    id: chain.id,
    displayName: chain.name,
    iconUrl: chain.iconUrl,
    volume: chain.volume,
  }))

  return <TopItemsCell items={items} itemType="chains" />
}
