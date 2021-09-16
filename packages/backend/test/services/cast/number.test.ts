import { expect } from 'chai'

import { as } from '../../../src/services/cast'
import { CastError } from '../../../src/services/cast/CastError'

describe('as.number', () => {
  it('returns the value passed', () => {
    const result = as.number(-42.6)
    expect(result).to.equal(-42.6)
  })

  it('throws for values other than numbers', () => {
    expect(() => as.number('foo')).to.throw(CastError)
  })
})
