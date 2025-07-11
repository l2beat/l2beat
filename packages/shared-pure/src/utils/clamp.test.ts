import { expect } from 'earl'
import { clamp } from './clamp'

describe(clamp.name, () => {
  it('clamps to the min bound when value is below', () => {
    expect(clamp(0, 1, 2)).toEqual(1)
  })

  it('clamps to the max bound when value is above', () => {
    expect(clamp(5, 1, 3)).toEqual(3)
  })

  it('returns the value when it is within the bounds', () => {
    expect(clamp(2, 1, 3)).toEqual(2)
  })

  const table: Array<[number, number, number, number]> = [
    [-10, -5, 5, -5], // far below
    [10, -5, 5, 5], // far above
    [1, 1, 3, 1], // on lower edge
    [3, 1, 3, 3], // on upper edge
    [0, 0, 0, 0], // degenerate range
    [1.5, 1, 2, 1.5], // floating-point inside
  ]

  table.forEach(([value, min, max, expected]) => {
    it(`clamps ${value} between ${min} and ${max} → ${expected}`, () => {
      expect(clamp(value, min, max)).toEqual(expected)
    })
  })
})
