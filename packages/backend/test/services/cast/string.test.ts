import { expect } from 'chai'

import { as } from '../../../src/services/cast'
import { CastError } from '../../../src/services/cast/CastError'

describe('as.string', () => {
  it('returns the value passed', () => {
    const result = as.string('foo')
    expect(result).to.equal('foo')
  })

  it('throws for values other than strings', () => {
    expect(() => as.string(42)).to.throw(CastError)
  })
})
