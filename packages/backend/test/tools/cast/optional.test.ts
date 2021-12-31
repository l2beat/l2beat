import { expect } from 'earljs'

import { as } from '../../../src/tools/cast'
import { CastError } from '../../../src/tools/cast/CastError'

describe('as.optional', () => {
  it('returns the value passed', () => {
    const result = as.optional(as.string)('foo')
    expect(result).toEqual('foo')
  })

  it('returns undefined for null', () => {
    const result = as.optional(as.string)(null)
    expect(result).toEqual(undefined)
  })

  it('returns undefined for undefined', () => {
    const result = as.optional(as.string)(undefined)
    expect(result).toEqual(undefined)
  })

  it('throws when nested casts throw', () => {
    expect(() => as.optional(as.string)(true)).toThrow(CastError)
  })
})
