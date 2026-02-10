import type { TokenData } from '~/server/features/scaling/interop/types'
import type { TopItems } from '~/server/features/scaling/interop/utils/getTop3Items'
import { InteropTopItemsCell } from './TopItemsCell'

export function TopTokensCell({
  topItems,
  protocol,
  showNetMintedValueColumn,
}: {
  topItems: TopItems<TokenData>
  protocol: {
    name: string
    iconUrl: string
  }
  showNetMintedValueColumn?: boolean
}) {
  return (
    <InteropTopItemsCell
      topItems={{
        items: topItems.items.map((token) => ({
          id: token.id,
          displayName: token.symbol,
          iconUrl: token.iconUrl,
          volume: token.volume,
          transferCount: token.transferCount,
          avgDuration: token.avgDuration,
          avgValue: token.avgValue,
          netMintedValue: token.netMintedValue,
        })),
        totalCount: topItems.totalCount,
      }}
      itemType="tokens"
      protocol={protocol}
      showNetMintedValueColumn={showNetMintedValueColumn}
    />
  )
}
