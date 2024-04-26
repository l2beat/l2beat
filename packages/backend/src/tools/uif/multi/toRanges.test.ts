import { expect } from 'earl'

import { toRanges } from './toRanges'
import { Configuration } from './types'

describe(toRanges.name, () => {
  it('empty', () => {
    const ranges = toRanges([])
    expect(ranges).toEqual([
      { from: -Infinity, to: Infinity, configurations: [] },
    ])
  })

  it('single infinite configuration', () => {
    const ranges = toRanges([actual('a', 100, null)])
    expect(ranges).toEqual([
      { from: -Infinity, to: 99, configurations: [] },
      { from: 100, to: Infinity, configurations: [actual('a', 100, null)] },
    ])
  })

  it('single finite configuration', () => {
    const ranges = toRanges([actual('a', 100, 300)])
    expect(ranges).toEqual([
      { from: -Infinity, to: 99, configurations: [] },
      { from: 100, to: 300, configurations: [actual('a', 100, 300)] },
      { from: 301, to: Infinity, configurations: [] },
    ])
  })

  it('multiple overlapping configurations on the edges', () => {
    const ranges = toRanges([actual('a', 100, 300), actual('b', 300, 500)])
    expect(ranges).toEqual([
      { from: -Infinity, to: 99, configurations: [] },
      { from: 100, to: 299, configurations: [actual('a', 100, 300)] },
      {
        from: 300,
        to: 300,
        configurations: [actual('a', 100, 300), actual('b', 300, 500)],
      },
      { from: 301, to: 500, configurations: [actual('b', 300, 500)] },
      { from: 501, to: Infinity, configurations: [] },
    ])
  })

  it('multiple overlapping configurations', () => {
    const ranges = toRanges([
      actual('a', 100, 300),
      actual('b', 200, 400),
      actual('c', 300, 500),
    ])
    expect(ranges).toEqual([
      { from: -Infinity, to: 99, configurations: [] },
      { from: 100, to: 199, configurations: [actual('a', 100, 300)] },
      {
        from: 200,
        to: 299,
        configurations: [actual('a', 100, 300), actual('b', 200, 400)],
      },
      {
        from: 300,
        to: 300,
        configurations: [
          actual('a', 100, 300),
          actual('b', 200, 400),
          actual('c', 300, 500),
        ],
      },
      {
        from: 301,
        to: 400,
        configurations: [actual('b', 200, 400), actual('c', 300, 500)],
      },
      { from: 401, to: 500, configurations: [actual('c', 300, 500)] },
      { from: 501, to: Infinity, configurations: [] },
    ])
  })

  it('multiple non-overlapping configurations', () => {
    const ranges = toRanges([
      actual('a', 100, 200),
      actual('b', 300, 400),
      actual('c', 500, 600),
    ])
    expect(ranges).toEqual([
      { from: -Infinity, to: 99, configurations: [] },
      { from: 100, to: 200, configurations: [actual('a', 100, 200)] },
      { from: 201, to: 299, configurations: [] },
      { from: 300, to: 400, configurations: [actual('b', 300, 400)] },
      { from: 401, to: 499, configurations: [] },
      { from: 500, to: 600, configurations: [actual('c', 500, 600)] },
      { from: 601, to: Infinity, configurations: [] },
    ])
  })

  it('multiple overlapping and non-overlapping configurations', () => {
    const ranges = toRanges([
      actual('a', 100, 200),
      actual('b', 300, 500),
      actual('c', 400, 600),
      actual('d', 700, 800),
    ])
    expect(ranges).toEqual([
      { from: -Infinity, to: 99, configurations: [] },
      { from: 100, to: 200, configurations: [actual('a', 100, 200)] },
      { from: 201, to: 299, configurations: [] },
      { from: 300, to: 399, configurations: [actual('b', 300, 500)] },
      {
        from: 400,
        to: 500,
        configurations: [actual('b', 300, 500), actual('c', 400, 600)],
      },
      { from: 501, to: 600, configurations: [actual('c', 400, 600)] },
      { from: 601, to: 699, configurations: [] },
      { from: 700, to: 800, configurations: [actual('d', 700, 800)] },
      { from: 801, to: Infinity, configurations: [] },
    ])
  })

  it('adjacent: one configuration start where other ends', () => {
    const ranges = toRanges([actual('a', 100, 200), actual('b', 200, 300)])
    expect(ranges).toEqual([
      { from: -Infinity, to: 99, configurations: [] },
      { from: 100, to: 199, configurations: [actual('a', 100, 200)] },
      {
        from: 200,
        to: 200,
        configurations: [actual('a', 100, 200), actual('b', 200, 300)],
      },
      {
        from: 201,
        to: 300,
        configurations: [actual('b', 200, 300)],
      },
      {
        from: 301,
        to: Infinity,
        configurations: [],
      },
    ])
  })

  it('identical: two configurations with exactly the same boundaries', () => {
    const ranges = toRanges([actual('a', 100, 200), actual('b', 100, 200)])
    expect(ranges).toEqual([
      { from: -Infinity, to: 99, configurations: [] },
      {
        from: 100,
        to: 200,
        configurations: [actual('a', 100, 200), actual('b', 100, 200)],
      },
      {
        from: 201,
        to: Infinity,
        configurations: [],
      },
    ])
  })

  it('single point: configuration starts and ends in the same time', () => {
    const ranges = toRanges([actual('a', 100, 100)])
    expect(ranges).toEqual([
      { from: -Infinity, to: 99, configurations: [] },
      {
        from: 100,
        to: 100,
        configurations: [actual('a', 100, 100)],
      },
      {
        from: 101,
        to: Infinity,
        configurations: [],
      },
    ])
  })

  it('order of inputs does not affect output', () => {
    const ranges = toRanges([
      actual('b', 300, 400),
      actual('c', 500, 600),
      actual('a', 100, 200),
    ])
    expect(ranges).toEqual([
      { from: -Infinity, to: 99, configurations: [] },
      { from: 100, to: 200, configurations: [actual('a', 100, 200)] },
      { from: 201, to: 299, configurations: [] },
      { from: 300, to: 400, configurations: [actual('b', 300, 400)] },
      { from: 401, to: 499, configurations: [] },
      { from: 500, to: 600, configurations: [actual('c', 500, 600)] },
      { from: 601, to: Infinity, configurations: [] },
    ])
  })

  it('same starting point, multiple maxHeights', () => {
    const ranges = toRanges([
      actual('a', 100, 200),
      actual('b', 100, 300),
      actual('c', 100, 400),
    ])
    expect(ranges).toEqual([
      { from: -Infinity, to: 99, configurations: [] },
      {
        from: 100,
        to: 200,
        configurations: [
          actual('a', 100, 200),
          actual('b', 100, 300),
          actual('c', 100, 400),
        ],
      },
      {
        from: 201,
        to: 300,
        configurations: [actual('b', 100, 300), actual('c', 100, 400)],
      },
      {
        from: 301,
        to: 400,
        configurations: [actual('c', 100, 400)],
      },
      { from: 401, to: Infinity, configurations: [] },
    ])
  })
})

function actual(
  id: string,
  minHeight: number,
  maxHeight: number | null,
): Configuration<null> {
  return { id, properties: null, minHeight, maxHeight }
}
