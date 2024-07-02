import { UnixTime, assert } from '@l2beat/shared-pure'
import { type TvlProject } from './get-tvl-projects'
import { db } from '~/server/database'
import { type Dictionary, groupBy } from 'lodash'
import { type Value } from '@l2beat/database'

export async function getValuesForProjects(
  projects: TvlProject[],
  target: UnixTime,
) {
  const values = await db.value.getForProjects(projects.map((p) => p.id))
  const valuesByProject = groupBy(values, 'projectId')

  const result: Dictionary<Dictionary<Value[]>> = {}

  for (const [projectId, projectValues] of Object.entries(valuesByProject)) {
    const valuesByTimestamp = groupBy(projectValues, 'timestamp')
    const project = projects.find((p) => p.id === projectId)
    assert(project, `Project ${projectId.toString()} not found`)

    const valuesByTimestampForProject: Dictionary<Value[]> = {}

    for (const [timestamp, values] of Object.entries(valuesByTimestamp)) {
      // TODO: Check if timestamp should be calculated

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
      valuesByTimestamp[target.toString()],
      `Missing value for last hour for ${projectId}, timestamp: ${target.toString()}`,
    )

    result[projectId] = valuesByTimestampForProject
  }

  return result
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
