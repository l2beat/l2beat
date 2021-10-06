import { Bytes } from './Bytes'

export class KeccakHash {
  private bytes: Bytes

  constructor(bytes: string | Bytes) {
    this.bytes = bytes instanceof Bytes ? bytes : Bytes.fromHex(bytes)
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
