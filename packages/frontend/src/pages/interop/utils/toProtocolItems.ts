import type { ProjectIconListItem } from '~/components/ProjectIconList'
import type { ProtocolDisplayable } from '~/server/features/layer2s/interop/types'

export function toProtocolItems(
  protocols: ProtocolDisplayable[],
): ProjectIconListItem[] {
  return protocols.map((protocol) => ({
    id: protocol.slug,
    name: protocol.name,
    iconUrl: protocol.iconUrl,
    href: `/interop/protocols/${protocol.slug}`,
  }))
}
