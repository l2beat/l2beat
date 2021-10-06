import { expect } from 'chai'

import { as } from '../../../src/peripherals/cast'
import { CastError } from '../../../src/peripherals/cast/CastError'

describe('as.number', () => {
  it('returns the value passed', () => {
    const result = as.number(-42.6)
    expect(result).to.equal(-42.6)
  })

  it('throws for values other than numbers', () => {
    expect(() => as.number('foo')).to.throw(CastError)
  })
})
