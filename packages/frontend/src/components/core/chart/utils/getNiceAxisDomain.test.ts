import { expect } from 'earl'

import { getNiceAxisDomain } from './getNiceAxisDomain'

describe(getNiceAxisDomain.name, () => {
  const testCases = [
    // Base TVS over a year, where Recharts picks $6.5B steps
    { domain: [0, 18.1e9], tickCount: 4, expected: [0, 24e9] },
    { domain: [0, 18.1e9], tickCount: 5, expected: [0, 20e9] },
    { domain: [0, 17.9e9], tickCount: 4, expected: [0, 18e9] },
    { domain: [0, 4200], tickCount: 4, expected: [0, 4500] },
    { domain: [0, 400e6], tickCount: 5, expected: [0, 400e6] },
    // Steps between 1 and 10 must be whole numbers
    { domain: [0, 4.2], tickCount: 4, expected: [0, 6] },
    { domain: [0, 0.42], tickCount: 4, expected: [0, 0.45] },
    { domain: [12.3e9, 13.1e9], tickCount: 4, expected: [12.3e9, 13.2e9] },
  ] as const

  for (const { domain, tickCount, expected } of testCases) {
    const startAtZero = domain[0] === 0
    it(`widens [${domain}] to [${expected}] with ${tickCount} ticks`, () => {
      expect(
        getNiceAxisDomain([...domain], tickCount, { startAtZero }),
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
