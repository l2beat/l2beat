import { describe, expect, it } from 'vitest'

import { Hash256 } from './Hash256.js'

describe(Hash256.name, () => {
  it('accepts lowercase hashes', () => {
    const hash = Hash256(
      '0xabcdabcd12345678abcdabcd12345678abcdabcd12345678abcdabcd12345678',
    )
    expect(hash).toBeTypeOf('string')
  })

  it('does not accept mixed case hashes', () => {
    expect(() =>
      Hash256(
        '0xabcdabcd12345678ABCDABCD12345678ABCDABCD12345678abcdabcd12345678',
      ),
    ).toThrow(TypeError)
    expect(() =>
      Hash256(
        '0xabcdabcd12345678ABCDABCD12345678ABCDABCD12345678abcdabcd12345678',
      ),
    ).toThrow('Invalid Hash256')
  })

  it('does not accept invalid strings', () => {
    expect(() => Hash256('foo')).toThrow(TypeError)
    expect(() => Hash256('foo')).toThrow('Invalid Hash256')
  })
})
