import { expect } from 'earljs'

import { as } from '../../../src/tools/cast'
import { CastError } from '../../../src/tools/cast/CastError'

describe('as.either', () => {
  it('returns the value matching first nested cast', () => {
    const result = as.either(as.string, as.number)('foo')
    expect(result).toEqual('foo')
  })

  it('returns the value matching second nested cast', () => {
    const result = as.either(as.string, as.number)(42)
    expect(result).toEqual(42)
  })

  it('throws for values matching neither nested cast', () => {
    expect(() => as.either(as.string, as.number)(true)).toThrow(CastError)
  })
})
