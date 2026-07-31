import type { DataAvailabilityRecord } from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'

/**
 * Hours a configuration is expected to have records for: the preview window
 * clamped to the configuration's active range, restricted to hours where the
 * layer had any data at all (so source lag is not blamed on the config).
 */
export interface ExpectedCoverage {
  projectId: string
  daLayer: string
  configurationId: string
  hours: UnixTime[]
}

export interface RecordGap {
  projectId: string
  daLayer: string
  configurationId: string
  expectedHours: number
  missingHours: UnixTime[]
}

export function findRecordGaps(
  records: DataAvailabilityRecord[],
  expected: ExpectedCoverage[],
): RecordGap[] {
  const present = new Set(
    records.map(
      (r) => `${r.projectId}:${r.daLayer}:${r.configurationId}:${r.timestamp}`,
    ),
  )

  const gaps: RecordGap[] = []
  for (const coverage of expected) {
    const missingHours = coverage.hours.filter(
      (hour) =>
        !present.has(
          `${coverage.projectId}:${coverage.daLayer}:${coverage.configurationId}:${hour}`,
        ),
    )
    if (missingHours.length > 0) {
      gaps.push({
        projectId: coverage.projectId,
        daLayer: coverage.daLayer,
        configurationId: coverage.configurationId,
        expectedHours: coverage.hours.length,
        missingHours,
      })
    }
  }

  return gaps.sort(
    (a, b) =>
      a.projectId.localeCompare(b.projectId) ||
      a.daLayer.localeCompare(b.daLayer),
  )
}
