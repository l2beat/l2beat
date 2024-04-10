const sizeUInt32 = 4 // Size of a uint32 in bytes

export { decodeUint32, encodeUint32 }

function encodeUint32(value: number): Uint8Array {
  const buffer = new ArrayBuffer(sizeUInt32)
  const view = new DataView(buffer)
  // Assuming big-endian byte order
  view.setUint32(0, value, false) // false for big-endian
  return new Uint8Array(buffer)
}

function decodeUint32(txsData: Uint8Array, pos: number): [number, number] {
  if (txsData.length - pos < sizeUInt32) {
    throw new Error("can't get u32 because not enough data: ErrInvalidBatchV2")
  }
  const buffer = txsData.buffer.slice(pos, pos + sizeUInt32)
  const view = new DataView(buffer)
  // Assuming big-endian byte order
  const value = view.getUint32(0, false) // false for big-endian

  return [pos + sizeUInt32, value]
}
