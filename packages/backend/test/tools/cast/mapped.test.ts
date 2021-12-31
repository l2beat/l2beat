import { expect } from 'earljs'

import { as } from '../../../src/tools/cast'
import { CastError } from '../../../src/tools/cast/CastError'

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
    expect(result).toEqual(-15)
  })

  it('throws for values other than strings', () => {
    const asIntFromString = as.mapped(as.string, stringToInt)
    expect(() => asIntFromString(-15)).toThrow(CastError)
  })

  it('throws for values strings that do', () => {
    const asIntFromString = as.mapped(as.string, stringToInt)
    expect(() => asIntFromString('asd')).toThrow(TypeError)
  })
})
