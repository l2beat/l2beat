import { expect } from 'earljs'

import { as } from '../../../src/tools/cast'

describe('as.unknown', () => {
  it('returns the value passed', () => {
    const result = as.unknown('foo')
    expect(result).toEqual('foo')
  })
})
