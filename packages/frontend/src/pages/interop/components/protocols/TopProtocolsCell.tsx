import { formatCurrency } from '@l2beat/shared-pure'
import { ProjectIconList } from '~/components/ProjectIconList'
import type { ProtocolEntry } from '~/server/features/layer2s/interop/types'

export function TopProtocolsCell({
  protocols,
}: {
  protocols: ProtocolEntry[]
}) {
  return (
    <ProjectIconList
      projects={protocols.map((p) => ({
        id: p.id.toString(),
        name: p.name,
        iconUrl: p.iconUrl,
        href: `/interop/protocols/${p.slug}`,
        description: formatCurrency(p.volume, 'usd'),
      }))}
      title="Protocols"
    />
  )
}
