import { type ActivityRecord } from '@l2beat/database'

export function sumActivityCount(records: ActivityRecord[]) {
  return records.reduce((acc, record) => {
    acc += record.count
    return acc
  }, 0)
}
