import type { InteropDashboardData } from '~/server/features/scaling/interop/getInteropDashboardData'
import type { ProtocolEntry } from '~/server/features/scaling/interop/types'

export function pickTopProtocolEntries(
  data: InteropDashboardData | null | undefined,
  limit = 5,
): ProtocolEntry[] {
  if (!data) {
    return []
  }

  const entriesWithVolume = data.entries.filter((entry) => entry.volume > 0)
  const entriesByName = new Map(
    entriesWithVolume.map((entry) => [entry.name, entry]),
  )

  const fromTopProtocols = [...(data.topProtocols ?? [])]
    .sort((a, b) => b.volume.value - a.volume.value)
    .slice(0, limit)
    .map((protocol) => entriesByName.get(protocol.name))
    .filter((entry): entry is ProtocolEntry => entry !== undefined)

  if (fromTopProtocols.length > 0) {
    return fromTopProtocols
  }

  return [...entriesWithVolume]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, limit)
}
