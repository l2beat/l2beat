import { expect } from 'chai'

import { as } from '../../../src/peripherals/cast'

describe('as.unknown', () => {
  it('returns the value passed', () => {
    const result = as.unknown('foo')
    expect(result).to.equal('foo')
  })
})
