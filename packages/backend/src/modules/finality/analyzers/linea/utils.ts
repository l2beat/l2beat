const PACKING_SIZE_LAST_U64 = 56

function readBigUInt64BE(data: Uint8Array, offset: number): bigint {
  let result = 0n
  for (let i = 0; i < 8; i++) {
    result = (result << 8n) | BigInt(data[offset + i])
  }
  return result
}

class BitWriter {
  private bits: number[] = []
  private error: Error | null = null
  private currentByte = 0
  private usedBits = 0

  tryWriteBits(value: bigint, numBits: number): void {
    if (this.error) return
    try {
      let remainingBits = numBits
      while (remainingBits > 0) {
        const bitsToWrite = Math.min(8 - this.usedBits, remainingBits)
        const shift = remainingBits - bitsToWrite
        const mask = ((1n << BigInt(bitsToWrite)) - 1n) << BigInt(shift)
        const chunk = Number((value & mask) >> BigInt(shift))
        this.currentByte |= chunk << (8 - this.usedBits - bitsToWrite)
        this.usedBits += bitsToWrite
        remainingBits -= bitsToWrite

        if (this.usedBits === 8) {
          this.bits.push(this.currentByte)
          this.currentByte = 0
          this.usedBits = 0
        }
      }
    } catch (err) {
      this.error = err as Error
    }
  }

  close(): void {
    if (this.error) return
    if (this.usedBits > 0) {
      this.bits.push(this.currentByte)
      this.currentByte = 0
      this.usedBits = 0
    }
  }

  get tryError(): Error | null {
    return this.error
  }

  toUint8Array(): Uint8Array {
    return new Uint8Array(this.bits)
  }
}

export function unpack(r: Uint8Array): Uint8Array {
  if (r.length % 32 !== 0) {
    throw new Error('invalid data length; expected multiple of 32')
  }

  const n = r.length / 32
  const writer = new BitWriter()

  for (let i = 0; i < n; i++) {
    const offset = i * 32
    writer.tryWriteBits(readBigUInt64BE(r, offset), PACKING_SIZE_LAST_U64)
    writer.tryWriteBits(readBigUInt64BE(r, offset + 8), 64)
    writer.tryWriteBits(readBigUInt64BE(r, offset + 16), 64)
    writer.tryWriteBits(readBigUInt64BE(r, offset + 24), 64)
  }

  if (writer.tryError) {
    throw new Error(`when writing to BitWriter: ${writer.tryError.message}`)
  }
  writer.close()

  const out = writer.toUint8Array()
  if (!out.length) return out

  let cpt = 0
  while (out[out.length - 1 - cpt] === 0) {
    cpt++
    if (out.length - 1 - cpt < 0) break
  }

  const lastNonZeroPos = out.length - 1 - cpt
  if (lastNonZeroPos < 0) {
    throw new Error('invalid data (all zeros)')
  }

  const lastNonZero = out[lastNonZeroPos]
  if (cpt % 31 !== lastNonZero - 1) {
    throw new Error('invalid padding length')
  }

  return out.subarray(0, lastNonZeroPos)
}
