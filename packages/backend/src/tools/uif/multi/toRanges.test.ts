import { expect } from 'earl'

import { toRanges } from './toRanges'
import type { Configuration, SavedConfiguration } from './types'

describe(toRanges.name, () => {
  it('empty', () => {
    const ranges = toRanges([])
    expect(ranges).toEqual([
      {
        from: Number.NEGATIVE_INFINITY,
        to: Number.POSITIVE_INFINITY,
        configurations: [],
      },
    ])
  })

  it('single infinite configuration', () => {
    const ranges = toRanges([saved('a', 100, null)])
    expect(ranges).toEqual([
      { from: Number.NEGATIVE_INFINITY, to: 99, configurations: [] },
      {
        from: 100,
        to: Number.POSITIVE_INFINITY,
        configurations: [actual('a', 100, null)],
      },
    ])
  })

  it('single finite configuration', () => {
    const ranges = toRanges([saved('a', 100, 300)])
    expect(ranges).toEqual([
      { from: Number.NEGATIVE_INFINITY, to: 99, configurations: [] },
      { from: 100, to: 300, configurations: [actual('a', 100, 300)] },
      { from: 301, to: Number.POSITIVE_INFINITY, configurations: [] },
    ])
  })

  it('multiple overlapping configurations on the edges', () => {
    const ranges = toRanges([saved('a', 100, 300), saved('b', 300, 500)])
    expect(ranges).toEqual([
      { from: Number.NEGATIVE_INFINITY, to: 99, configurations: [] },
      { from: 100, to: 299, configurations: [actual('a', 100, 300)] },
      {
        from: 300,
        to: 300,
        configurations: [actual('a', 100, 300), actual('b', 300, 500)],
      },
      { from: 301, to: 500, configurations: [actual('b', 300, 500)] },
      { from: 501, to: Number.POSITIVE_INFINITY, configurations: [] },
    ])
  })

  it('multiple overlapping configurations', () => {
    const ranges = toRanges([
      saved('a', 100, 300),
      saved('b', 200, 400),
      saved('c', 300, 500),
    ])
    expect(ranges).toEqual([
      { from: Number.NEGATIVE_INFINITY, to: 99, configurations: [] },
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
      { from: 501, to: Number.POSITIVE_INFINITY, configurations: [] },
    ])
  })

  it('multiple non-overlapping configurations', () => {
    const ranges = toRanges([
      saved('a', 100, 200),
      saved('b', 300, 400),
      saved('c', 500, 600),
    ])
    expect(ranges).toEqual([
      { from: Number.NEGATIVE_INFINITY, to: 99, configurations: [] },
      { from: 100, to: 200, configurations: [actual('a', 100, 200)] },
      { from: 201, to: 299, configurations: [] },
      { from: 300, to: 400, configurations: [actual('b', 300, 400)] },
      { from: 401, to: 499, configurations: [] },
      { from: 500, to: 600, configurations: [actual('c', 500, 600)] },
      { from: 601, to: Number.POSITIVE_INFINITY, configurations: [] },
    ])
  })

  it('multiple overlapping and non-overlapping configurations', () => {
    const ranges = toRanges([
      saved('a', 100, 200),
      saved('b', 300, 500),
      saved('c', 400, 600),
      saved('d', 700, 800),
    ])
    expect(ranges).toEqual([
      { from: Number.NEGATIVE_INFINITY, to: 99, configurations: [] },
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
      { from: 801, to: Number.POSITIVE_INFINITY, configurations: [] },
    ])
  })

  it('adjacent: one configuration start where other ends', () => {
    const ranges = toRanges([saved('a', 100, 200), saved('b', 200, 300)])
    expect(ranges).toEqual([
      { from: Number.NEGATIVE_INFINITY, to: 99, configurations: [] },
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
        to: Number.POSITIVE_INFINITY,
        configurations: [],
      },
    ])
  })

  it('identical: two configurations with exactly the same boundaries', () => {
    const ranges = toRanges([saved('a', 100, 200), saved('b', 100, 200)])
    expect(ranges).toEqual([
      { from: Number.NEGATIVE_INFINITY, to: 99, configurations: [] },
      {
        from: 100,
        to: 200,
        configurations: [actual('a', 100, 200), actual('b', 100, 200)],
      },
      {
        from: 201,
        to: Number.POSITIVE_INFINITY,
        configurations: [],
      },
    ])
  })

  it('single point: configuration starts and ends in the same time', () => {
    const ranges = toRanges([saved('a', 100, 100)])
    expect(ranges).toEqual([
      { from: Number.NEGATIVE_INFINITY, to: 99, configurations: [] },
      {
        from: 100,
        to: 100,
        configurations: [actual('a', 100, 100)],
      },
      {
        from: 101,
        to: Number.POSITIVE_INFINITY,
        configurations: [],
      },
    ])
  })

  it('order of inputs does not affect output', () => {
    const ranges = toRanges([
      saved('b', 300, 400),
      saved('c', 500, 600),
      saved('a', 100, 200),
    ])
    expect(ranges).toEqual([
      { from: Number.NEGATIVE_INFINITY, to: 99, configurations: [] },
      { from: 100, to: 200, configurations: [actual('a', 100, 200)] },
      { from: 201, to: 299, configurations: [] },
      { from: 300, to: 400, configurations: [actual('b', 300, 400)] },
      { from: 401, to: 499, configurations: [] },
      { from: 500, to: 600, configurations: [actual('c', 500, 600)] },
      { from: 601, to: Number.POSITIVE_INFINITY, configurations: [] },
    ])
  })

  it('same starting point, multiple maxHeights', () => {
    const ranges = toRanges([
      saved('a', 100, 200),
      saved('b', 100, 300),
      saved('c', 100, 400),
    ])
    expect(ranges).toEqual([
      { from: Number.NEGATIVE_INFINITY, to: 99, configurations: [] },
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
      { from: 401, to: Number.POSITIVE_INFINITY, configurations: [] },
    ])
  })

  it('takes currentHeight into consideration', () => {
    const ranges = toRanges([
      saved('a', 100, 200, 150),
      saved('b', 100, 300, 200),
      saved('c', 100, null, undefined),
    ])
    expect(ranges).toEqual([
      { from: Number.NEGATIVE_INFINITY, to: 99, configurations: [] },
      {
        from: 100,
        to: 150,
        configurations: [actual('c', 100, null)],
      },
      {
        from: 151,
        to: 200,
        configurations: [actual('a', 100, 200), actual('c', 100, null)],
      },
      {
        from: 201,
        to: 300,
        configurations: [actual('b', 100, 300), actual('c', 100, null)],
      },
      {
        from: 301,
        to: Number.POSITIVE_INFINITY,
        configurations: [actual('c', 100, null)],
      },
    ])
  })
})

function actual(
  id: string,
  minHeight: number,
  maxHeight: number | null,
): Configuration<null> {
  return {
    id,
    properties: null,
    minHeight,
    maxHeight,
  }
}

function saved(
  id: string,
  minHeight: number,
  maxHeight: number | null,
  currentHeight?: number,
): SavedConfiguration<null> {
  return {
    id,
    properties: null,
    minHeight,
    maxHeight,
    currentHeight: currentHeight ?? null,
  }
}
