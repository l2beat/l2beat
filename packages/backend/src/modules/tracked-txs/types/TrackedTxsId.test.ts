import { expect } from 'earl'

import { TrackedTxsId } from './TrackedTxsId'

describe(TrackedTxsId.name, () => {
  it('generates identifier from array of strings', () => {
    const input = ['a', 'b', 'c']

    const id = TrackedTxsId(input)
    const expected = 'fa1844c2'
    expect(id.toString()).toEqual(expected)
  })

  it('works for empty array', () => {
    const id = TrackedTxsId([])
    const expected = '4f53cda1'
    expect(id.toString()).toEqual(expected)
  })

  describe('.random', () => {
    it('generates random string', () => {
      const first = TrackedTxsId.random()
      const second = TrackedTxsId.random()
      expect(first).not.toEqual(second)
    })
  })
})
