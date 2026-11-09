import { expect } from 'earl'
import { fitTicks, getYAxisTicks } from './yAxisTicks'

describe(getYAxisTicks.name, () => {
  it('grows a domain from zero to three nice ticks', () => {
    expect(getYAxisTicks([200, 1234], {}, 1)).toEqual({
      domain: [0, 1300],
      ticks: [0, 650, 1300],
    })
  })

  it('starts an auto domain near the data', () => {
    expect(getYAxisTicks([1000, 1234], { domain: 'auto' }, 1)).toEqual({
      domain: [1000, 1400],
      ticks: [1000, 1200, 1400],
    })
  })

  it('starts from zero unless one series is drawn, with autoIfSingle', () => {
    const axis = { domain: 'autoIfSingle' } as const
    expect(getYAxisTicks([1000, 1234], axis, 1).domain).toEqual([1000, 1400])
    expect(getYAxisTicks([1000, 1234], axis, 2).domain).toEqual([0, 1300])
  })

  it('keeps fixed bounds, ending on the top bound', () => {
    expect(getYAxisTicks([10, 40], { domain: [0, 100] }, 1)).toEqual({
      domain: [0, 100],
      ticks: [0, 50, 100],
    })
  })

  it('takes an auto bound from the data and adds headroom above', () => {
    expect(
      getYAxisTicks([1.2, 3], { domain: [1, 'auto'], headroom: 0.1 }, 1),
    ).toEqual({ domain: [1, 3.2], ticks: [1, 3, 3.2] })
  })

  it('steps by whole numbers when asked', () => {
    expect(getYAxisTicks([0, 1], {}, 1).ticks).toEqual([0, 0.5, 1])
    expect(getYAxisTicks([0, 1], { integer: true }, 1).ticks).toEqual([0, 1, 2])
  })

  it('has no ticks without values', () => {
    expect(getYAxisTicks(undefined, {}, 0)).toEqual({
      domain: [0, 1],
      ticks: [],
    })
  })
})

describe(fitTicks.name, () => {
  const y = { domain: [0, 1300] as [number, number], ticks: [0, 650, 1300] }

  it('keeps every tick when the labels clear each other', () => {
    expect(fitTicks(y, 100, {})).toEqual([0, 650, 1300])
  })

  it('drops labels closer than two lines to the one above', () => {
    // 25px apart, under 2 × the 15px font.
    expect(fitTicks(y, 50, {})).toEqual([0, 1300])
  })
})
