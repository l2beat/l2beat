import { expect } from 'chai'

import { asBigIntFromString } from '../../../src/peripherals/etherscan/asBigIntFromString'

describe('asBigIntFromString', () => {
  const cases = [
    { value: '1', expected: 1n },
    { value: '-1', expected: -1n },
    { value: '0', expected: 0n },
    { value: '12345678901234567890', expected: 12345678901234567890n },
    { value: '', error: 'Value must represent a base 10 integer' },
    { value: '0x1234', error: 'Value must represent a base 10 integer' },
    { value: 'foo', error: 'Value must represent a base 10 integer' },
  ]
  for (const { value, error, expected } of cases) {
    if (error) {
      it(`throws for ${value}`, () => {
        expect(() => asBigIntFromString(value)).to.throw(TypeError, error)
      })
    } else if (expected !== undefined) {
      it(`reads ${value} as ${expected}`, () => {
        const result = asBigIntFromString(value)
        expect(result).to.equal(expected)
      })
    }
  }
})
