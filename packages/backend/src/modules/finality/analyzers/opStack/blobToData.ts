import { assert } from '@l2beat/backend-tools'

import { byteArrFromHexStr } from './utils'

const BlobSize = 4096 * 32
const MaxBlobDataSize = (4 * 31 + 3) * 1024 - 4
const Rounds = 1024 // number of encode/decode round

export function getRollupData(relevantBlobs: { blob: string }[]) {
  return relevantBlobs.map(({ blob }) => blobToData(byteArrFromHexStr(blob)))
}

/**
 * @notice This code was written by AI as a port from go code, that's why it looks so weird.
 * @notice The original code is located at https://github.com/ethereum-optimism/optimism/blob/abfc1e1f37a89405bacd08a3bb6363250d3f68f5/op-service/eth/blob.go#L199-L281
 */
export function blobToData(blob: Uint8Array): Uint8Array {
  assert(blob.length === BlobSize, 'Invalid blob size')

  // decode the 3-byte big-endian length value into a 4-byte integer
  const outputLen = (blob[2] << 16) | (blob[3] << 8) | blob[4]
  assert(
    outputLen <= MaxBlobDataSize,
    `Invalid output length: got ${outputLen}`,
  )

  // round 0 is special cased to copy only the remaining 27 bytes of the first field element into
  // the output due to version/length encoding already occupying its first 5 bytes.
  const output = new Uint8Array(MaxBlobDataSize)
  output.set(blob.subarray(5, 32), 0)

  // now process remaining 3 field elements to complete round 0
  let opos = 28 // current position into output buffer
  let ipos = 32 // current position into the input blob

  const encodedByte = new Uint8Array(4) // buffer for the 4 6-bit chunks
  encodedByte[0] = blob[0]
  for (let i = 1; i < 4; i++) {
    // eslint-disable-next-line no-extra-semi
    ;[encodedByte[i], opos, ipos] = decodeFieldElement(blob, opos, ipos, output)
  }
  opos = reassembleBytes(opos, encodedByte, output)

  // in each remaining round we decode 4 field elements (128 bytes) of the input into 127 bytes
  // of output
  for (let i = 1; i < Rounds && opos < outputLen; i++) {
    for (let j = 0; j < 4; j++) {
      // eslint-disable-next-line no-extra-semi
      ;[encodedByte[j], opos, ipos] = decodeFieldElement(
        blob,
        opos,
        ipos,
        output,
      )
    }
    opos = reassembleBytes(opos, encodedByte, output)
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
  opos: number,
  ipos: number,
  output: Uint8Array,
) {
  // two highest order bits of the first byte of each field element should always be 0
  assert(
    (blob[ipos] & 0b1100_0000) === 0,
    `Invalid field element: field element: ${ipos}`,
  )

  output.set(blob.subarray(ipos + 1, ipos + 32), opos)
  return [blob[ipos], opos + 32, ipos + 32]
}

/**
 * reassembleBytes takes the 4x6-bit chunks from encodedByte, reassembles them into 3 bytes of
 * output, and places them in their appropriate output positions.
 */
function reassembleBytes(
  opos: number,
  encodedByte: Uint8Array,
  output: Uint8Array,
) {
  opos--
  const x =
    (encodedByte[0] & 0b0011_1111) | ((encodedByte[1] & 0b0011_0000) << 2)
  const y =
    (encodedByte[1] & 0b0000_1111) | ((encodedByte[3] & 0b0000_1111) << 4)
  const z =
    (encodedByte[2] & 0b0011_1111) | ((encodedByte[3] & 0b0011_0000) << 2)

  output[opos - 32] = z
  output[opos - 32 * 2] = y
  output[opos - 32 * 3] = x
  return opos
}
