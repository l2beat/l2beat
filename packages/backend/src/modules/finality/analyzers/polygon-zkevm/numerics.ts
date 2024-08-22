import { assert } from '@l2beat/shared-pure'

const sizeUInt32 = 4 // Size of a uint32 in bytes

export { decodeUint32 }

function decodeUint32(txsData: Uint8Array, pos: number): [number, number] {
  assert(
    txsData.length >= pos + sizeUInt32,
    "can't get u32 because not enough data: ErrInvalidBatchV2",
  )

  const buffer = txsData.buffer.slice(pos, pos + sizeUInt32)
  const view = new DataView(buffer)
  const value = view.getUint32(0)

  return [pos + sizeUInt32, value]
}
