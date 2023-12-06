import { hashJson } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { LivenessId } from './LivenessId'

describe(LivenessId.name, () => {
  it('generates unique LivenessId', () => {
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
})
