import { expect } from 'earl'

import { Hash160 } from './Hash160.js'

describe(Hash160.name, () => {
  it('accepts lowercase hashes', () => {
    const hash = Hash160('0xabcdabcd12345678abcdabcd12345678abcdabcd')
    expect(hash).toBeA(String)
  })

  it('does not accept mixed case hashes', () => {
    expect(() => Hash160('0xabcdabcd12345678ABCDABCD12345678ABCDABCD')).toThrow(
      TypeError,
      'Invalid Hash160',
    )
  })

  it('does not accept invalid strings', () => {
    expect(() => Hash160('foo')).toThrow(TypeError, 'Invalid Hash160')
  })
})
