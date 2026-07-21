import type { InteropDashboardData } from '../getInteropDashboardData'
import type { ProtocolEntry } from '../types'

export const TOP_PROTOCOLS_LIMIT = 5

export function pickTopProtocolEntries(
  data:
    | Pick<InteropDashboardData, 'entries' | 'topProtocols'>
    | null
    | undefined,
  limit = TOP_PROTOCOLS_LIMIT,
): ProtocolEntry[] {
  if (!data) {
    return []
  }

  const entriesWithVolume = data.entries.filter((entry) => entry.volume > 0)
  const entriesBySlug = new Map(
    entriesWithVolume.map((entry) => [entry.slug, entry]),
  )

  const fromTopProtocols = [...(data.topProtocols ?? [])]
    .sort((a, b) => b.volume.value - a.volume.value)
    .slice(0, limit)
    .map((protocol) => entriesBySlug.get(protocol.slug))
    .filter((entry): entry is ProtocolEntry => entry !== undefined)

  if (fromTopProtocols.length > 0) {
    return fromTopProtocols
  }

  return [...entriesWithVolume]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, limit)
}
