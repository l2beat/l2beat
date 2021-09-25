import { expect } from 'chai'

import { as } from '../../../src/services/cast'
import { CastError } from '../../../src/services/cast/CastError'

describe('as.mapped', () => {
  function stringToInt(value: string) {
    const int = parseInt(value)
    if (int.toString() !== value) {
      throw new TypeError('Cannot convert string to int')
    }
    return int
  }

  it('returns the value transformed', () => {
    const asIntFromString = as.mapped(as.string, stringToInt)
    const result = asIntFromString('-15')
    expect(result).to.equal(-15)
  })

  it('throws for values other than strings', () => {
    const asIntFromString = as.mapped(as.string, stringToInt)
    expect(() => asIntFromString(-15)).to.throw(CastError)
  })

  it('throws for values strings that do', () => {
    const asIntFromString = as.mapped(as.string, stringToInt)
    expect(() => asIntFromString('asd')).to.throw(TypeError)
  })
})
