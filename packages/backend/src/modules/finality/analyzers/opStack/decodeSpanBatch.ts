import { assert } from '@l2beat/backend-tools'
import { UnixTime } from '@l2beat/shared-pure'
import proto from 'protobufjs'

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

  const batchData = batch.slice(1)
  const reader = new proto.BufferReader(batchData)

  // prefix
  const relTimestamp = reader.uint32()
  const _l1OriginNum = reader.uint32()
  const _parentCheck = batchData.slice(reader.pos, reader.pos + 20)
  reader.skip(20)
  const _l1OriginCheck = batchData.slice(reader.pos, reader.pos + 20)
  reader.skip(20)

  // payload
  const blockCount = reader.uint32()
  const _originBits = readNextNBits(blockCount, batchData, reader)

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

function readNextNBits(
  bitCount: number,
  batchData: Uint8Array,
  reader: proto.BufferReader,
) {
  const bytesInBitList = Math.ceil(bitCount / 8)
  const leftPad = bytesInBitList * 8 - bitCount
  const bits = batchData.slice(reader.pos, reader.pos + bytesInBitList)
  reader.skip(bytesInBitList)
  return { leftPad, bits }
}
