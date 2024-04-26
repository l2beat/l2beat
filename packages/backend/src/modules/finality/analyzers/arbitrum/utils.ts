import { assert } from '@l2beat/shared-pure'

export function numberToByteArr(num: number) {
  const arr = []
  while (num > 0) {
    arr.push(num & 0xff)
    num >>= 8
  }
  return new Uint8Array(arr.reverse())
}

export function byteArrToNumber(byteArr: Uint8Array): number {
  assert(byteArr.length <= 8, 'Number is too large to fit in 8 bytes')
  let num = 0
  for (const byte of byteArr) {
    num = (num << 8) | byte
  }
  return num
}
