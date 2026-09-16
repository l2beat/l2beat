import { describe, expect, it } from 'vitest'

import { Hash160 } from './Hash160.js'

describe(Hash160.name, () => {
  it('accepts lowercase hashes', () => {
    const hash = Hash160('0xabcdabcd12345678abcdabcd12345678abcdabcd')
    expect(hash).toBeTypeOf('string')
  })

  it('does not accept mixed case hashes', () => {
    expect(() => Hash160('0xabcdabcd12345678ABCDABCD12345678ABCDABCD')).toThrow(
      TypeError,
    )
    expect(() => Hash160('0xabcdabcd12345678ABCDABCD12345678ABCDABCD')).toThrow(
      'Invalid Hash160',
    )
  })

  it('does not accept invalid strings', () => {
    expect(() => Hash160('foo')).toThrow(TypeError)
    expect(() => Hash160('foo')).toThrow('Invalid Hash160')
  })
})
