import type { ProjectValueRecord } from '@l2beat/database'
import type { Dictionary } from 'lodash'

export function groupValuesByTimestamp(
  values: Dictionary<Dictionary<ProjectValueRecord>>,
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
