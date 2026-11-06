import { expect } from 'earl'
import {
  BEAT_SHAPE,
  BEAT_WIDTH,
  beatAmplitude,
  secondsPerBeat,
  toBeats,
  tracePoints,
} from './ekg'

describe('ekg', () => {
  it('draws a beat that starts and ends on the line and peaks at 1', () => {
    expect(BEAT_SHAPE.at(0)).toEqual([-0.5, 0])
    expect(BEAT_SHAPE.at(-1)).toEqual([0.5, 0])
    expect(Math.max(...BEAT_SHAPE.map(([, y]) => y))).toEqual(1)
  })

  describe(secondsPerBeat.name, () => {
    it('sums seconds until beats are far enough apart', () => {
      expect(secondsPerBeat(40)).toEqual(1)
      expect(secondsPerBeat(10)).toEqual(4)
      expect(secondsPerBeat(5)).toEqual(7)
    })
  })

  describe(toBeats.name, () => {
    it('sums the seconds of each beat, counted from the epoch', () => {
      const beats = toBeats(
        [
          [100, 1],
          [101, 2],
          [103, 4],
          [104, 8],
        ],
        4,
      )

      expect(beats).toEqual([
        [100, 7],
        [104, 8],
      ])
    })
  })

  describe(beatAmplitude.name, () => {
    it('grows with the square root of transactions', () => {
      expect(beatAmplitude(100, 100)).toEqual(1)
      expect(beatAmplitude(25, 100)).toEqual(0.5)
    })

    it('keeps a small beat for seconds with no transactions', () => {
      expect(beatAmplitude(0, 100)).toEqual(0.08)
      expect(beatAmplitude(0, 0)).toEqual(0.08)
    })
  })

  describe(tracePoints.name, () => {
    // 100 seconds over 1000 pixels: a second is 10 pixels
    const window = { from: 0, to: 100, width: 1000 }

    it('draws each beat in the middle of its seconds, on a flat line', () => {
      const points = tracePoints(
        [
          [20, 25],
          [40, 100],
        ],
        4,
        100,
        window,
        1000,
      )

      expect(points.at(0)).toEqual([-BEAT_WIDTH, 0])
      expect(points.at(-1)).toEqual([1000, 0])
      expect(points).toInclude([220, 0.5], [420, 1])
    })

    it('leaves out the beats the trace has not reached yet', () => {
      const points = tracePoints([[40, 100]], 4, 100, window, 400)

      expect(points).toEqual([
        [-BEAT_WIDTH, 0],
        [400, 0],
      ])
    })
  })
})
