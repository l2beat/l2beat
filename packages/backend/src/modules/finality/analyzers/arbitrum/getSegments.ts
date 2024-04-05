import { assert } from '@l2beat/shared-pure'
import zlib from 'zlib'

import { rlpDecode, RlpSerializable } from '../../utils/rlpDecode'
import { byteArrFromHexStr } from '../opStack/utils'
import { blobsToData } from './blobsToData'
import { numberToByteArr } from './utils'

export function getSegments(
  relevantBlobs: { blob: string }[],
): RlpSerializable[] {
  const blobs = relevantBlobs.map(({ blob }) => byteArrFromHexStr(blob))
  const payload = blobsToData(blobs)
  const decompressed = decompressPayload(payload)
  // I do not understand why this is necessary, but it is
  // My guess is that the shape of the data is always the same,
  // so it's an optimization technique to save couple of bytes
  const rlpEncoded = concatWithLengthForRlp(decompressed)
  const segments = rlpDecode(rlpEncoded)
  assert(Array.isArray(segments), 'Expected segments to be an array')

  return segments
}

const BROTLI_COMPRESSION_TYPE = 0x00
export function decompressPayload(payload: Uint8Array): Uint8Array {
  const compressionType = payload[0]
  assert(
    compressionType === BROTLI_COMPRESSION_TYPE,
    `Expected compression type to be ${BROTLI_COMPRESSION_TYPE}, got ${compressionType}`,
  )
  const data = payload.slice(1)
  const decompressedData = zlib.brotliDecompressSync(data)
  return Uint8Array.from(decompressedData)
}

export function concatWithLengthForRlp(decompressedBytes: Uint8Array) {
  const totalLength = decompressedBytes.length
  const lengthBytes = numberToByteArr(totalLength)
  const lengthBytesLength = lengthBytes.length
  const lengthByte = 0xf7 + lengthBytesLength
  const lengthByteBytes = numberToByteArr(lengthByte)
  const concatenatedWithLength = new Uint8Array([
    ...lengthByteBytes,
    ...lengthBytes,
    ...decompressedBytes,
  ])
  return concatenatedWithLength
}
