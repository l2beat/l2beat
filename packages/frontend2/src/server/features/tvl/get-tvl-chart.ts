import { type Value } from '@l2beat/database'
import { getEthPrices } from './get-eth-prices'
import { type TvlProject, getTvlProjects } from './get-tvl-projects'
import { getTvlValuesForProjects } from './get-tvl-values-for-projects'
import { type TvlChartRange } from './range-utils'

export async function getTvlChart({
  range,
  ...rest
}: { range: TvlChartRange } & (
  | { type: 'all' | TvlProject['type'] }
  | { type: 'projects'; projectIds: string[] }
)) {
  const projectsFilter =
    rest.type === 'all'
      ? () => true
      : rest.type === 'projects'
        ? (project: TvlProject) => rest.projectIds.includes(project.id)
        : (project: TvlProject) => project.type === rest.type

  const projects = getTvlProjects().filter(projectsFilter)
  const ethPrices = await getEthPrices()

  const timestampValues = Object.values(
    await getTvlValuesForProjects(projects, range),
  ).reduce<Record<string, Value[]>>((acc, projectValues) => {
    for (const [timestamp, values] of Object.entries(projectValues)) {
      if (!acc[timestamp]) {
        acc[timestamp] = []
      } else {
        acc[timestamp].push(...values)
      }
    }
    return acc
  }, {})

  return Object.entries(timestampValues).map(([timestamp, values]) => {
    const summed = sumValuesPerSource(values)
    return [
      +timestamp,
      Number(summed.native),
      Number(summed.canonical),
      Number(summed.external),
      ethPrices[+timestamp],
    ] as const
  })
}

export function sumValuesPerSource(values: Value[]): {
  external: bigint
  canonical: bigint
  native: bigint
} {
  return values.reduce(
    (acc, curr) => {
      acc.canonical += curr.canonical
      acc.external += curr.external
      acc.native += curr.native
      return acc
    },
    { canonical: 0n, external: 0n, native: 0n },
  )
}
