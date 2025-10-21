import type { Database } from '@l2beat/database'
import type { ProjectId } from '@l2beat/shared-pure'
import type { BreakdownItem } from './types'

export async function getTvsChartQuery(
  db: Database,
  projects: ProjectId[],
): Promise<BreakdownItem[]> {
  const tvs = await db.tvsTokenValue.getTvsChartBySource(projects)
  console.log('some random coee change to change cache key')
  const breakdownMap = new Map<string, BreakdownItem>()
  for (const record of tvs) {
    let mapItem = breakdownMap.get(record.timestamp)
    if (!mapItem) {
      mapItem = { timestamp: record.timestamp }
    }
    mapItem[record.source] = record.value
    mapItem['total'] =
      ((mapItem['total'] as number) ?? 0) + Number(record.value)
    breakdownMap.set(record.timestamp, mapItem)
  }

  return Array.from(breakdownMap.values())
}
