import { assert } from '@l2beat/shared-pure'
import type { ChartContextValue } from '../chart-context'
import { FIRST_LABEL_HEIGHT_PX } from '../chart-labels'
import { getSeriesGroups } from './get-series-groups'

export function getRenderPaths<T extends { timestamp: number }>({
  chart,
  context,
}: {
  chart: HTMLCanvasElement
  context: ChartContextValue<T>
}) {
  const usableHeight =
    chart.height - FIRST_LABEL_HEIGHT_PX * window.devicePixelRatio

  return context.valuesStyle.flatMap((series, si) => {
    let startX: number | undefined
    let lastX: number | undefined
    let lastY: number | undefined
    let minY = Infinity

    const seriesGroup = getSeriesGroups(context.columns, si)

    return {
      style: series,
      paths: seriesGroup.map((group, gi) => {
        const prevGroup = gi > 0 ? seriesGroup.at(gi - 1) : undefined
        const path = new Path2D()
        minY = Infinity

        for (const [groupPointIndex, point] of group.entries()) {
          const pointIndex = (prevGroup?.length ?? 0) + groupPointIndex
          const x = (pointIndex / (context.columns.length - 1)) * chart.width
          const y = chart.height - context.getY(point.value) * usableHeight
          minY = Math.min(minY, y)

          if (pointIndex === 0) {
            path.moveTo(x, y)
          } else if (
            groupPointIndex === 0 &&
            lastX !== undefined &&
            lastY !== undefined
          ) {
            startX = lastX
            path.moveTo(lastX, lastY)
            path.lineTo(x, y)
          } else {
            path.lineTo(x, y)
          }
          lastX = x
          lastY = y
        }
        assert(lastX !== undefined, 'lastX is undefined')
        return {
          path,
          dashed: group.at(0)?.dashed ?? false,
          startX,
          lastX,
          minY,
        }
      }),
    }
  })
}
