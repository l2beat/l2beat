import { Bytes } from '../model'

export class KeccakHash {
  private bytes: Bytes

  constructor(hex: string) {
    this.bytes = Bytes.fromHex(hex)
    if (this.bytes.length !== 32) {
      throw new TypeError('KeccakHash must be exactly 32 bytes')
    }
  }

  equals(other: KeccakHash) {
    return this.bytes.equals(other.bytes)
  }

  toString() {
    return this.bytes.toString()
  }
}
