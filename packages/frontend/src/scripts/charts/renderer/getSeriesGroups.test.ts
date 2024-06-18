import { expect } from 'earl'
import { Point } from './ChartRenderer'
import { getSeriesGroups } from './getSeriesGroups'

describe(getSeriesGroups.name, () => {
  it('should return point groups', () => {
    const points = [
      point(),
      point(),
      point({ dashed: true }),
      point({ dashed: true }),
    ]

    const result = getSeriesGroups(points, 0)

    expect(result).toEqual([
      pointGroup({ length: 2 }),
      pointGroup({ length: 2, dashed: true }),
    ])
  })

  it('should handle multiple switches', () => {
    const points = [
      point(),
      point(),
      point({ dashed: true }),
      point({ dashed: true }),
      point(),
      point(),
      point(),
      point(),
      point({ dashed: true }),
      point({ dashed: true }),
      point({ dashed: true }),
      point(),
      point({ dashed: true }),
    ]

    const result = getSeriesGroups(points, 0)

    expect(result).toEqual([
      pointGroup({ length: 2 }),
      pointGroup({ length: 2, dashed: true }),
      pointGroup({ length: 4 }),
      pointGroup({ length: 3, dashed: true }),
      pointGroup({ length: 1 }),
      pointGroup({ length: 1, dashed: true }),
    ])
  })
})

function pointGroup(opts: { length: number; dashed?: boolean }) {
  return Array.from({ length: opts.length }).map(() => ({
    value: 1,
    dashed: opts.dashed,
  }))
}

function point(opts?: { dashed: boolean }): Point<unknown> {
  return {
    series: [{ value: 1, dashed: opts?.dashed }],
    data: {},
    milestone: undefined,
  }
}
