import { type ValueRecord } from '@l2beat/database'
import { assert } from '@l2beat/shared-pure'
import { type Dictionary, groupBy } from 'lodash'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generate-timestamps'
import { type TvlProject } from './get-tvl-projects'
import { getTvlTargetTimestamp } from './get-tvl-target-timestamp'
import { getValuesStatus } from './get-tvl-values-status'
import { type TvlChartRange, getRangeConfig } from './range'

export async function getTvlValuesForProjects(
  projects: TvlProject[],
  range: TvlChartRange,
) {
  const db = getDb()
  const { days, resolution } = getRangeConfig(range)
  const target = getTvlTargetTimestamp()

  const from =
    days !== Infinity &&
    target
      .toStartOf(resolution === 'hourly' ? 'hour' : 'day')
      .add(-days, 'days')

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

    minTimestamp = !from || minTimestamp.gte(from) ? minTimestamp : from

    minTimestamp = minTimestamp.toEndOf(
      resolution === 'hourly'
        ? 'hour'
        : resolution === 'sixHourly'
          ? 'six hours'
          : 'day',
    )

    const timestamps = generateTimestamps([minTimestamp, target], resolution, {
      addTarget: true,
    }).filter((t) => t.lte(target))

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

          return timestamp.gte(projectSource.minTimestamp)
        },
      )

      const interpolatedValues = status.lagging
        .filter((l) => timestamp.gt(l.latestTimestamp))
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
