import { expect } from 'earl'
import { classify } from './evaluate'
import type { Palette } from './tiles'

function palette(
  colorStops: { color: string; stop: number | null }[],
  continuity: 'above' | 'below' | 'all' | 'none' = 'all',
  rangeMin: number | null = null,
): Palette {
  return { params: { colorStops, continuity, rangeMin } }
}

describe('classify', () => {
  it('handles liveness tiles (red below threshold, green above)', () => {
    // [Website] Requests: red from 0, green from 0.5, continuity above.
    const p = palette(
      [
        { color: '#F6726A', stop: 0 },
        { color: '#24C292', stop: 0.5 },
      ],
      'above',
      0,
    )
    expect(classify(0, p)).toEqual('red')
    expect(classify(1500, p)).toEqual('green')
  })

  it('handles error tiles (green, amber, red bands)', () => {
    // Green from min, amber from 1, red from 5.
    const p = palette([
      { color: '#24c292', stop: null },
      { color: '#fcd883', stop: 1 },
      { color: '#f6726a', stop: 5 },
    ])
    expect(classify(0, p)).toEqual('green')
    expect(classify(1, p)).toEqual('amber')
    expect(classify(4, p)).toEqual('amber')
    expect(classify(5, p)).toEqual('red')
    expect(classify(9000, p)).toEqual('red')
  })

  it('classifies non-standard colors by hue', () => {
    const p = palette([
      { color: '#03FF00', stop: 0 },
      { color: '#FF9C00', stop: 50 },
      { color: '#ff0000', stop: 1000 },
    ])
    expect(classify(10, p)).toEqual('green')
    expect(classify(100, p)).toEqual('amber')
    expect(classify(2000, p)).toEqual('red')
  })

  it('returns none without a palette', () => {
    expect(classify(42, undefined)).toEqual('none')
    expect(classify(42, { params: {} })).toEqual('none')
  })

  it('respects continuity below the first stop', () => {
    const p = palette(
      [
        { color: '#f6726a', stop: 10 },
        { color: '#24c292', stop: 20 },
      ],
      'above',
    )
    expect(classify(5, p)).toEqual('none')
    expect(classify(15, p)).toEqual('red')
    expect(classify(25, p)).toEqual('green')
  })
})
