import { assert } from '@l2beat/shared-pure'
import type { ChartColumn } from '../chart-context'

export function getSeriesGroups(columns: ChartColumn[], seriesIndex: number) {
  return columns.reduce<{ value: number; dashed?: boolean }[][]>(
    (acc, column) => {
      const lastGroup = acc.at(-1)
      const lastGroupSeries = lastGroup?.at(-1)
      const current = column.values.at(seriesIndex)
      assert(current !== undefined, 'Programmer error: current is undefined')

      if (
        lastGroupSeries !== undefined &&
        lastGroupSeries?.dashed === current.dashed
      ) {
        lastGroup?.push(current)
      } else {
        acc.push([current])
      }

      return acc
    },
    [],
  )
}
