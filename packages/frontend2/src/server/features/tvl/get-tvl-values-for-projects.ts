import { type Value } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { type Dictionary, groupBy } from 'lodash'
import { db } from '~/server/database'
import { type TvlProject } from './get-tvl-projects'
import { getTvlTargetTimestamp } from './get-tvl-target-timestamp'
import {
  type TvlChartRange,
  getRangeConfig,
  type rangeToResolution,
} from './range-utils'

export async function getTvlValuesForProjects(
  projects: TvlProject[],
  range: TvlChartRange,
) {
  const target = getTvlTargetTimestamp()
  const { days, resolution } = getRangeConfig(range)
  const from = days && target.add(-days, 'days')
  const values = await (from
    ? db.value.getForProjectsInRange(
        projects.map((p) => p.id),
        {
          from,
          to: target,
        },
      )
    : db.value.getForProjects(projects.map((p) => p.id)))
  const valuesByProject = groupBy(values, 'projectId')

  const result: Dictionary<Dictionary<Value[]>> = {}

  for (const [projectId, projectValues] of Object.entries(valuesByProject)) {
    const valuesByTimestamp = groupBy(projectValues, 'timestamp')
    const project = projects.find((p) => p.id === projectId)
    assert(project, `Project ${projectId.toString()} not found`)

    const valuesByTimestampForProject: Dictionary<Value[]> = {}

    for (const [timestamp, values] of Object.entries(valuesByTimestamp)) {
      if (!shouldTimestampBeCalculated(resolution, new UnixTime(+timestamp))) {
        continue
      }

      const configuredSources = getConfiguredSourcesForTimestamp(
        values,
        project,
        new UnixTime(+timestamp),
      )

      const onlyConfiguredValues = values.filter((v) =>
        configuredSources.includes(v.dataSource),
      )

      valuesByTimestampForProject[timestamp] = onlyConfiguredValues
    }

    // TODO: Interpolate here
    assert(
      valuesByTimestampForProject[target.toString()],
      `Missing value for last hour for ${projectId}, timestamp: ${target.toString()}`,
    )

    result[projectId] = valuesByTimestampForProject
  }

  return result
}

/**
 * Ideally we shouldn't need this method, as we should get only the values we need from the database.
 */
function shouldTimestampBeCalculated(
  resolution: ReturnType<typeof rangeToResolution>,
  timestamp: UnixTime,
) {
  return (
    resolution === 'hourly' ||
    (resolution === 'sixHourly' && timestamp.isFull('six hours')) ||
    (resolution === 'daily' && timestamp.isFull('day'))
  )
}

function getConfiguredSourcesForTimestamp(
  values: Value[],
  project: TvlProject,
  timestamp: UnixTime,
) {
  const valuesSources = values.map((x) => x.dataSource)
  const configuredSources = Array.from(project.sources.values())
    .filter((s) => s.minTimestamp.lte(timestamp))
    .map((s) => s.name)

  const missingSources = configuredSources.filter(
    (s) => !valuesSources.includes(s),
  )

  // TODO: Interpolate here
  assert(
    missingSources.length === 0,
    `Missing data sources [${missingSources.join(
      ', ',
    )}] for ${project.id.toString()} at ${timestamp.toNumber()}`,
  )
  return configuredSources
}
