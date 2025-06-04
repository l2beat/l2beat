import type { ProjectValueRecord } from '@l2beat/database'

export function groupValuesByTimestamp(
  values: Record<string, Record<string, ProjectValueRecord>>,
) {
  const timestampValues: Record<string, ProjectValueRecord[]> = {}
  for (const projectValues of Object.values(values)) {
    for (const [timestamp, value] of Object.entries(projectValues)) {
      const map = timestampValues[timestamp] ?? []
      timestampValues[timestamp] = map.concat(value)
    }
  }
  return timestampValues
}
