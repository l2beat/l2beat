import type { ChainData } from '~/server/features/scaling/interop/utils/getProtocolEntries'
import type { TopItem } from './columns'
import { InteropTopItemsCell } from './TopItemsCell'

export function TopChainsCell({
  chains,
  protocol,
  showNetMintedValueColumn,
}: {
  chains: ChainData[]
  protocol: {
    name: string
    iconUrl: string
  }
  showNetMintedValueColumn?: boolean
}) {
  const items: TopItem[] = chains.map((chain) => ({
    id: chain.id,
    displayName: chain.name,
    iconUrl: chain.iconUrl,
    volume: chain.volume,
    transferCount: chain.transferCount,
    avgDuration: chain.avgDuration,
    avgValue: chain.avgValue,
    netMintedValue: chain.netMintedValue,
  }))

  return (
    <InteropTopItemsCell
      items={items}
      itemType="chains"
      protocol={protocol}
      showNetMintedValueColumn={showNetMintedValueColumn}
    />
  )
}
