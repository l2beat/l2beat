import { expect } from 'chai'

import { KeccakHash } from '../../../src/services/ethereum'
import { Bytes } from '../../../src/services/model'

describe('KeccakHash', () => {
  it('accepts lowercase hashes', () => {
    const hash = new KeccakHash(
      '0xabcdabcd12345678abcdabcd12345678abcdabcd12345678abcdabcd12345678'
    )
    expect(hash).to.be.instanceOf(KeccakHash)
  })

  it('accepts mixed-case hashes', () => {
    const hash = new KeccakHash(
      '0xabcdabcd12345678abcdabcd12345678ABCDABCD12345678ABCDABCD12345678'
    )
    expect(hash).to.be.instanceOf(KeccakHash)
  })

  it('accepts bytes', () => {
    const bytes = Bytes.fromHex(
      '0xabcdabcd12345678abcdabcd12345678ABCDABCD12345678ABCDABCD12345678'
    )
    const hash = new KeccakHash(bytes)
    expect(hash).to.be.instanceOf(KeccakHash)
  })

  it('does not accept shorter strings', () => {
    expect(() => new KeccakHash('0x1234')).to.throw(
      TypeError,
      'KeccakHash must be exactly 32 bytes'
    )
  })

  it('does not accept invalid strings', () => {
    expect(() => new KeccakHash('foo')).to.throw(
      TypeError,
      'Hex string expected'
    )
  })

  it('toString returns a lowercase representation', () => {
    const address = new KeccakHash(
      '0xabcdabcd12345678abcdabcd12345678ABCDABCD12345678ABCDABCD12345678'
    )
    expect(address.toString()).to.equal(
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
    expect(a.equals(b)).to.equal(true)
    expect(b.equals(a)).to.equal(true)
    expect(a.equals(c)).to.equal(false)
  })
})
