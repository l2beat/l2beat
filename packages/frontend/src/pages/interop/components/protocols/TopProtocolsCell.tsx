import type { ProtocolEntry } from '~/server/features/layer2s/interop/types'
import { InteropTopItems } from '../top-items/TopItems'

const VISIBLE_PROTOCOL_COUNT = 6

export function TopProtocolsCell({
  protocols,
  itemsType = 'cell',
}: {
  protocols: ProtocolEntry[]
  /** "default" matches the L2 summary's ringed 28px icons. */
  itemsType?: 'cell' | 'default'
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
      type={itemsType}
      hideDialog
    />
  )
}
