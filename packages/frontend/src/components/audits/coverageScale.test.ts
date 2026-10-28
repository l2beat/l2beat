import { expect } from 'earl'
import { getValueDomain, getValueTicks } from './coverageScale'

describe(getValueDomain.name, () => {
  it('pads the visible range on both sides', () => {
    expect(getValueDomain([7400, 7900, 7600])).toEqual({
      min: 7325,
      max: 7975,
    })
  })

  it('never narrows below a few units', () => {
    expect(getValueDomain([80, 80])).toEqual({ min: 73.5, max: 86.5 })
  })

  it('never goes below zero', () => {
    expect(getValueDomain([0, 100])).toEqual({ min: 0, max: 115 })
  })

  it('has a span without values', () => {
    expect(getValueDomain([])).toEqual({ min: 0, max: 10 })
  })
})

describe(getValueTicks.name, () => {
  it('picks round steps that fit a handful of ticks', () => {
    expect(getValueTicks({ min: 7325, max: 7975 })).toEqual([7400, 7600, 7800])
    expect(getValueTicks({ min: 0, max: 115 })).toEqual([0, 50, 100])
    expect(getValueTicks({ min: 3500, max: 14800 })).toEqual([5000, 10000])
    expect(getValueTicks({ min: 0, max: 10 })).toEqual([0, 5, 10])
  })
})
