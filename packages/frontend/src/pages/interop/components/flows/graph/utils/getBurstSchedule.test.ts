import { expect } from 'earl'
import { getBurstSchedule } from './getBurstSchedule'

describe(getBurstSchedule.name, () => {
  it('spaces particles evenly when they do not travel in bursts', () => {
    // 4 on screen over a 2 s travel: one sets off every 0.5 s
    const schedule = getBurstSchedule(4, 2)

    expect(schedule.begins).toEqual([0, 0.5, 1, 1.5])
    expect(schedule.cycleDuration).toEqual(2)
    expect(schedule.travelShare).toEqual(1)
  })

  it('stretches the cycle to keep a fractional rate exact', () => {
    // 2.5 on screen needs 3 particles, so each waits out a sixth of its cycle
    const schedule = getBurstSchedule(2.5, 2)

    expect(schedule.begins.length).toEqual(3)
    expect(schedule.cycleDuration).toEqual(2.4)
    expect(schedule.begins.length / schedule.cycleDuration).toEqual(2.5 / 2)
    expect(schedule.travelShare).toEqual(2.5 / 3)
  })

  it('sends particles off in groups of the burst size', () => {
    // 6 on screen over 6 s is one a second: in bursts of 3, one every 3 s
    const schedule = getBurstSchedule(6, 6, 3)

    expect(schedule.begins.length).toEqual(6)
    expect(schedule.cycleDuration).toEqual(6)
    expect(round(schedule.begins)).toEqual([0, 0.08, 0.16, 3, 3.08, 3.16])
  })

  it('keeps the rate the same whatever the burst size', () => {
    for (const burstSize of [1, 2, 3, 8]) {
      const schedule = getBurstSchedule(5.3, 2, burstSize)
      const rate = schedule.begins.length / schedule.cycleDuration

      expect(Math.abs(rate - 5.3 / 2) < 1e-9).toEqual(true)
    }
  })

  it('never makes the cycle shorter than the travel', () => {
    for (const [exactCount, burstSize] of [
      [0.2, 1],
      [0.2, 6],
      [59, 8],
      [7, 3],
    ] as const) {
      const schedule = getBurstSchedule(exactCount, 2, burstSize)

      expect(schedule.cycleDuration >= 2).toEqual(true)
      expect(schedule.travelShare <= 1).toEqual(true)
    }
  })

  it('spreads the particles of bursts that follow each other closely', () => {
    // 40 on screen over 2 s in bursts of 8: a burst every 0.4 s, too close
    // for a train of 8 with the usual gap
    const schedule = getBurstSchedule(40, 2, 8)

    expect(round(schedule.begins.slice(0, 9))).toEqual([
      0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4,
    ])
  })

  it('rounds the burst size to whole particles, never below one', () => {
    expect(getBurstSchedule(4, 2, 0.3).begins).toEqual([0, 0.5, 1, 1.5])
    expect(getBurstSchedule(4, 2, 2.4).begins.length).toEqual(4)
    expect(getBurstSchedule(4, 2, 2.6).begins.length).toEqual(6)
  })

  it('delays the first burst by a share of the gap between bursts', () => {
    // one sets off every second, so half a gap is half a second
    expect(getBurstSchedule(2, 2, 1, 0.5).begins).toEqual([0.5, 1.5])
    // in bursts of 2 the gap is 2 s
    expect(round(getBurstSchedule(2, 2, 2, 0.5).begins)).toEqual([1, 1.08])
  })
})

function round(values: number[]) {
  return values.map((v) => Math.round(v * 1000) / 1000)
}
