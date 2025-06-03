import type { ProjectValueRecord } from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'

export function fillTvsValuesForTimestamps(
  valuesByTimestamp: Record<string, ProjectValueRecord>,
  timestamps: UnixTime[],
  latestKnownProjectValue: ProjectValueRecord | undefined,
) {
  const valuesByTimestampForProject: Record<string, ProjectValueRecord> = {}
  for (const timestamp of timestamps) {
    const value = valuesByTimestamp[timestamp.toString()]

    if (value) {
      valuesByTimestampForProject[timestamp.toString()] = value
    } else if (
      latestKnownProjectValue &&
      timestamp > latestKnownProjectValue.timestamp
    ) {
      // Forward fill values with latest known value
      valuesByTimestampForProject[timestamp.toString()] =
        latestKnownProjectValue
    }
  }
  return valuesByTimestampForProject
}
