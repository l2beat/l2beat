import { expect } from 'earl'

import { TrackedTxId } from './TrackedTxId'

describe(TrackedTxId.name, () => {
  it('generates identifier from array of strings', () => {
    const input = ['a', 'b', 'c']

    const id = TrackedTxId(input)
    const expected = 'fa1844c2'
    expect(id.toString()).toEqual(expected)
  })

  it('works for empty array', () => {
    const id = TrackedTxId([])
    const expected = '4f53cda1'
    expect(id.toString()).toEqual(expected)
  })

  describe('.random', () => {
    it('generates random string', () => {
      const first = TrackedTxId.random()
      const second = TrackedTxId.random()
      expect(first).not.toEqual(second)
    })
  })
})
