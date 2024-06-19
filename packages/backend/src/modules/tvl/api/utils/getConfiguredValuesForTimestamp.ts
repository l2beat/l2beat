import { assert } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import { ValueRecord } from '../../repositories/ValueRepository'
import { ApiProject } from './types'

export function getConfiguredValuesForTimestamp(
  values: ValueRecord[],
  project: ApiProject,
  timestamp: UnixTime,
  lagging: Map<string, { latestValue: ValueRecord }>,
  syncing: Set<string>,
) {
  const configuredSources = Array.from(project.sources.entries())
    .filter(([_, source]) => source.minTimestamp.lte(timestamp))
    .filter(([name, _]) => !syncing.has(`${project.id}-${name}`))
    .map(([name, _]) => name)

  const configuredValues = values.filter((v) =>
    configuredSources.includes(v.dataSource),
  )

  const valuesSources = values.map((x) => x.dataSource)
  const missingSources = configuredSources.filter(
    (s) => !valuesSources.includes(s),
  )

  for (const source of missingSources) {
    const laggingEntry = lagging.get(`${project.id}-${source}`)
    assert(laggingEntry, `Missing lagging entry for ${project.id}-${source}`)

    configuredValues.push({
      ...laggingEntry.latestValue,
      timestamp: timestamp,
    })
  }

  return configuredValues
}
