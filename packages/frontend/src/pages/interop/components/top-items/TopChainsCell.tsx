import type { ChainData } from '~/server/features/scaling/interop/utils/interopEntriesCommon'
import type { TopItem } from './columns'
import { InteropTopItemsCell } from './TopItemsCell'

export function TopChainsCell({
  chains,
  protocol,
}: {
  chains: ChainData[]
  protocol: {
    name: string
    iconUrl: string
  }
}) {
  const items: TopItem[] = chains.map((chain) => ({
    id: chain.id,
    displayName: chain.name,
    iconUrl: chain.iconUrl,
    volume: chain.volume,
    transferCount: chain.transferCount,
    avgDuration: chain.avgDuration,
    avgValue: chain.avgValue,
  }))

  return (
    <InteropTopItemsCell items={items} itemType="chains" protocol={protocol} />
  )
}
