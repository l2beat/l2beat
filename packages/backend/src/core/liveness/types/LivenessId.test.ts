import { hashJson } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { LivenessId } from './LivenessId'

describe(LivenessId.name, () => {
  it('generates unique strings', () => {
    const input = ['a', 'b', 'c']

    const id = LivenessId(input)
    const expected = hashJson(input).slice(2, 10)
    expect(id.toString()).toEqual(expected)
  })

  it('works for empty array', () => {
    const id = LivenessId([])
    const expected = hashJson([]).slice(2, 10)
    expect(id.toString()).toEqual(expected)
  })

  it('generates random string', () => {
    const first = LivenessId.random()
    const second = LivenessId.random()
    expect(first).not.toEqual(second)
  })
})
