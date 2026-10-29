import { expect } from 'earl'
import { getExtent, getIsolatedPoints, plotRows } from './plotSeries'

describe(plotRows.name, () => {
  it('stacks on the series before, and a missing value leaves a gap', () => {
    const rows = [
      { a: 1, b: 2, c: 5 },
      { a: null, b: 3, c: 5 },
    ]

    const plotted = plotRows(rows, [
      { key: 'a', stack: true },
      { key: 'b', stack: true },
      { key: 'c' },
    ])

    expect(plotted.map((p) => [p.top, p.bottom])).toEqual([
      [
        { a: 1, b: 3, c: 5 },
        { a: 0, b: 1, c: null },
      ],
      [
        { a: null, b: 3, c: 5 },
        { a: null, b: 0, c: null },
      ],
    ])
  })

  it('draws a lone stacked series on an axis from the axis bottom', () => {
    const rows = [{ a: 1, b: 2, c: 3 }]

    const [plotted] = plotRows(rows, [
      { key: 'a', stack: true },
      { key: 'b', stack: true, axis: 'right' },
      { key: 'c', stack: true, axis: 'right' },
    ])

    expect(plotted?.top).toEqual({ a: 1, b: 2, c: 5 })
    expect(plotted?.bottom).toEqual({ a: null, b: 0, c: 2 })
  })
})

describe(getExtent.name, () => {
  it('spans both edges of a band and skips missing values', () => {
    const rows = [
      { lo: 2, hi: 5 },
      { lo: 1, hi: 4 },
      { lo: null, hi: null },
    ]
    const plotted = plotRows(rows, [
      { key: 'band', value: (row) => row.hi, value0: (row) => row.lo },
    ])

    expect(getExtent(plotted, ['band'])).toEqual([1, 5])
    expect(getExtent(plotted.slice(2), ['band'])).toEqual(undefined)
  })
})

describe(getIsolatedPoints.name, () => {
  it('finds values whose neighbours are both missing', () => {
    const values = [2, null, 3, null, 4, 5, null, 6]
    const plotted = plotRows(
      values.map((v) => ({ v })),
      [{ key: 'v' }],
    )

    // 4 has a neighbour; the first and last values have one row beside them.
    expect(getIsolatedPoints(plotted, 'v').map((p) => p.row.v)).toEqual([
      2, 3, 6,
    ])
  })
})
