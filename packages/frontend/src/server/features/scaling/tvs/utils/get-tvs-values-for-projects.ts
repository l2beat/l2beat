import type { ProjectValueRecord } from '@l2beat/database'
import type { ProjectValueType } from '@l2beat/shared-pure'
import { UnixTime } from '@l2beat/shared-pure'
import type { Dictionary } from 'lodash'
import { groupBy } from 'lodash'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generate-timestamps'
import type { TvsProject } from './get-tvs-projects'
import { getTvsTargetTimestamp } from './get-tvs-target-timestamp'
import type { TvsChartRange } from './range'
import { getRangeConfig } from './range'

export async function getTvsValuesForProjects(
  projects: TvsProject[],
  range: TvsChartRange,
  type?: ProjectValueType,
) {
  const db = getDb()
  const { days, resolution } = getRangeConfig(range)
  const target = getTvsTargetTimestamp()

  const from =
    days === null
      ? null
      : UnixTime.toStartOf(target, resolution === 'hourly' ? 'hour' : 'day') -
        days * UnixTime.DAY

  const valueRecords = await db.tvsProjectValue.getForType(type ?? 'SUMMARY', [
    from,
    target,
  ])

  const valuesByProject = groupBy(valueRecords, 'project')

  const result: Dictionary<Dictionary<ProjectValueRecord>> = {}
  for (const [projectId, projectValues] of Object.entries(valuesByProject)) {
    const project = projects.find((p) => p.projectId === projectId)
    if (!project) {
      continue
    }

    const valuesByTimestamp: Dictionary<ProjectValueRecord> = {}
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

    const valuesByTimestampForProject: Dictionary<ProjectValueRecord> = {}
    for (const timestamp of timestamps) {
      const value = valuesByTimestamp[timestamp.toString()]

      if (value) {
        valuesByTimestampForProject[timestamp.toString()] = value
      }
    }

    result[projectId] = valuesByTimestampForProject
  }

  return result
}
