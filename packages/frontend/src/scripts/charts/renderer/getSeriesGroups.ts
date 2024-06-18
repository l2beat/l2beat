import { assert } from '@l2beat/shared-pure'
import { Point } from './ChartRenderer'

export function getSeriesGroups(points: Point<unknown>[], seriesIndex: number) {
  return points.reduce<{ value: number; dashed?: boolean }[][]>(
    (acc, point) => {
      const lastGroup = acc.at(-1)
      const lastGroupSeries = lastGroup?.at(-1)
      const current = point.series.at(seriesIndex)
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
