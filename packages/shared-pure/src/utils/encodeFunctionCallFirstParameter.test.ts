import { expect } from 'earl'
import { Address32 } from '../types/Address32.js'
import { encodeFunctionCallFirstParameter } from './encodeFunctionCallFirstParameter.js'

describe(encodeFunctionCallFirstParameter.name, () => {
  it('encodes a number', () => {
    expect(encodeFunctionCallFirstParameter(2904)).toEqual(
      Address32(
        '0x0000000000000000000000000000000000000000000000000000000000000b58',
      ),
    )
  })

  it('encodes a hex value case-insensitively', () => {
    expect(encodeFunctionCallFirstParameter('0xAaBb')).toEqual(
      Address32(
        '0x000000000000000000000000000000000000000000000000000000000000aabb',
      ),
    )
  })

  it('rejects a non-hex value', () => {
    expect(() => encodeFunctionCallFirstParameter('not-hex')).toThrow()
  })
})
