export class BitConsumer {
  bytePos: number
  bitPos: number
  overflow: boolean
  data: Uint8Array

  constructor(data: Uint8Array) {
    this.data = data
    this.bytePos = 0
    this.bitPos = 0 // Counts from the left (MSB = bitPos=0, LSB = bitPos=7)
    this.overflow = false
  }

  initBackwards(): void {
    this.bytePos = this.data.length - 1
    this.bitPos = 7 // Start from left-most bit in the last byte
    this.overflow = false
  }

  private readFromByte(
    byte: number,
    bitCount: number,
    offsetFromLeft: number,
  ): number {
    // offsetFromLeft = how many bits have already been consumed from the left in this byte
    // shift = 8 - offsetFromLeft - bitCount
    const shift = 8 - offsetFromLeft - bitCount
    const mask = ((1 << bitCount) - 1) << shift
    return (byte & mask) >>> shift
  }

  peek(bitCount: number): number {
    let tempPos = this.bitPos
    let tempByte = this.bytePos
    let toRead = bitCount
    let result = 0

    while (toRead > 0) {
      if (tempByte < 0 || tempByte >= this.data.length) {
        // If we go out of range, no more bits to read
        break
      }

      const currentByte = this.data[tempByte]
      // How many bits remain in the current byte from the left?
      const bitsLeft = 8 - tempPos
      const readNow = Math.min(bitsLeft, toRead)
      const extracted = this.readFromByte(currentByte, readNow, tempPos)

      // Shift result left and merge
      result = (result << readNow) | extracted

      toRead -= readNow
      tempPos += readNow

      // Move to next byte if we exhaust current
      if (tempPos === 8) {
        tempPos = 0
        tempByte++
      }
    }

    return result
  }

  moveCursor(bitCount: number): void {
    this.bitPos += bitCount
    while (this.bitPos >= 8) {
      this.bitPos -= 8
      this.bytePos++
      if (this.bytePos >= this.data.length) {
        // Past the end
        this.bytePos = this.data.length
        this.bitPos = 0
        this.overflow = true
        break
      }
    }
  }

  consume(bitCount: number): number {
    const val = this.peek(bitCount)
    this.moveCursor(bitCount)
    return val
  }
}
