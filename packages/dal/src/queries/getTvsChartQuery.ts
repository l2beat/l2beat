import type { Database } from '@l2beat/database'
import type { ProjectId } from '@l2beat/shared-pure'

export type BreakdownItem = { [k: string]: string | number | bigint }

export async function getTvsChartQuery(
  db: Database,
  projects: ProjectId[],
): Promise<BreakdownItem[]> {
  const tvs = await db.tvsTokenValue.getTvsChartBySource(projects)

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
