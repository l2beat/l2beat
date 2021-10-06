import { expect } from 'chai'

import { as } from '../../../src/tools/cast'
import { CastError } from '../../../src/tools/cast/CastError'

describe('as.integer', () => {
  it('returns the value passed', () => {
    const result = as.integer(15)
    expect(result).to.equal(15)
  })

  it('throws for values other than numbers', () => {
    expect(() => as.integer('foo')).to.throw(CastError)
  })

  it('throws for values other than integers', () => {
    expect(() => as.integer(-42.6)).to.throw(CastError)
  })
})
