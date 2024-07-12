import { type Value } from '@l2beat/database'
import { unstable_noStore as noStore } from 'next/cache'
import { getEthPrices } from './get-eth-prices'
import { type TvlProject, getTvlProjects } from './get-tvl-projects'
import { getTvlValuesForProjects } from './get-tvl-values-for-projects'
import { type TvlChartRange } from './range-utils'
import { sumValuesPerSource } from './sum-values-per-source'

export async function getTvlChart({
  range,
  ...rest
}: { range: TvlChartRange } & (
  | { type: 'all' | TvlProject['type'] }
  | { type: 'projects'; projectIds: string[] }
)) {
  noStore()
  const projectsFilter = (() => {
    if (rest.type === 'all') {
      return () => true
    }
    if (rest.type === 'projects') {
      const projectIds = new Set(rest.projectIds)
      return (project: TvlProject) => projectIds.has(project.id)
    }

    if (rest.type === 'layer2') {
      return (project: TvlProject) =>
        ['layer2', 'layer3'].includes(project.type)
    }

    return (project: TvlProject) => project.type === rest.type
  })()

  const projects = getTvlProjects().filter(projectsFilter)
  const ethPrices = await getEthPrices()

  const timestampValues = Object.values(
    await getTvlValuesForProjects(projects, range),
  ).reduce<Record<string, Value[]>>((acc, projectValues) => {
    for (const [timestamp, values] of Object.entries(projectValues)) {
      const map = acc[timestamp] ?? []
      acc[timestamp] = map.concat(values)
    }
    return acc
  }, {})

  return Object.entries(timestampValues).map(([timestamp, values]) => {
    const summed = sumValuesPerSource(values, true)
    return [
      +timestamp,
      Number(summed.native),
      Number(summed.canonical),
      Number(summed.external),
      ethPrices[+timestamp]!,
    ] as const
  })
}
