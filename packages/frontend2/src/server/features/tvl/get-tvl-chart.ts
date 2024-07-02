import { type Value } from '@l2beat/database'
import { getEthPrices } from './get-eth-prices'
import { getTvlProjects } from './get-tvl-projects'
import { getTvlValuesForProjects } from './get-tvl-values-for-projects'
import { type TvlChartRange } from './range-utils'

export async function getTvlChart({ range }: { range: TvlChartRange }) {
  const projects = getTvlProjects()
  const ethPrices = await getEthPrices()

  const valuesByProjectByTimestamp = await getTvlValuesForProjects(
    projects,
    range,
  )

  return valuesByProjectByTimestamp
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
