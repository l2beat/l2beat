import type { Database } from '@l2beat/database'
import type { ProjectId } from '@l2beat/shared-pure'
import type { BreakdownItem } from './types'

export async function getTvsTableQuery(
  db: Database,
  projects: ProjectId[],
  depth: number,
): Promise<BreakdownItem[]> {
  const tvs = await db.tvsTokenValue.getTvsTableBySource(projects, depth)

  const breakdownMap = new Map<string, BreakdownItem>()
  for (const record of tvs) {
    let mapItem = breakdownMap.get(record.projectId)
    if (!mapItem) {
      mapItem = { projectId: record.projectId }
    }
    mapItem[record.source] = record.value
    mapItem['total'] =
      ((mapItem['total'] as number) ?? 0) + Number(record.value)
    breakdownMap.set(record.projectId, mapItem)
  }

  return Array.from(breakdownMap.values())
}
