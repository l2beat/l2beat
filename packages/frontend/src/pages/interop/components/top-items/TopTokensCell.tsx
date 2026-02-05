import type { TokenData } from '~/server/features/scaling/interop/types'
import type { TopItem } from './columns'
import { InteropTopItemsCell } from './TopItemsCell'

export function TopTokensCell({
  tokens,
  protocol,
  showNetMintedValueColumn,
}: {
  tokens: TokenData[]
  protocol: {
    name: string
    iconUrl: string
  }
  showNetMintedValueColumn?: boolean
}) {
  const items: TopItem[] = tokens.map((token) => ({
    id: token.id,
    displayName: token.symbol,
    iconUrl: token.iconUrl,
    volume: token.volume,
    transferCount: token.transferCount,
    avgDuration: token.avgDuration,
    avgValue: token.avgValue,
    netMintedValue: token.netMintedValue,
  }))

  return (
    <InteropTopItemsCell
      items={items}
      itemType="tokens"
      protocol={protocol}
      showNetMintedValueColumn={showNetMintedValueColumn}
    />
  )
}
