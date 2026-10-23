import { expect } from 'earl'
import { toBatches } from './toBatches.js'

describe(toBatches.name, () => {
  it('keeps the final partial batch', () => {
    expect(toBatches([1, 2, 3], 2)).toEqual([[1, 2], [3]])
  })

  it('returns no batches for empty input', () => {
    expect(toBatches([], 2)).toEqual([])
  })

  for (const size of [0, -1, 1.5, NaN, Infinity]) {
    it(`rejects invalid batch size ${size}`, () => {
      expect(() => toBatches([1, 2, 3], size)).toThrow()
    })
  }
})
