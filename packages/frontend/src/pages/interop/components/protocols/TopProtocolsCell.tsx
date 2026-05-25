import type { ProtocolEntry } from '~/server/features/scaling/interop/types'
import { buildInteropUrl } from '../../utils/buildInteropUrl'
import type { InteropSelection } from '../../utils/types'
import { InteropTopItems } from '../top-items/TopItems'

const VISIBLE_PROTOCOL_COUNT = 6

export function TopProtocolsCell({
  protocols,
  apiSelection,
}: {
  protocols: ProtocolEntry[]
  apiSelection: InteropSelection
}) {
  const visible = protocols.slice(0, VISIBLE_PROTOCOL_COUNT)
  const remainingCount = protocols.length - visible.length

  return (
    <InteropTopItems
      topItems={{
        items: visible.map((p) => ({
          id: String(p.id),
          displayName: p.name,
          iconUrl: p.iconUrl,
          volume: p.volume,
          href: buildInteropUrl(
            `/interop/protocols/${p.slug}`,
            apiSelection,
            'public',
          ),
        })),
        remainingCount,
      }}
      type="cell"
      hideDialog
    />
  )
}
