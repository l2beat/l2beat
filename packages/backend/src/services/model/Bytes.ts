export class Bytes {
  private constructor(private value: string) {}

  static EMPTY = new Bytes('')

  static fromHex(value: string) {
    if (!isHexString(value)) {
      throw new TypeError('Hex string expected')
    }
    return new Bytes(normalizeHexString(value))
  }

  static fromBuffer(value: Buffer) {
    return Bytes.fromHex(value.toString('hex'))
  }

  static fromByte(value: number) {
    if (!isByte(value)) {
      throw new TypeError('Byte expected')
    }
    return new Bytes(numberToHex(value))
  }

  static fromNumber(value: number) {
    if (!isNonNegativeInteger(value)) {
      throw new TypeError('Non-negative integer expected')
    }
    if (value === 0) {
      return Bytes.EMPTY
    }
    return new Bytes(numberToHex(value))
  }

  static fromByteArray(value: number[]) {
    if (!Array.isArray(value) || !value.every(isByte)) {
      throw new TypeError('Array of bytes expected')
    }
    return new Bytes(value.map(numberToHex).join(''))
  }

  equals(other: Bytes) {
    return this.value === other.value
  }

  toNumber() {
    return parseInt(this.value || '0', 16)
  }

  toByteArray() {
    const array = new Array<number>(this.length)
    for (let i = 0; i < this.length; i++) {
      array[i] = this.get(i)
    }
    return array
  }

  toHex() {
    return this.value
  }

  toBuffer() {
    return Buffer.from(this.value, 'hex')
  }

  get(index: number) {
    if (!isNonNegativeInteger(index) || index >= this.length) {
      throw new Error('Index out of bounds')
    }
    const value = this.value[index * 2] + this.value[index * 2 + 1]
    return parseInt(value, 16)
  }

  get length() {
    return this.value.length / 2
  }

  slice(start: number, end: number) {
    return new Bytes(this.value.slice(start * 2, end * 2))
  }

  concat(other: Bytes) {
    return new Bytes(this.value + other.value)
  }
}

const HEX_REGEX = /^(0x)?[a-f\d]*$/i
function isHexString(value: unknown): value is string {
  return typeof value === 'string' && HEX_REGEX.test(value)
}

function normalizeHexString(value: string) {
  const hex = value.startsWith('0x') ? value.substring(2) : value
  return normalizeHexLength(hex.toLowerCase())
}

function normalizeHexLength(hex: string) {
  return hex.length % 2 === 0 ? hex : '0' + hex
}

function numberToHex(value: number) {
  return normalizeHexLength(value.toString(16))
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0
}

function isByte(value: unknown): value is number {
  return isNonNegativeInteger(value) && value < 256
}
