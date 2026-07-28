import type { ProtocolEntry } from '~/server/features/scaling/interop/types'
import { InteropTopItems } from '../top-items/TopItems'

const VISIBLE_PROTOCOL_COUNT = 6

export function TopProtocolsCell({
  protocols,
}: {
  protocols: ProtocolEntry[]
}) {
  const visible = protocols.slice(0, VISIBLE_PROTOCOL_COUNT)
  const remainingCount = protocols.length - visible.length

  return (
    <InteropTopItems
      topItems={{
        items: visible.map((p) => ({
          id: p.id.toString(),
          displayName: p.name,
          iconUrl: p.iconUrl,
          volume: p.volume,
        })),
        remainingCount,
      }}
      type="cell"
      hideDialog
    />
  )
}
