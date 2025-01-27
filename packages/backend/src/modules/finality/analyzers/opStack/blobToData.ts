import type { Blob } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { byteArrFromHexStr } from '../../utils/byteArrFromHexStr'

const BLOB_SIZE = 4096 * 32
const MAX_BLOB_DATA_SIZE = (4 * 31 + 3) * 1024 - 4
const ROUNDS = 1024 // number of encode/decode round

export function getRollupData(relevantBlobs: Blob[]) {
  return relevantBlobs.map(({ data }) => blobToData(byteArrFromHexStr(data)))
}

/**
 * @notice This code was written by AI as a port from go code, that's why it looks so weird.
 * @notice The original code is located at https://github.com/ethereum-optimism/optimism/blob/abfc1e1f37a89405bacd08a3bb6363250d3f68f5/op-service/eth/blob.go#L199-L281
 *
 *
 * blobToData decodes the blob into raw byte data. See the details below on the encoding
 * format.
 *
 * The encoding scheme is as follows:
 * In each round we perform 7 reads of input of lengths (31,1,31,1,31,1,31) bytes respectively for
 * a total of 127 bytes. This data is encoded into the next 4 field elements of the output by
 * placing each of the 4x31 byte chunks into bytes [1:32] of its respective field element. The
 * three single byte chunks (24 bits) are split into 4x6-bit chunks, each of which is written into
 * the top most byte of its respective field element, leaving the top 2 bits of each field element
 * empty to avoid modulus overflow.  This process is repeated for up to 1024 rounds until all data
 * is encoded.
 *
 * For only the very first output field, bytes [1:5] are used to encode the version and the length
 * of the data.
 */
export function blobToData(blob: Uint8Array): Uint8Array {
  assert(blob.length === BLOB_SIZE, 'Invalid blob size')

  // decode the 3-byte big-endian length value into a 4-byte integer
  const outputLen = (blob[2] << 16) | (blob[3] << 8) | blob[4]
  assert(
    outputLen <= MAX_BLOB_DATA_SIZE,
    `Invalid output length: got ${outputLen}`,
  )

  // round 0 is special cased to copy only the remaining 27 bytes of the first field element into
  // the output due to version/length encoding already occupying its first 5 bytes.
  const output = new Uint8Array(MAX_BLOB_DATA_SIZE)
  output.set(blob.subarray(5, 32), 0)

  // now process remaining 3 field elements to complete round 0
  let outputPosition = 28 // current position into output buffer
  let inputPosition = 32 // current position into the input blob

  const encodedByte = new Uint8Array(4) // buffer for the 4 6-bit chunks
  encodedByte[0] = blob[0]
  for (let i = 1; i < 4; i++) {
    ;[encodedByte[i], outputPosition, inputPosition] = decodeFieldElement(
      blob,
      outputPosition,
      inputPosition,
      output,
    )
  }
  outputPosition = reassembleBytes(outputPosition, encodedByte, output)

  // in each remaining round we decode 4 field elements (128 bytes) of the input into 127 bytes
  // of output
  for (let i = 1; i < ROUNDS && outputPosition < outputLen; i++) {
    for (let j = 0; j < 4; j++) {
      ;[encodedByte[j], outputPosition, inputPosition] = decodeFieldElement(
        blob,
        outputPosition,
        inputPosition,
        output,
      )
    }
    outputPosition = reassembleBytes(outputPosition, encodedByte, output)
  }
  return output.slice(0, outputLen)
}

/**
 * decodeFieldElement decodes the next input field element by writing its lower 31 bytes into its
 * appropriate place in the output and checking the high order byte is valid. Returns an
 * InvalidFieldElementError if a field element is seen with either of its two high order bits set.
 */
function decodeFieldElement(
  blob: Uint8Array,
  outputPosition: number,
  inputPosition: number,
  output: Uint8Array,
) {
  // two highest order bits of the first byte of each field element should always be 0
  assert(
    (blob[inputPosition] & 0b1100_0000) === 0,
    `Invalid field element: field element: ${inputPosition}`,
  )

  output.set(
    blob.subarray(inputPosition + 1, inputPosition + 32),
    outputPosition,
  )
  return [blob[inputPosition], outputPosition + 32, inputPosition + 32]
}

/**
 * reassembleBytes takes the 4x6-bit chunks from encodedByte, reassembles them into 3 bytes of
 * output, and places them in their appropriate output positions.
 */
function reassembleBytes(
  outputPosition: number,
  encodedByte: Uint8Array,
  output: Uint8Array,
) {
  outputPosition--
  const x =
    (encodedByte[0] & 0b0011_1111) | ((encodedByte[1] & 0b0011_0000) << 2)
  const y =
    (encodedByte[1] & 0b0000_1111) | ((encodedByte[3] & 0b0000_1111) << 4)
  const z =
    (encodedByte[2] & 0b0011_1111) | ((encodedByte[3] & 0b0011_0000) << 2)

  output[outputPosition - 32] = z
  output[outputPosition - 32 * 2] = y
  output[outputPosition - 32 * 3] = x
  return outputPosition
}
