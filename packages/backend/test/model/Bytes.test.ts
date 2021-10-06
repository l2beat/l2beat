import { expect } from 'chai'

import { Bytes } from '../../src/model'

describe('Bytes', () => {
  describe('fromHex', () => {
    it('checks constructor arguments', () => {
      expect(() => Bytes.fromHex('foo')).to.throw(TypeError)
      expect(() => Bytes.fromHex('0x123G')).to.throw(TypeError)
    })

    it('normalizes the input', () => {
      const bytes = Bytes.fromHex('0x123')
      expect(bytes.toString()).to.equal('0x0123')
    })
  })

  describe('fromByte', () => {
    it('checks constructor arguments', () => {
      expect(() => Bytes.fromByte(1.5)).to.throw(TypeError)
      expect(() => Bytes.fromByte(-2)).to.throw(TypeError)
      expect(() => Bytes.fromByte(256)).to.throw(TypeError)
    })

    it('encodes 0 as 00', () => {
      const bytes = Bytes.fromByte(0)
      expect(bytes.toString()).to.equal('0x00')
    })

    it('encodes the byte', () => {
      const bytes = Bytes.fromByte(0xfa)
      expect(bytes.toString()).to.equal('0xfa')
    })
  })

  describe('fromNumber', () => {
    it('checks constructor arguments', () => {
      expect(() => Bytes.fromNumber(1.5)).to.throw(TypeError)
      expect(() => Bytes.fromNumber(-2)).to.throw(TypeError)
    })

    it('encodes 0 as a empty', () => {
      const bytes = Bytes.fromNumber(0)
      expect(bytes.toString()).to.equal('0x')
    })

    it('encodes a number', () => {
      const bytes = Bytes.fromNumber(123456)
      expect(bytes.toString()).to.equal('0x01e240')
    })
  })

  describe('fromByteArray', () => {
    it('checks constructor arguments', () => {
      expect(() => Bytes.fromByteArray([1.5])).to.throw(TypeError)
      expect(() => Bytes.fromByteArray([-2])).to.throw(TypeError)
      expect(() => Bytes.fromByteArray([256])).to.throw(TypeError)
    })

    it('concatenates encoded bytes', () => {
      const bytes = Bytes.fromByteArray([0, 1, 2, 3])
      expect(bytes.toString()).to.equal('0x00010203')
    })
  })

  describe('equals', () => {
    const first = Bytes.fromHex('56ab')
    const second = Bytes.fromHex('56AB')
    const third = Bytes.fromHex('1234')

    it('first == second', () => {
      expect(first.equals(second)).to.equal(true)
    })

    it('second == first', () => {
      expect(second.equals(first)).to.equal(true)
    })

    it('first != third', () => {
      expect(first.equals(third)).to.equal(false)
    })

    it('third != first', () => {
      expect(third.equals(first)).to.equal(false)
    })

    it('second != third', () => {
      expect(second.equals(third)).to.equal(false)
    })

    it('third != second', () => {
      expect(third.equals(second)).to.equal(false)
    })
  })

  describe('toByteArray', () => {
    it('encodes empty as []', () => {
      expect(Bytes.EMPTY.toByteArray()).to.deep.equal([])
    })

    it('encodes bytes', () => {
      const bytes = Bytes.fromHex('abcd1234')
      expect(bytes.toByteArray()).to.deep.equal([0xab, 0xcd, 0x12, 0x34])
    })
  })

  describe('toString', () => {
    it('encodes empty as "0x"', () => {
      expect(Bytes.EMPTY.toString()).to.equal('0x')
    })

    it('encodes bytes as normalized hex string', () => {
      const bytes = Bytes.fromHex('aBcD123')
      expect(bytes.toString()).to.equal('0x0abcd123')
    })
  })

  describe('toNumber', () => {
    it('treats empty as zero', () => {
      expect(Bytes.EMPTY.toNumber()).to.equal(0)
    })

    it('returns a number', () => {
      const bytes = Bytes.fromHex('00000123')
      expect(bytes.toNumber()).to.equal(291)
    })
  })

  describe('get', () => {
    it('throws when index is out of bounds', () => {
      const bytes = Bytes.fromHex('112233')
      expect(() => bytes.get(-1)).to.throw()
      expect(() => bytes.get(1.5)).to.throw()
      expect(() => bytes.get(3)).to.throw()
    })

    it('returns a specific byte', () => {
      const bytes = Bytes.fromHex('112233')
      expect(bytes.get(1)).to.equal(0x22)
    })
  })

  describe('length', () => {
    it('returns 0 for empty', () => {
      expect(Bytes.EMPTY.length).to.equal(0)
    })

    it('returns the number of bytes', () => {
      const bytes = Bytes.fromHex('112233')
      expect(bytes.length).to.equal(3)
    })
  })

  describe('slice', () => {
    it('returns a slice', () => {
      const bytes = Bytes.fromHex('123456abcd')
      expect(bytes.slice(1, 3)).to.deep.equal(Bytes.fromHex('3456'))
    })
  })

  describe('concat', () => {
    it('concatenates bytes', () => {
      const first = Bytes.fromHex('1234')
      const second = Bytes.fromHex('5678')
      expect(first.concat(second)).to.deep.equal(Bytes.fromHex('12345678'))
    })
  })
})
