import { assert } from '@l2beat/shared-pure'

type Bytes = Uint8Array
export type RlpSerializable = RlpSerializable[] | Uint8Array

// based on https://github.com/dethcrypto/deth/blob/f2bf2cebb0e1723cb0fcdd2b44b9eb1bae61eea3/packages/evm/src/rlp/rlpDecode.ts
// with some type tweaks. Thanks to @dethcrypto for the implementation!
// If you need to encode, port also rlpEncode.ts
export function rlpDecode(value: Bytes): RlpSerializable {
  const [result, rest] = rlpDecodePartial(value)
  assertEncoding(rest.length === 0)
  return result
}

/**
 * Decodes a partial RLP-encoded value, returning the decoded value and the remaining bytes.
 *
 * @param value The RLP-encoded value to decode.
 * @returns [result, rest] A tuple  containing the decoded value and the remaining bytes.
 */
export function rlpDecodePartial(value: Bytes): [RlpSerializable, Bytes] {
  assertEncoding(value.length !== 0)
  const firstByte = value[0]

  if (firstByte < 128) {
    assertEncoding(value.length >= 1)
    return split(value, 0, 1)
  }

  if (firstByte < 128 + 56) {
    const length = firstByte - 128
    assertEncoding(value.length >= 1 + length)
    assertEncoding(length !== 1 || value[1] >= 128)
    return split(value, 1, 1 + length)
  }

  if (firstByte < 192) {
    return decodeLonger(value, firstByte - 183)
  }

  if (firstByte < 248) {
    const length = firstByte - 192
    assertEncoding(value.length >= 1 + length)
    const [toDecode, rest] = split(value, 1, 1 + length)
    return [decodeItems(toDecode), rest]
  }

  const [toDecode, rest] = decodeLonger(value, firstByte - 247)
  return [decodeItems(toDecode), rest]
}

function split(value: Bytes, start: number, middle: number): [Bytes, Bytes] {
  return [value.slice(start, middle), value.slice(middle, value.length)]
}

function decodeNumber(value: Bytes): number {
  if (value.length === 0) {
    return 0
  }
  assertEncoding(value[0] !== 0)
  return value.reduce((acc, byte) => acc * 256 + byte, 0)
}

function decodeLonger(value: Bytes, lengthOfLength: number) {
  assertEncoding(value.length >= 1 + lengthOfLength)
  const length = decodeNumber(value.slice(1, 1 + lengthOfLength))
  const end = 1 + lengthOfLength + length
  assertEncoding(length >= 56 && value.length >= end)
  return split(value, 1 + lengthOfLength, end)
}

function decodeItems(value: Bytes) {
  let rest = value
  const result: RlpSerializable[] = []
  while (rest.length > 0) {
    const partial = rlpDecodePartial(rest)
    result.push(partial[0])
    rest = partial[1]
  }
  return result
}

function assertEncoding(condition: boolean) {
  assert(condition, 'Invalid RLP encoding')
}
