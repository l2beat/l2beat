import type { ProjectValueRecord } from '@l2beat/database'
import type { ProjectId, ProjectValueType } from '@l2beat/shared-pure'
import { UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generate-timestamps'
import { getRangeWithMax } from '~/utils/range/range'
import { fillTvsValuesForTimestamps } from './fill-tvs-values-for-timestamps'
import { getTvsTargetTimestamp } from './get-tvs-target-timestamp'
import type { TvsChartRange } from './range'
import { rangeToResolution } from './range'

export async function getTvsValuesForProjects(
  projectIds: ProjectId[],
  range: TvsChartRange,
  type?: ProjectValueType,
) {
  const db = getDb()
  const resolution = rangeToResolution(range)
  const target = getTvsTargetTimestamp()
  const [from, to] = getRangeWithMax(range, resolution, {
    now: target,
  })

  const valueRecords = await db.tvsProjectValue.getByProjectsForType(
    projectIds,
    type ?? 'SUMMARY',
    [from, to],
  )

  const valuesByProject = groupBy(valueRecords, (v) => v.project)

  const result: Record<string, Record<string, ProjectValueRecord>> = {}
  for (const [projectId, projectValues] of Object.entries(valuesByProject)) {
    const valuesByTimestamp: Record<string, ProjectValueRecord> = {}
    for (const value of projectValues) {
      valuesByTimestamp[value.timestamp.toString()] = value
    }

    let minTimestamp = projectValues[0]?.timestamp

    if (!minTimestamp) {
      continue
    }

    minTimestamp = !from || minTimestamp >= from ? minTimestamp : from

    minTimestamp = UnixTime.toEndOf(
      minTimestamp,
      resolution === 'hourly'
        ? 'hour'
        : resolution === 'sixHourly'
          ? 'six hours'
          : 'day',
    )

    const timestamps = generateTimestamps([minTimestamp, target], resolution, {
      addTarget: true,
    })

    const latestKnownProjectValue = projectValues.at(-1)

    const valuesByTimestampForProject = fillTvsValuesForTimestamps(
      valuesByTimestamp,
      timestamps,
      latestKnownProjectValue,
    )
    result[projectId] = valuesByTimestampForProject
  }

  return result
}
