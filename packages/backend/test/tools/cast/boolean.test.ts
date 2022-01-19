import { expect } from 'earljs'

import { as } from '../../../src/tools/cast'
import { CastError } from '../../../src/tools/cast/CastError'

describe('as.boolean', () => {
  it('returns the value passed', () => {
    const result = as.boolean(true)
    expect(result).toEqual(true)
  })

  it('throws for values other than booleans', () => {
    expect(() => as.boolean('foo')).toThrow(CastError)
  })
})
