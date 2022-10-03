export class ByteReader {
  private position = 0

  constructor(private readonly value: string) {
    if (value.startsWith('0x')) {
      this.value = value.slice(2)
    }
  }

  getBytes(n: number) {
    const bytes = this.value.slice(this.position * 2, (this.position + n) * 2)
    this.position += n
    return bytes
  }

  getNumber(n: number) {
    const bytes = this.getBytes(n)
    return parseInt(bytes, 16)
  }
}
