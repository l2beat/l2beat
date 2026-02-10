import type { ChainData } from '~/server/features/scaling/interop/types'
import type { TopItems } from '~/server/features/scaling/interop/utils/getTop3Items'
import { InteropTopItemsCell } from './TopItemsCell'

export function TopChainsCell({
  topItems,
  protocol,
  showNetMintedValueColumn,
}: {
  topItems: TopItems<ChainData>
  protocol: {
    name: string
    iconUrl: string
  }
  showNetMintedValueColumn?: boolean
}) {
  return (
    <InteropTopItemsCell
      topItems={{
        items: topItems.items.map((chain) => ({
          id: chain.id,
          displayName: chain.name,
          iconUrl: chain.iconUrl,
          volume: chain.volume,
          transferCount: chain.transferCount,
          avgDuration: chain.avgDuration,
          avgValue: chain.avgValue,
          netMintedValue: chain.netMintedValue,
        })),
        totalCount: topItems.totalCount,
      }}
      itemType="chains"
      protocol={protocol}
      showNetMintedValueColumn={showNetMintedValueColumn}
    />
  )
}
