import { describe, expect, it } from 'vitest'

describe('toThrowWithMessage', () => {
  it('requires both the class and the message', () => {
    const throwTypeError = () => {
      throw new TypeError('Invalid address: 0x1234')
    }

    expect(throwTypeError).toThrowWithMessage(TypeError, 'Invalid address')
    expect(throwTypeError).toThrowWithMessage(TypeError, /0x\d+/)
    expect(throwTypeError).not.toThrowWithMessage(RangeError, 'Invalid address')
    expect(throwTypeError).not.toThrowWithMessage(TypeError, 'Invalid chain')
  })

  it('fails when nothing is thrown', () => {
    expect(() => 1).not.toThrowWithMessage(TypeError, 'anything')
  })

  it('works behind the rejects modifier', async () => {
    const rejected = Promise.reject(new RangeError('out of range'))

    await expect(rejected).rejects.toThrowWithMessage(RangeError, 'out of')
  })
})

describe('toEqualUnsorted', () => {
  it('ignores order but not multiplicity', () => {
    expect([1, 2, 2]).toEqualUnsorted([2, 1, 2])
    expect([1, 2, 2]).not.toEqualUnsorted([1, 2])
    expect([1, 2]).not.toEqualUnsorted([1, 2, 2])
  })

  it('compares items deeply and strictly', () => {
    expect([{ a: 1 }, { a: 2 }]).toEqualUnsorted([{ a: 2 }, { a: 1 }])

    const withUndefinedKey: { a: number; b?: number }[] = [
      { a: 1, b: undefined },
    ]
    expect(withUndefinedKey).not.toEqualUnsorted([{ a: 1 }])
  })

  it('supports asymmetric matchers', () => {
    expect([{ a: 1 }, 'x']).toEqualUnsorted(['x', expect.any(Object)])
  })
})
