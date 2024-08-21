import { assert } from '@l2beat/shared-pure'
import { rlpDecodePartial } from '../../utils/rlpDecode'

const BlobTxFieldElementsPerBlob = 4096

// The number of bits in a BLS scalar that aren't part of a whole byte.
const spareBlobBits = 6 // = Math.floor(Math.log2(BLS_MODULUS)) % 8

// Based on https://github.com/OffchainLabs/nitro/blob/e7cdfcd57559f098b470ba2c2d958d91b66961f0/util/blobs/blobs.go#L79

// blobsToData decodes blobs into the batch data encoded in them.
export function blobsToData(blobs: Uint8Array[]): Uint8Array {
  const data: Uint8Array[] = []
  for (const blob of blobs) {
    for (
      let fieldIndex = 0;
      fieldIndex < BlobTxFieldElementsPerBlob;
      fieldIndex++
    ) {
      const start = fieldIndex * 32 + 1
      const end = (fieldIndex + 1) * 32
      data.push(blob.slice(start, end))
    }
    let acc: number = 0
    let accBits: number = 0
    for (
      let fieldIndex = 0;
      fieldIndex < BlobTxFieldElementsPerBlob;
      fieldIndex++
    ) {
      acc |= blob[fieldIndex * 32] << accBits
      accBits += spareBlobBits
      if (accBits >= 8) {
        data.push(new Uint8Array([acc & 0xff]))
        acc >>= 8
        accBits -= 8
      }
    }
    if (accBits !== 0) {
      throw new Error(`Somehow ended up with ${accBits} spare accBits`)
    }
  }

  const rlpData = new Uint8Array(data.reduce((acc, val) => acc + val.length, 0))
  let offset = 0
  for (const val of data) {
    rlpData.set(val, offset)
    offset += val.length
  }

  // We use rlpDecodePartial here because theres trailing zeros in the data that we want to ignore.
  const [decoded, rest] = rlpDecodePartial(rlpData)
  assert(decoded instanceof Uint8Array, 'Invalid decoded type')
  assert(
    rest.every((byte) => byte === 0),
    'Expected rest to be all zeros',
  )

  return decoded
}
