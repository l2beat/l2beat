import { expect } from 'chai'

import { as } from '../../../src/services/cast'
import { CastError } from '../../../src/services/cast/CastError'

describe('as.optional', () => {
  it('returns the value passed', () => {
    const result = as.optional(as.string)('foo')
    expect(result).to.equal('foo')
  })

  it('returns undefined for null', () => {
    const result = as.optional(as.string)(null)
    expect(result).to.equal(undefined)
  })

  it('returns undefined for undefined', () => {
    const result = as.optional(as.string)(undefined)
    expect(result).to.equal(undefined)
  })

  it('throws when nested casts throw', () => {
    expect(() => as.optional(as.string)(true)).to.throw(CastError)
  })
})
