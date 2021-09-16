import { expect } from 'chai'

import { as } from '../../../src/services/cast'
import { CastError } from '../../../src/services/cast/CastError'

describe('as.array', () => {
  it('returns empty array', () => {
    const result = as.array(as.number)([])
    expect(result).to.deep.equal([])
  })

  it('returns non-empty array', () => {
    const result = as.array(as.number)([1, 2, 3])
    expect(result).to.deep.equal([1, 2, 3])
  })

  it('throws for values other than arrays', () => {
    expect(() => as.array(as.number)({})).to.throw(CastError)
  })

  it('throws when nested casts throw', () => {
    expect(() => as.array(as.number)([1, 'foo'])).to.throw(CastError)
  })
})
