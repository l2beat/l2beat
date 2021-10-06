import { expect } from 'chai'

import { as } from '../../../src/tools/cast'
import { CastError } from '../../../src/tools/cast/CastError'

describe('as.either', () => {
  it('returns the value matching first nested cast', () => {
    const result = as.either(as.string, as.number)('foo')
    expect(result).to.equal('foo')
  })

  it('returns the value matching second nested cast', () => {
    const result = as.either(as.string, as.number)(42)
    expect(result).to.equal(42)
  })

  it('throws for values matching neither nested cast', () => {
    expect(() => as.either(as.string, as.number)(true)).to.throw(CastError)
  })
})
