import type { TokenData } from '~/server/features/scaling/interop/utils/types'
import type { TopItem } from './columns'
import { InteropTopItemsCell } from './TopItemsCell'

export function TopTokensCell({
  tokens,
  protocol,
}: {
  tokens: TokenData[]
  protocol: {
    name: string
    iconUrl: string
  }
}) {
  const items: TopItem[] = tokens.map((token) => ({
    id: token.id,
    displayName: token.symbol,
    iconUrl: token.iconUrl,
    volume: token.volume,
    transferCount: token.transferCount,
    avgDuration: token.avgDuration,
    avgValue: token.avgValue,
  }))

  return (
    <InteropTopItemsCell items={items} itemType="tokens" protocol={protocol} />
  )
}
