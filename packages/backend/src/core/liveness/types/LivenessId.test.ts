import { expect } from 'earl'

import { LivenessId } from './LivenessId'

describe(LivenessId.name, () => {
  it('generates identifier from array of strings', () => {
    const input = ['a', 'b', 'c']

    const id = LivenessId(input)
    const expected = 'fa1844c2'
    expect(id.toString()).toEqual(expected)
  })

  it('works for empty array', () => {
    const id = LivenessId([])
    const expected = '4f53cda1'
    expect(id.toString()).toEqual(expected)
  })

  describe('.random', () => {
    it('generates random string', () => {
      const first = LivenessId.random()
      const second = LivenessId.random()
      expect(first).not.toEqual(second)
    })
  })
})
