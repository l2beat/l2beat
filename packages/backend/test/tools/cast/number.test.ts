import { expect } from 'earljs'

import { as } from '../../../src/tools/cast'
import { CastError } from '../../../src/tools/cast/CastError'

describe('as.number', () => {
  it('returns the value passed', () => {
    const result = as.number(-42.6)
    expect(result).toEqual(-42.6)
  })

  it('throws for values other than numbers', () => {
    expect(() => as.number('foo')).toThrow(CastError)
  })
})
