import { expect } from 'earljs'

import { Bytes, EthereumAddress, KeccakHash } from '../../../src/model'
import {
  asBigIntFromQuantity,
  asBytesFromData,
  asEthereumAddressFromData,
  asKeccakHashFromData,
  bigIntToQuantity,
  blockTagToString,
} from '../../../src/peripherals/ethereum/primitives'

describe(asBytesFromData.name, () => {
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
        expect(() => asBytesFromData(value, length)).toThrow(TypeError, error)
      })
    } else if (expected) {
      const len = length !== undefined ? ` - length ${length}` : ''
      it(`reads ${value} as ${expected}${len}`, () => {
        const result = asBytesFromData(value, length)
        expect(result).toEqual(Bytes.fromByteArray(expected))
      })
    }
  }
})

describe(asEthereumAddressFromData.name, () => {
  const address = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'

  it('correctly reads a 20 byte address', () => {
    expect(asEthereumAddressFromData(address)).toEqual(EthereumAddress(address))
  })

  it('throws for shorter bytes', () => {
    expect(() => asEthereumAddressFromData('0x1234')).toThrow(
      TypeError,
      'Invalid EthereumAddress'
    )
  })
})

describe(asKeccakHashFromData.name, () => {
  const hash =
    '0xabcdabcd12345678abcdabcd12345678ABCDABCD12345678ABCDABCD12345678'

  it('correctly reads a 32 byte hash', () => {
    expect(asKeccakHashFromData(hash)).toEqual(new KeccakHash(hash))
  })

  it('throws for shorter bytes', () => {
    expect(() => asKeccakHashFromData('0x1234')).toThrow(
      TypeError,
      'KeccakHash must be exactly 32 bytes'
    )
  })
})

describe(asBigIntFromQuantity.name, () => {
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
        expect(() => asBigIntFromQuantity(value)).toThrow(TypeError, error)
      })
    } else if (expected !== undefined) {
      it(`reads ${value} as ${expected}`, () => {
        const result = asBigIntFromQuantity(value)
        expect(result).toEqual(expected)
      })
    }
  }
})

describe(bigIntToQuantity.name, () => {
  const cases = [
    { value: 65n, expected: '0x41' },
    { value: 1024n, expected: '0x400' },
    { value: 0n, expected: '0x0' },
    { value: -1n, error: 'Quantity cannot be a negative integer' },
  ]
  for (const { value, error, expected } of cases) {
    if (error) {
      it(`throws for ${value}`, () => {
        expect(() => bigIntToQuantity(value)).toThrow(TypeError, error)
      })
    } else if (expected !== undefined) {
      it(`reads ${value} as ${expected}`, () => {
        const result = bigIntToQuantity(value)
        expect(result).toEqual(expected)
      })
    }
  }
})

describe(blockTagToString.name, () => {
  it('converts numbers to quantities', () => {
    expect(blockTagToString(2n)).toEqual('0x2')
  })

  it('leaves strings untouched', () => {
    expect(blockTagToString('latest')).toEqual('latest')
  })
})
