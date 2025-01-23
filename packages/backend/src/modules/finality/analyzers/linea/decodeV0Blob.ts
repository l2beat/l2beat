import { readFileSync } from 'fs'
import path from 'path'
import { assert } from '@l2beat/shared-pure'
import { hexStrFromByteArr } from '../../utils/byteArrFromHexStr'
import type { L2Block } from '../types/BaseAnalyzer'
import { decompress } from './lzss'
import { unpack } from './utils'

// NOTE(radomski): This is a checksum of a dictionary (found here
// https://github.com/Consensys/linea-monorepo/blob/main/prover/lib/compressor/compressor_dict.bin)
// committed in a001342.  It's computed for V0 of blob decoding, we assume it's
// not going to change for simplification, because otherwise we would have to
// implement BLS12-377 hashing algorithms.
const ASSUMED_DICT_CHECKSUM =
  '0x06eac4e2fac2ca844810be0dc9e398fa4961656c022b65e4af13728152980aed'

export function decodeV0Blob(blob: Uint8Array): L2Block[] {
  const unpacked = unpack(blob)

  const { header, bytesRead } = readHeader(unpacked)

  assert(header.dictionaryChecksum === ASSUMED_DICT_CHECKSUM)
  const compressed = unpacked.slice(bytesRead)
  const dictionaryBuffer = readFileSync(
    path.join(__dirname, '../../../../static/a001342_dict.bin'),
  )
  const dictionary = new Uint8Array(dictionaryBuffer)

  const uncompressed = decompress(compressed, dictionary)

  const blockTimestamps: number[] = []

  let pos: number = 0
  for (const batch of header.batchMetadata) {
    for (const blockLength of batch.blockByteLength) {
      const blockData = uncompressed.slice(pos, pos + blockLength)
      const blockView = new DataView(blockData.buffer)
      blockTimestamps.push(Number(blockView.getBigUint64(0, true)))
      pos += blockLength
    }
  }

  const sortedBlockTimestamps = blockTimestamps.sort((a, b) => a - b)

  return sortedBlockTimestamps.map((timestamp, i) => ({
    // Getting actual number based on given data is hard so we just use the index as we don't need it for anything
    blockNumber: i + 1,
    timestamp,
  }))
}

interface BatchMetadata {
  blockByteLength: number[]
}

interface Header {
  dictionaryChecksum: string
  batchCount: number
  batchMetadata: BatchMetadata[]
}

function readHeader(blob: Uint8Array): { header: Header; bytesRead: number } {
  const header: Header = {
    dictionaryChecksum: '',
    batchCount: 0,
    batchMetadata: [],
  }
  let bytesRead = 0
  const view = new DataView(blob.buffer)

  header.dictionaryChecksum = hexStrFromByteArr(blob.slice(0, 32))
  bytesRead += 32
  header.batchCount = view.getUint16(bytesRead, true)
  bytesRead += 2

  for (let i = 0; i < header.batchCount; i++) {
    // How many blocks in this batch
    const blockCount = view.getUint16(bytesRead, true)
    bytesRead += 2

    const batchMetadata: BatchMetadata = {
      blockByteLength: [],
    }
    for (let i = 0; i < blockCount; i++) {
      const b01 = view.getUint16(bytesRead, true)
      bytesRead += 2
      const b2 = view.getUint8(bytesRead)
      bytesRead += 1
      batchMetadata.blockByteLength.push((b01 << 0) | (b2 << 16))
    }

    header.batchMetadata.push(batchMetadata)
  }

  return {
    header,
    bytesRead,
  }
}
