import { expect } from 'chai'

import { as } from '../../../src/peripherals/cast'
import { CastError } from '../../../src/peripherals/cast/CastError'

describe('as.exactly', () => {
  it('returns the value passed', () => {
    const result = as.exactly(42)(42)
    expect(result).to.equal(42)
  })

  it('throws for values other than expected', () => {
    expect(() => as.exactly(42)(43)).to.throw(CastError)
  })
})
