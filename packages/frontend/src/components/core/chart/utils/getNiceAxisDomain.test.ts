import { expect } from 'earl'

import { getEvenTicks, getNiceAxisDomain } from './getNiceAxisDomain'

describe(getNiceAxisDomain.name, () => {
  const testCases = [
    // Base TVS over a year, where Recharts picks $6.5B steps
    { domain: [0, 18.1e9], tickCount: 4, expected: [0, 24e9] },
    { domain: [0, 18.1e9], tickCount: 5, expected: [0, 20e9] },
    { domain: [0, 17.9e9], tickCount: 4, expected: [0, 18e9] },
    { domain: [0, 4200], tickCount: 4, expected: [0, 4500] },
    { domain: [0, 400e6], tickCount: 5, expected: [0, 400e6] },
    { domain: [0, 4.2], tickCount: 4, expected: [0, 4.5] },
    { domain: [0, 0.42], tickCount: 4, expected: [0, 0.45] },
    { domain: [12.3e9, 13.1e9], tickCount: 4, expected: [12.3e9, 13.2e9] },
    // 768 MiB steps up to 3 GiB
    {
      domain: [0, 3e9],
      tickCount: 5,
      scale: 'binary',
      expected: [0, 3 * 1024 ** 3],
    },
    // 1m 30s steps up to 6m
    { domain: [0, 330], tickCount: 5, scale: 'duration', expected: [0, 360] },
    // 2m steps up to 6m
    { domain: [0, 330], tickCount: 4, scale: 'duration', expected: [0, 360] },
  ] as const

  for (const testCase of testCases) {
    const { domain, tickCount, expected } = testCase
    const scale = 'scale' in testCase ? testCase.scale : undefined
    const startAtZero = domain[0] === 0
    it(`widens [${domain}] to [${expected}] with ${tickCount} ${scale ?? 'decimal'} ticks`, () => {
      expect(
        getNiceAxisDomain([...domain], tickCount, { startAtZero, scale }),
      ).toEqual([...expected])
    })
  }

  it('starts at zero when asked to', () => {
    expect(
      getNiceAxisDomain([12.3e9, 13.1e9], 4, { startAtZero: true }),
    ).toEqual([0, 15e9])
  })

  it('returns degenerate domains unchanged', () => {
    expect(getNiceAxisDomain([0, 0], 4, { startAtZero: true })).toEqual([0, 0])
    expect(
      getNiceAxisDomain(
        [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
        4,
        { startAtZero: false },
      ),
    ).toEqual([Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])
  })
})

describe(getEvenTicks.name, () => {
  it('spreads ticks evenly, ends included', () => {
    expect(getEvenTicks([0, 20e9], 5)).toEqual([0, 5e9, 10e9, 15e9, 20e9])
    expect(getEvenTicks([0, 0.9], 4)).toEqual([0, 0.3, 0.6, 0.9])
  })
})
