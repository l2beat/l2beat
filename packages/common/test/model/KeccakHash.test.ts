import { expect } from 'earljs'

import { Bytes, KeccakHash } from '../../src/model'

describe(KeccakHash.name, () => {
  it('accepts lowercase hashes', () => {
    const hash = new KeccakHash(
      '0xabcdabcd12345678abcdabcd12345678abcdabcd12345678abcdabcd12345678'
    )
    expect(hash).toBeA(KeccakHash)
  })

  it('accepts mixed-case hashes', () => {
    const hash = new KeccakHash(
      '0xabcdabcd12345678abcdabcd12345678ABCDABCD12345678ABCDABCD12345678'
    )
    expect(hash).toBeA(KeccakHash)
  })

  it('accepts bytes', () => {
    const bytes = Bytes.fromHex(
      '0xabcdabcd12345678abcdabcd12345678ABCDABCD12345678ABCDABCD12345678'
    )
    const hash = new KeccakHash(bytes)
    expect(hash).toBeA(KeccakHash)
  })

  it('does not accept shorter strings', () => {
    expect(() => new KeccakHash('0x1234')).toThrow(
      TypeError,
      'KeccakHash must be exactly 32 bytes'
    )
  })

  it('does not accept invalid strings', () => {
    expect(() => new KeccakHash('foo')).toThrow(
      TypeError,
      'Hex string expected'
    )
  })

  it('toString returns a lowercase representation', () => {
    const address = new KeccakHash(
      '0xabcdabcd12345678abcdabcd12345678ABCDABCD12345678ABCDABCD12345678'
    )
    expect(address.toString()).toEqual(
      '0xabcdabcd12345678abcdabcd12345678abcdabcd12345678abcdabcd12345678'
    )
  })

  it('checks equality', () => {
    const a = new KeccakHash(
      '0xabcdabcd12345678abcdabcd12345678ABCDABCD12345678ABCDABCD12345678'
    )
    const b = new KeccakHash(
      '0xabcdabcd12345678abcdabcd12345678abcdabcd12345678abcdabcd12345678'
    )
    const c = new KeccakHash(
      '0x0000000000000000000000000000000000000000000000000000000000000000'
    )
    expect(a.equals(b)).toEqual(true)
    expect(b.equals(a)).toEqual(true)
    expect(a.equals(c)).toEqual(false)
  })
})
