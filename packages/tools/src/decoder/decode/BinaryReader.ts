export class BinaryReader {
  private position = 0
  constructor(private readonly input: `0x${string}`) {}

  isAtEnd() {
    return !this.has(1)
  }

  get length() {
    return this.input.length / 2 - 1
  }

  has(n: number) {
    return this.position + n <= this.length
  }

  read(n: number): `0x${string}` {
    if (!this.has(n)) {
      throw new Error(
        `Cannot read ${n} bytes. Position: ${this.position}, total: ${this.length}`,
      )
    }

    const start = this.position * 2 + 2
    const slice = this.input.slice(start, start + n * 2)
    this.position += n
    return `0x${slice}`
  }
}
