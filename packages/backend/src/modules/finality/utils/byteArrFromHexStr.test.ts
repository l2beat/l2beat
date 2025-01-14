import { expect } from 'earl'
import { byteArrFromHexStr, hexStrFromByteArr } from './byteArrFromHexStr'

describe(byteArrFromHexStr.name, () => {
  it('should convert a hex string to a byte array', () => {
    const hexString = '0x1234'
    const result = byteArrFromHexStr(hexString)
    expect(result).toEqual(new Uint8Array([0x12, 0x34]))
  })

  it('throws on invalid hex string length', () => {
    expect(() => byteArrFromHexStr('0x123')).toThrow(
      'Invalid hex string length',
    )
  })
})
describe(hexStrFromByteArr.name, () => {
  it('should convert a byte array to a hex string', () => {
    const byteArr = new Uint8Array([0x12, 0x34])
    const result = hexStrFromByteArr(byteArr)
    expect(result).toEqual('0x1234')
  })
})
