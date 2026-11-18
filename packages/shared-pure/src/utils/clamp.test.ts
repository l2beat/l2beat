import { expect } from 'earl'
import { clamp } from './clamp.js'

describe(clamp.name, () => {
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
