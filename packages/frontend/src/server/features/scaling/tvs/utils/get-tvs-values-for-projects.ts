import type { ValueRecord } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import type { Dictionary } from 'lodash'
import { groupBy } from 'lodash'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generate-timestamps'
import type { TvsProject } from './get-tvs-projects'
import { getTvsTargetTimestamp } from './get-tvs-target-timestamp'
import { getValuesStatus } from './get-tvs-values-status'
import type { TvsChartRange } from './range'
import { getRangeConfig } from './range'

export async function getTvsValuesForProjects(
  projects: TvsProject[],
  range: TvsChartRange,
) {
  const db = getDb()
  const { days, resolution } = getRangeConfig(range)
  const target = getTvsTargetTimestamp()

  const from =
    days !== null &&
    UnixTime.toStartOf(target, resolution === 'hourly' ? 'hour' : 'day') -
      days * UnixTime.DAY

  // NOTE: This cannot be optimized using from because the values need to be interpolated
  const valueRecords = await db.value.getForProjects(
    projects.map((p) => p.projectId),
  )

  const valuesByProject = groupBy(valueRecords, 'projectId')

  const result: Dictionary<Dictionary<ValueRecord[]>> = {}
  for (const [projectId, projectValues] of Object.entries(valuesByProject)) {
    const project = projects.find((p) => p.projectId === projectId)
    assert(project, `Project ${projectId.toString()} not found`)

    const valuesByTimestamp = groupBy(projectValues, 'timestamp')
    const status = getValuesStatus(project, valuesByTimestamp, target)

    const valuesByTimestampForProject: Dictionary<ValueRecord[]> = {}

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
    }).filter((t) => t <= target)

    for (const timestamp of timestamps) {
      const values = (valuesByTimestamp[timestamp.toString()] ?? []).filter(
        (v) => {
          if (status.excluded.has(v.dataSource)) {
            return false
          }
          const projectSource = project.sources.get(v.dataSource)
          if (!projectSource) {
            return false
          }

          return timestamp >= projectSource.minTimestamp
        },
      )

      const interpolatedValues = status.lagging
        .filter((l) => timestamp > l.latestTimestamp)
        .map((l) => {
          const record = valuesByTimestamp[l.latestTimestamp.toString()]?.find(
            (v) => l.id === v.dataSource,
          )
          assert(
            record,
            `Value should be defined for ${
              l.id
            } at ${l.latestTimestamp.toString()} in project ${projectId}`,
          )
          return record
        })

      valuesByTimestampForProject[timestamp.toString()] = [
        ...values,
        ...interpolatedValues,
      ]
    }

    result[projectId] = valuesByTimestampForProject
  }

  return result
}
