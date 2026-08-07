import type { Database } from '@l2beat/database'
import type { InteropPlugin } from './types'

interface TypeSummary {
  plugin: string
  type: string
  count: number
  oldestTimestamp: number
  newestTimestamp: number
}

/**
 * Lists every plugin that currently has retained data, with the types it emits
 * and the timestamp span still available. The span is derived from the rows
 * themselves so that the retention window is self-documenting.
 */
export async function getInteropPluginsData(
  db: Database,
): Promise<InteropPlugin[]> {
  const [messageTypes, transferTypes] = await Promise.all([
    db.interopMessage.getTypeSummary(),
    db.interopTransfer.getTypeSummary(),
  ])

  const plugins = new Map<string, InteropPlugin>()
  const get = (plugin: string) => {
    const existing = plugins.get(plugin)
    if (existing) return existing

    const created: InteropPlugin = {
      plugin,
      messageTypes: [],
      transferTypes: [],
    }
    plugins.set(plugin, created)
    return created
  }

  for (const summary of messageTypes) {
    get(summary.plugin).messageTypes.push(toTypeSummary(summary))
  }
  for (const summary of transferTypes) {
    get(summary.plugin).transferTypes.push(toTypeSummary(summary))
  }

  const sortByType = (a: { type: string }, b: { type: string }) =>
    a.type.localeCompare(b.type)

  return Array.from(plugins.values())
    .map((plugin) => ({
      ...plugin,
      messageTypes: plugin.messageTypes.sort(sortByType),
      transferTypes: plugin.transferTypes.sort(sortByType),
    }))
    .sort((a, b) => a.plugin.localeCompare(b.plugin))
}

function toTypeSummary(summary: TypeSummary) {
  return {
    type: summary.type,
    count: summary.count,
    oldestTimestamp: summary.oldestTimestamp,
    newestTimestamp: summary.newestTimestamp,
  }
}
