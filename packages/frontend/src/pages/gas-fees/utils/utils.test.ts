import { expect } from 'earl'
import { optionToRange } from '~/utils/range/range'
import { compareCosts } from './compare'
import {
  formatGwei,
  formatRatio,
  formatShare,
  formatUsd,
  splitLeadingZeros,
} from './format'
import { isOnScale, logPosition, logScaleOf } from './logScale'
import { GAS_FEES_RANGES, rangeOptionOf } from './ranges'

describe(logScaleOf.name, () => {
  it('spans whole decades, at least one', () => {
    expect(logScaleOf([0.002, 0.3])).toEqual({ min: -3, max: 0 })
    expect(logScaleOf([0.1])).toEqual({ min: -1, max: 0 })
    expect(logScaleOf([0.2, 0.5])).toEqual({ min: -1, max: 0 })
  })

  it('keeps a fixed floor and ignores what cannot be placed', () => {
    expect(logScaleOf([1e-9, 25, 0, -1], -6)).toEqual({ min: -6, max: 2 })
    expect(logScaleOf([0])).toEqual({ min: -1, max: 0 })
  })
})

describe(logPosition.name, () => {
  it('is rounded, so the server and the browser agree', () => {
    const position = logPosition({ min: -6, max: 1 }, 0.0000047)
    expect(position).toEqual(Math.round(position * 1e6) / 1e6)
    expect(logPosition({ min: -2, max: 0 }, 0.1)).toEqual(0.5)
  })

  it('places nothing at zero', () => {
    expect(isOnScale({ min: -2, max: 0 }, 0)).toEqual(false)
  })
})

describe('format', () => {
  it('writes shares whole from 10% to 99%, else to one decimal', () => {
    expect([0.0004, 0.029, 0.76, 0.997, 0.9996].map(formatShare)).toEqual([
      '<0.1%',
      '2.9%',
      '76%',
      '99.7%',
      '>99.9%',
    ])
  })

  it('writes ratios as the page does', () => {
    expect([7, 52.4, 553.2, 31_914].map(formatRatio)).toEqual([
      '7.0×',
      '52×',
      '553×',
      '32,000×',
    ])
  })

  it('writes small amounts to two significant digits', () => {
    expect([0.000_000_37, 0.1, 33_500_000].map(formatUsd)).toEqual([
      '$0.00000037',
      '$0.10',
      '$33.5\u200aM',
    ])
    expect(splitLeadingZeros(formatGwei(0.0000047))).toEqual(['0.00000', '47'])
    expect([0.000_000_01, 0.03, 2, 10].map(formatGwei)).toEqual([
      '0.00000001',
      '0.03',
      '2',
      '10',
    ])
  })
})

describe(compareCosts.name, () => {
  it('words the comparison by direction', () => {
    expect(compareCosts(1, 19)).toEqual({ ratio: '19×', cheaper: true })
    expect(compareCosts(4, 2)).toEqual({ ratio: '2.0×', cheaper: false })
  })

  it('says nothing without two positive costs', () => {
    expect(compareCosts(0, 1)).toEqual(undefined)
    expect(compareCosts(1, 0)).toEqual(undefined)
  })
})

describe(rangeOptionOf.name, () => {
  it('finds the preset each range was made from', () => {
    for (const { value } of GAS_FEES_RANGES) {
      expect(rangeOptionOf(optionToRange(value))).toEqual(value)
    }
  })
})
