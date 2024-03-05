import { expect } from 'earl'

import { TrackedTxsConfigHash } from './TrackedTxsConfigHash'

describe(TrackedTxsConfigHash.name, () => {
  it('generates identifier from array of strings', () => {
    const input = ['a', 'b', 'c']

    const id = TrackedTxsConfigHash(input)
    const expected = 'fa1844c2'
    expect(id.toString()).toEqual(expected)
  })

  it('works for empty array', () => {
    const id = TrackedTxsConfigHash([])
    const expected = '4f53cda1'
    expect(id.toString()).toEqual(expected)
  })

  describe('.random', () => {
    it('generates random string', () => {
      const first = TrackedTxsConfigHash.random()
      const second = TrackedTxsConfigHash.random()
      expect(first).not.toEqual(second)
    })
  })
})
