import type { TokenData } from '~/server/features/scaling/interop/utils/getProtocolsByType'
import type { TopItem } from './TopItemsCell'
import { TopItemsCell } from './TopItemsCell'

export function TopTokensCell({ tokens }: { tokens: TokenData[] }) {
  const items: TopItem[] = tokens.map((token) => ({
    id: token.id,
    displayName: token.symbol,
    iconUrl: token.iconUrl,
    volume: token.volume,
  }))

  return <TopItemsCell items={items} itemType="tokens" />
}
