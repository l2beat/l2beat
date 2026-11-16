import { expect } from 'earl'
import { releaseVelocity } from './useDragToPan'

describe(releaseVelocity.name, () => {
  // A slow start, then 1 px/ms right and 0.4 px/ms down over the last 100 ms
  const trail = [
    { time: 0, at: { x: 0, y: 0 } },
    { time: 100, at: { x: 10, y: 0 } },
    { time: 150, at: { x: 60, y: 20 } },
    { time: 200, at: { x: 110, y: 40 } },
  ]

  it('takes the speed of the last 100 ms of travel', () => {
    expect(releaseVelocity(trail, 208)).toEqual({ x: 1, y: 0.4 })
  })

  it('does not fling a finger that rested before letting go', () => {
    expect(releaseVelocity(trail, 260)).toEqual(undefined)
  })

  it('does not fling from a single sample', () => {
    expect(releaseVelocity(trail.slice(-1), 208)).toEqual(undefined)
  })
})
