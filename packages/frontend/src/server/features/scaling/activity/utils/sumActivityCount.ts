import type { ActivityRecord } from '@l2beat/database'

export function sumUopsCount(records: ActivityRecord[]) {
  return records.reduce((acc, record) => {
    acc += record.uopsCount ?? record.count
    return acc
  }, 0)
}

export function sumTpsCount(records: ActivityRecord[]) {
  return records.reduce((acc, record) => {
    acc += record.count
    return acc
  }, 0)
}
