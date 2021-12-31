import { expect } from 'earljs'

import { as } from '../../../src/tools/cast'
import { CastError } from '../../../src/tools/cast/CastError'

describe('as.array', () => {
  it('returns empty array', () => {
    const result = as.array(as.number)([])
    expect(result).toEqual([])
  })

  it('returns non-empty array', () => {
    const result = as.array(as.number)([1, 2, 3])
    expect(result).toEqual([1, 2, 3])
  })

  it('throws for values other than arrays', () => {
    expect(() => as.array(as.number)({})).toThrow(CastError)
  })

  it('throws when nested casts throw', () => {
    expect(() => as.array(as.number)([1, 'foo'])).toThrow(CastError)
  })
})
