import { expect } from 'chai'

import { as } from '../../../src/peripherals/cast'
import { CastError } from '../../../src/peripherals/cast/CastError'

describe('as.boolean', () => {
  it('returns the value passed', () => {
    const result = as.boolean(true)
    expect(result).to.equal(true)
  })

  it('throws for values other than booleans', () => {
    expect(() => as.boolean('foo')).to.throw(CastError)
  })
})
