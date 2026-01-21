import type { ChainData } from '~/server/features/scaling/interop/utils/getProtocolEntries'
import { type TopItem, TopItemsCell } from './TopItemsCell'

export function TopChainsCell({ chains }: { chains: ChainData[] }) {
  const items: TopItem[] = chains.map((chain) => ({
    id: chain.id,
    displayName: chain.name,
    iconUrl: chain.iconUrl,
    volume: chain.volume,
  }))

  return <TopItemsCell items={items} itemType="chains" />
}
