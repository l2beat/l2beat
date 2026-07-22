import type { BasicTableRow } from '~/components/table/BasicTable'
import type {
  IntentBridgeActivityEntry,
  IntentBridgesData,
} from '~/server/features/layer2s/interop/getIntentBridgesData'
import type { ProtocolEntry } from '~/server/features/layer2s/interop/types'
import type { InteropIntentBridge } from '../getInteropIntentBridgesData'

export type IntentBridgeRow = BasicTableRow & {
  bridge: InteropIntentBridge
  activity: IntentBridgeActivityEntry | undefined
  activeChainCount: number | undefined
  activeTokenCount: number | undefined
  topRoute: ProtocolEntry['topRoute']
}

export function buildIntentBridgeRows(
  intentBridges: InteropIntentBridge[],
  data: IntentBridgesData,
): IntentBridgeRow[] {
  const activityById = new Map(
    data.activity.entries.map((entry) => [entry.id, entry]),
  )
  const tableEntriesById = new Map(
    data.table.entries.map((entry) => [entry.id, entry]),
  )

  return intentBridges
    .map((bridge) => {
      const tableEntry = tableEntriesById.get(bridge.id)
      return {
        slug: bridge.slug,
        bridge,
        activity: activityById.get(bridge.id),
        activeChainCount: getTotalTopItemsCount(tableEntry?.chains),
        activeTokenCount: getTotalTopItemsCount(tableEntry?.tokens),
        topRoute: tableEntry?.topRoute,
      }
    })
    .toSorted((a, b) => (b.activity?.volume ?? 0) - (a.activity?.volume ?? 0))
}

function getTotalTopItemsCount(
  topItems: ProtocolEntry['chains'] | ProtocolEntry['tokens'] | undefined,
): number | undefined {
  if (!topItems) return undefined
  return topItems.items.length + topItems.remainingCount
}
