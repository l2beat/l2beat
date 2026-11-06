import { expect } from 'earl'
import { beatAmplitude, beatShape, traceHeights } from './ekg'

describe('ekg', () => {
  describe(beatShape.name, () => {
    it('peaks at 1 in the middle and settles at the edges', () => {
      expect(beatShape(0)).toBeCloseTo(1, 0.01)
      expect(Math.abs(beatShape(-0.5))).toBeLessThan(0.01)
      expect(Math.abs(beatShape(0.5))).toBeLessThan(0.01)
    })

    it('dips below the line on both sides of the spike', () => {
      expect(beatShape(-0.07)).toBeLessThan(0)
      expect(beatShape(0.07)).toBeLessThan(0)
    })
  })

  describe(beatAmplitude.name, () => {
    it('grows with the square root of transactions', () => {
      expect(beatAmplitude(100, 100)).toEqual(1)
      expect(beatAmplitude(25, 100)).toEqual(0.5)
    })

    it('keeps a small beat for a block with no transactions', () => {
      expect(beatAmplitude(0, 100)).toEqual(0.08)
      expect(beatAmplitude(0, 0)).toEqual(0.08)
    })
  })

  describe(traceHeights.name, () => {
    it('draws each beat in the middle of its second', () => {
      // 10 seconds over 100 pixels: a second is 10 pixels
      const heights = traceHeights(
        [
          [102, 50],
          [105, 100],
        ],
        { from: 100, to: 110, width: 100 },
      )

      expect(heights.length).toEqual(101)
      expect(at(heights, 25)).toBeCloseTo(Math.sqrt(0.5), 0.01)
      expect(at(heights, 55)).toBeCloseTo(1, 0.01)
      expect(Math.abs(at(heights, 40))).toBeLessThan(0.01)
    })

    it('leaves out beats outside the window', () => {
      const heights = traceHeights(
        [
          [80, 1000],
          [105, 10],
        ],
        { from: 100, to: 110, width: 100 },
      )

      // the busiest beat shown sets the scale, not one scrolled off
      expect(at(heights, 55)).toBeCloseTo(1, 0.01)
    })
  })
})

function at(heights: Float32Array, x: number): number {
  return heights[x] ?? Number.NaN
}
