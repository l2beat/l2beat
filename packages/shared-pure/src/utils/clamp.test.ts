import { expect } from 'earl'
import { clamp } from './clamp.js'

describe(clamp.name, () => {
  const table: Array<[number, number, number, number]> = [
    [-10, -5, 5, -5],
    [10, -5, 5, 5],
    [1, 1, 3, 1],
    [3, 1, 3, 3],
    [0, 0, 0, 0],
    [1.5, 1, 2, 1.5],
  ]

  table.forEach(([value, min, max, expected]) => {
    it(`clamps ${value} between ${min} and ${max} → ${expected}`, () => {
      expect(clamp(value, min, max)).toEqual(expected)
    })
  })
})
