export class BinaryReader {
  private data: string
  private offset = 0

  constructor(hexData: string) {
    if (hexData.startsWith('0x')) {
      hexData = hexData.slice(2)
    }
    if (!/^([a-f0-9]{2})*$/i.test(hexData)) {
      throw new Error('Invalid hex data')
    }
    this.data = hexData.toLowerCase()
  }

  get length() {
    return (this.data.length - this.offset) / 2
  }

  skipBytes(n: number) {
    if (this.offset + n * 2 > this.data.length) {
      throw new Error('Not enough data')
    }
    this.offset += n * 2
  }

  readBytes(n: number) {
    if (this.offset + n * 2 > this.data.length) {
      throw new Error('Not enough data')
    }
    const result = this.data.slice(this.offset, this.offset + n * 2)
    this.offset += n * 2
    return `0x${result}`
  }

  readRemainingBytes() {
    return this.readBytes(this.length)
  }

  readUint8() {
    return Number(this.readBytes(1))
  }

  readUint16() {
    return Number(this.readBytes(2))
  }

  readUint32() {
    return Number(this.readBytes(4))
  }

  readUint64() {
    return BigInt(this.readBytes(8))
  }

  readUint128() {
    return BigInt(this.readBytes(16))
  }

  readUint256() {
    return BigInt(this.readBytes(32))
  }
}
