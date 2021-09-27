import { expect } from 'chai'

import {
  asData,
  asQuantity,
  toData,
  toQuantity,
} from '../../../src/services/ethereum/primitives'
import { Bytes } from '../../../src/services/model'

describe('asData', () => {
  const cases = [
    { value: '0x41', expected: [0x41] },
    { value: '0x004200', expected: [0x00, 0x42, 0x00] },
    { value: '0x', expected: [] },
    { value: '0x004200', length: 3, expected: [0x00, 0x42, 0x00] },
    {
      value: '0x004200',
      length: 4,
      error: 'Length mismatch, expected 4 bytes',
    },
    { value: '0xf0f0f', error: 'Data must represent each byte as two digits' },
    { value: '004200', error: 'Data must start with 0x' },
    { value: '0xNotValid', error: 'Data must be a hex string' },
  ]
  for (const { value, length, error, expected } of cases) {
    if (error) {
      it(`throws for ${value}`, () => {
        expect(() => asData(value, length)).to.throw(TypeError, error)
      })
    } else if (expected) {
      const len = length !== undefined ? ` - length ${length}` : ''
      it(`reads ${value} as ${expected}${len}`, () => {
        const result = asData(value, length)
        expect(result).to.deep.equal(Bytes.fromByteArray(expected))
      })
    }
  }
})

describe('toData', () => {
  const cases = [
    { value: [0x41], expected: '0x41' },
    { value: [0x00, 0x42, 0x00], expected: '0x004200' },
    { value: [], expected: '0x' },
  ]
  for (const { value, expected } of cases) {
    it(`converts ${value} to ${expected}`, () => {
      const result = toData(Bytes.fromByteArray(value))
      expect(result).to.equal(expected)
    })
  }
})

describe('asQuantity', () => {
  const cases = [
    { value: '0x41', expected: 65n },
    { value: '0x400', expected: 1024n },
    { value: '0x0', expected: 0n },
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
        expect(result).to.equal(expected)
      })
    }
  }
})

describe('toQuantity', () => {
  const cases = [
    { value: 65n, expected: '0x41' },
    { value: 1024n, expected: '0x400' },
    { value: 0n, expected: '0x0' },
    { value: -1n, error: 'Quantity cannot be a negative integer' },
  ]
  for (const { value, error, expected } of cases) {
    if (error) {
      it(`throws for ${value}`, () => {
        expect(() => toQuantity(value)).to.throw(TypeError, error)
      })
    } else if (expected !== undefined) {
      it(`reads ${value} as ${expected}`, () => {
        const result = toQuantity(value)
        expect(result).to.equal(expected)
      })
    }
  }
})
