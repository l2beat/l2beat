import { assert } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'

const SPAN_BATCH_VERSION = 1

export interface SpanBatchDecoderOpts {
  l2BlockTimeSeconds: number
  genesisTimestamp: UnixTime
}

// https://specs.optimism.io/protocol/span-batches.html#span-batch-format
export function decodeSpanBatch(batch: Uint8Array, opts: SpanBatchDecoderOpts) {
  assert(
    batch[0] === SPAN_BATCH_VERSION,
    `Invalid batch version for span batch`,
  )

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
   */
  public readBitList(bitCount: number) {
    const bytesInBitList = Math.ceil(bitCount / 8)
    const result = this.buffer.slice(this.pos, this.pos + bytesInBitList)
    this.pos += bytesInBitList
    return result
  }
}
