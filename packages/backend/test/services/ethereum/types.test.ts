import { expect } from 'chai'

import { asData, asQuantity } from '../../../src/services/ethereum/types'
import { BigInteger, Bytes } from '../../../src/services/model'

describe('asData', () => {
  const cases = [
    { value: '0x41', expected: [0x41] },
    { value: '0x004200', expected: [0x00, 0x42, 0x00] },
    { value: '0x', expected: [] },
    { value: '0xf0f0f', error: 'Data must represent each byte as two digits' },
    { value: '004200', error: 'Data must start with 0x' },
    { value: '0xNotValid', error: 'Data must be a hex string' },
  ]
  for (const { value, error, expected } of cases) {
    if (error) {
      it(`throws for ${value}`, () => {
        expect(() => asData(value)).to.throw(TypeError, error)
      })
    } else if (expected) {
      it(`reads ${value} as ${expected}`, () => {
        const result = asData(value)
        expect(result).to.deep.equal(Bytes.fromByteArray(expected))
      })
    }
  }
})

describe('asData', () => {
  const cases = [
    { value: '0x41', expected: [0x41] },
    { value: '0x004200', expected: [0x00, 0x42, 0x00] },
    { value: '0x', expected: [] },
    { value: '0xf0f0f', error: 'Data must represent each byte as two digits' },
    { value: '004200', error: 'Data must start with 0x' },
    { value: '0xNotValid', error: 'Data must be a hex string' },
  ]
  for (const { value, error, expected } of cases) {
    if (error) {
      it(`throws for ${value}`, () => {
        expect(() => asData(value)).to.throw(TypeError, error)
      })
    } else if (expected) {
      it(`reads ${value} as ${expected}`, () => {
        const result = asData(value)
        expect(result).to.deep.equal(Bytes.fromByteArray(expected))
      })
    }
  }
})

describe('asQuantity', () => {
  const cases = [
    { value: '0x41', expected: 65 },
    { value: '0x400', expected: 1024 },
    { value: '0x0', expected: 0 },
    { value: '0x0400', error: 'Quantity cannot have leading zeroes' },
    { value: 'ff', error: 'Quantity must start with 0x' },
    { value: '0xNotValid', error: 'Quantity must be a hex string' },
  ]
  for (const { value, error, expected } of cases) {
    if (error) {
      it(`throws for ${value}`, () => {
        expect(() => asQuantity(value)).to.throw(TypeError, error)
      })
    } else if (expected !== undefined) {
      it(`reads ${value} as ${expected}`, () => {
        const result = asQuantity(value)
        expect(result).to.deep.equal(BigInteger.from(expected))
      })
    }
  }
})
