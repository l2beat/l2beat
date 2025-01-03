import { assert } from '@l2beat/shared-pure'

export function byteArrFromHexStr(hexString: string) {
  const str = hexString.startsWith('0x') ? hexString.slice(2) : hexString
  assert(str.length % 2 === 0, 'Invalid hex string length')
  const arr = []
  for (let i = 0; i < str.length; i += 2) {
    arr.push(parseInt(str.substring(i, i + 2), 16))
  }
  return new Uint8Array(arr)
}

export function hexStrFromByteArr(byteArr: Uint8Array) {
  return (
    '0x' +
    Array.from(byteArr)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('')
  )
}
