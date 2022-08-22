import { expect } from 'earljs'

import { Hash256 } from '../src'

describe(Hash256.name, () => {
  it('accepts lowercase hashes', () => {
    const hash = Hash256(
      '0xabcdabcd12345678abcdabcd12345678abcdabcd12345678abcdabcd12345678',
    )
    expect(hash).toBeA(String)
  })

  it('does not accept mixed case hashes', () => {
    expect(() =>
      Hash256(
        '0xabcdabcd12345678ABCDABCD12345678ABCDABCD12345678abcdabcd12345678',
      ),
    ).toThrow(TypeError, 'Invalid Hash256')
  })

  it('does not accept invalid strings', () => {
    expect(() => Hash256('foo')).toThrow(TypeError, 'Invalid Hash256')
  })
})
