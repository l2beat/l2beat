import { assert, type UnixTime } from '@l2beat/shared-pure'
import { rlpDecode } from '../../utils/rlpDecode'

const BATCH_VERSION_0 = 0
const BATCH_VERSION_1 = 1

export interface SpanBatchDecoderOpts {
  l2BlockTimeSeconds: number
  genesisTimestamp: UnixTime
  blockOffset: number
}

export function decodeBatch(batch: Uint8Array, opts: SpanBatchDecoderOpts) {
  const version = batch[0]
  assert(
    version === BATCH_VERSION_0 || version === BATCH_VERSION_1,
    `Invalid batch version for span batch`,
  )

  switch (version) {
    case BATCH_VERSION_0:
      return decodeBatchVersion0(batch, opts)
    case BATCH_VERSION_1:
      return decodeSpanBatch(batch, opts)
  }
}

// https://specs.optimism.io/protocol/derivation.html#batch-format
function decodeBatchVersion0(batch: Uint8Array, opts: SpanBatchDecoderOpts) {
  // skip version byte
  const batchData = batch.slice(1)

  const data = rlpDecode(batchData) as Uint8Array[]

  const timestamp = data[3].reduce((acc, byte) => (acc << 8) | byte, 0)
  const txCount = data[4].length
  const blockNumber =
    (timestamp - opts.genesisTimestamp.toNumber()) / opts.l2BlockTimeSeconds

  const blockWithTimestamps = {
    timestamp,
    blockNumber,
    txCount,
  }

  return [blockWithTimestamps]
}

// https://specs.optimism.io/protocol/holocene/derivation.html#span-batches
function decodeSpanBatch(batch: Uint8Array, opts: SpanBatchDecoderOpts) {
  // skip version byte
  const batchData = batch.slice(1)
  const reader = new BufferReader(batchData)

  // prefix
  const relTimestamp = reader.uint32()
  const _l1OriginNum = reader.uint32()
  const _parentCheck = reader.readBytes(20)
  const _l1OriginCheck = reader.readBytes(20)

  // payload
  const blockCount = reader.uint32()
  const _originBits = reader.readBitList(blockCount)

  const tsxPerBlock = Array(blockCount)
    .fill(0)
    .map((_) => reader.uint32())

  const absTimestamp = relTimestamp + opts.genesisTimestamp.toNumber()
  const blocksWithTimestamps = tsxPerBlock.map((txCount, i) => ({
    timestamp: absTimestamp + i * opts.l2BlockTimeSeconds,
    blockNumber: relTimestamp / opts.l2BlockTimeSeconds + i + opts.blockOffset,
    txCount,
  }))

  return blocksWithTimestamps
}

export class BufferReader {
  public pos = 0

  constructor(private readonly buffer: Uint8Array) {}

  /**
   * Read a varint as an unsigned 32-bit integer.
   */
  public uint32() {
    let result = 0
    let shift = 0
    let byte
    do {
      byte = this.buffer[this.pos++]
      result |= (byte & 0x7f) << shift
      shift += 7
    } while (byte & 0x80)
    return result >>> 0
  }

  /**
   * Skip `n` bytes.
   */
  public skip(n: number) {
    this.pos += n
  }

  /**
   * Read next `n` bytes.
   */
  public readBytes(n: number) {
    const result = this.buffer.slice(this.pos, this.pos + n)
    this.pos += n
    return result
  }

  /**
   * Read a spanBatch bit list: encoded as big-endian integer,
   * left-padded with 0s to the next multiple of 8 bits.
   *
   * We use this only to skip over the proper amount of bytes.
   */
  public readBitList(bitCount: number) {
    const bytesInBitList = Math.ceil(bitCount / 8)
    const result = this.buffer.slice(this.pos, this.pos + bytesInBitList)
    this.pos += bytesInBitList
    return result
  }
}
